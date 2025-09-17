import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { formName, formDescription, fields, mcqs } = await req.json();

    // 1️⃣ Create form (only title allowed here)
    const createRes = await fetch("https://forms.googleapis.com/v1/forms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        info: { title: formName || "Untitled Quiz" },
      }),
    });

    const form = await createRes.json();
    if (!form.formId) {
      console.error("Error creating form:", form);
      return NextResponse.json(
        { error: "Failed to create form", details: form },
        { status: 500 }
      );
    }

    const formId = form.formId;

    // 2️⃣ Build requests for batchUpdate
    const requests = [];

    // Enable quiz mode
    requests.push({
      updateSettings: {
        settings: { quizSettings: { isQuiz: true } },
        updateMask: "quizSettings.isQuiz",
      },
    });

    // Update description
    if (formDescription) {
      requests.push({
        updateFormInfo: {
          info: { description: formDescription },
          updateMask: "description",
        },
      });
    }

    // Page 1: Fields
    let index = 0;
    fields.forEach((field) => {
      requests.push({
        createItem: {
          item: {
            title: field,
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: index++ },
        },
      });
    });

    // Page break → start Page 2
    requests.push({
      createItem: {
        item: { pageBreakItem: {} },
        location: { index: index++ },
      },
    });

    // Page 2: MCQs
    mcqs.forEach((mcq, i) => {
      requests.push({
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
          location: { index: index++ },
        },
      });

      // Add correct answer + points
      if (mcq.answerKey) {
        requests.push({
          updateItem: {
            item: {
              questionItem: {
                question: {
                  grading: {
                    correctAnswers: { answers: [{ value: mcq.answerKey }] },
                    pointValue: mcq.points || 1,
                  },
                },
              },
            },
            location: { index: index - 1 }, // last inserted mcq
            updateMask: "questionItem.question.grading",
          },
        });
      }
    });

    // 3️⃣ Batch update form
    const batchRes = await fetch(
      `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      }
    );

    const batchResult = await batchRes.json();

    if (batchResult.error) {
      console.error("BatchUpdate error:", batchResult);
      return NextResponse.json(
        { error: "Failed to update form", details: batchResult },
        { status: 500 }
      );
    }

    const formUrl = `https://docs.google.com/forms/d/${formId}/edit`;

    return NextResponse.json({ formUrl });
  } catch (err) {
    console.error("Google Forms API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
