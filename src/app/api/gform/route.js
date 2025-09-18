// src/app/api/gform/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

function findMatchingOption(options = [], rawAnswer) {
  if (!rawAnswer) return null;
  const answer = String(rawAnswer).trim();

  // 1) Single letter answer: "A", "b", ...
  if (/^[A-Za-z]$/.test(answer)) {
    const idx = answer.toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < options.length) return options[idx];
  }

  // 2) 1-based numeric index: "1", "2"
  if (/^\d+$/.test(answer)) {
    const n = parseInt(answer, 10) - 1;
    if (n >= 0 && n < options.length) return options[n];
  }

  // 3) Exact match (case-insensitive, trimmed)
  const exact = options.find(
    (opt) => (opt ?? "").trim().toLowerCase() === answer.toLowerCase()
  );
  if (exact) return exact;

  // 4) Contains match (case-insensitive) - last resort
  const contains = options.find((opt) =>
    (opt ?? "").toLowerCase().includes(answer.toLowerCase())
  );
  if (contains) return contains;

  return null;
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { formName, formDescription, fields = [], mcqs = [] } = await req.json();

    // 1) Create form (title only)
    const createRes = await fetch("https://forms.googleapis.com/v1/forms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ info: { title: formName || "Untitled Quiz" } }),
    });
    const form = await createRes.json();
    if (!form?.formId) {
      console.error("Error creating form:", form);
      return NextResponse.json({ error: "Failed to create form", details: form }, { status: 500 });
    }
    const formId = form.formId;

    // 2) Enable quiz mode and set description
    const settingsRequests = [
      {
        updateSettings: {
          settings: { quizSettings: { isQuiz: true } },
          updateMask: "quizSettings.isQuiz",
        },
      },
    ];
    if (formDescription) {
      settingsRequests.push({
        updateFormInfo: { info: { description: formDescription }, updateMask: "description" },
      });
    }

    await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests: settingsRequests }),
    });

    // 3) Add standard/custom fields sequentially (keeps order stable)
    let index = 0;
    for (const field of fields) {
      await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              createItem: {
                item: {
                  title: field,
                  questionItem: { question: { required: true, textQuestion: { paragraph: false } } },
                },
                location: { index: index++ },
              },
            },
          ],
        }),
      });
    }

    // Page break → start MCQ section
    await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [{ createItem: { item: { pageBreakItem: {} }, location: { index: index++ } } }],
      }),
    });

    // 4) Create each MCQ (request response) and then apply grading using returned itemId and location
    for (const mcq of mcqs) {
      if (!mcq || !mcq.question || !Array.isArray(mcq.options)) {
        console.warn("Skipping invalid MCQ (missing question/options):", mcq);
        continue;
      }

      // create MCQ and request created form in response to get item info
      const createMcqRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              createItem: {
                item: {
                  title: mcq.question,
                  questionItem: {
                    question: {
                      required: true,
                      choiceQuestion: {
                        type: "RADIO",
                        options: mcq.options.map((opt) => ({ value: opt })),
                        shuffle: false,
                      },
                    },
                  },
                },
                location: { index: index++ }, // remember index where created
              },
            },
          ],
          includeFormInResponse: true, // get item info back
        }),
      });

      const createMcqJson = await createMcqRes.json();
      if (createMcqJson?.error) {
        console.error("Error creating MCQ:", createMcqJson);
        continue;
      }

      // Extract itemId and createdIndex robustly
      const createdIndex =
        // replies[0].createItem.location.index is sometimes present
        createMcqJson.replies?.[0]?.createItem?.location?.index ??
        // if not, the index we used is index-1
        index - 1;

      const itemId =
        createMcqJson.replies?.[0]?.createItem?.item?.itemId ||
        createMcqJson.form?.items?.slice(-1)[0]?.itemId;

      if (!itemId) {
        console.error("Could not locate itemId for MCQ creation result:", createMcqJson);
        continue;
      }

      // Determine the correct option value (supports "A","1", exact text, substring)
      const matched = findMatchingOption(mcq.options, mcq.answer);
      if (!matched) {
        console.warn(
          `Could not match answer "${mcq.answer}" to any option for question "${mcq.question}". Skipping grading for this question.`
        );
        continue;
      }

      // Apply grading - include location to satisfy API requirement
      const gradingReqBody = {
        requests: [
          {
            updateItem: {
              item: {
                itemId,
                questionItem: {
                  question: {
                    grading: {
                      correctAnswers: { answers: [{ value: matched }] },
                      pointValue: mcq.points || 1,
                    },
                  },
                },
              },
              // <--- location is required in some API checks; include the created index
              location: { index: createdIndex },
              updateMask: "questionItem.question.grading",
            },
          },
        ],
      };

      const gradeRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gradingReqBody),
      });

      const gradeJson = await gradeRes.json();
      if (gradeJson?.error) {
        console.error("Failed to apply grading for itemId", itemId, gradeJson);
      }
    }

    // 5) Return edit URL
    const formUrl = `https://docs.google.com/forms/d/${formId}/edit`;
    return NextResponse.json({ formUrl });
  } catch (err) {
    console.error("Google Forms API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
1