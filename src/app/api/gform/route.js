import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("=== START FORM GENERATION ===");

  try {
    const session = await getServerSession(authOptions);

    /* ================= AUTH CHECK ================= */

    if (!session?.accessToken) {
      console.error("No access token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { formName, formDescription, fields, mcqs } = body;

    console.log("Creating form:", formName);

    /* ================= CREATE FORM ================= */

    const createRes = await fetch("https://forms.googleapis.com/v1/forms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        info: {
          title: formName || "Untitled Form",
        },
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error("Create Form Error:", errorText);
      throw new Error("Failed to create form shell");
    }

    const { formId } = await createRes.json();

    console.log("Form Created:", formId);

    /* ================= REQUEST ARRAY ================= */

    const requests = [
      {
        updateSettings: {
          settings: { quizSettings: { isQuiz: true } },
          updateMask: "quizSettings.isQuiz",
        },
      },
      {
        updateFormInfo: {
          info: { description: formDescription || "" },
          updateMask: "description",
        },
      },
    ];

    let currentIndex = 0;

    /* ================= PAGE 1 FIELDS ================= */

    if (Array.isArray(fields)) {
      console.log("Adding fields:", fields.length);

      fields.forEach((field, i) => {
        const cautions = {
          Number: "⚠️ Please enter numbers only.",
          Email: "⚠️ Please enter a valid email address.",
          Alphanumeric: "⚠️ Letters and numbers only.",
          Date: "Select date using picker.",
        };

        /* CAPTION LOGIC (EXAMPLE + CAUTION) */

        const captionParts = [];

        if (field.example?.trim()) {
          captionParts.push(`Example: ${field.example}`);
        }

        if (cautions[field.type]) {
          captionParts.push(cautions[field.type]);
        }

        const item = {
          title: field.name || `Field ${i + 1}`,
          description: captionParts.join("\n"),
          questionItem: {
            question: {
              required: !!field.required,
            },
          },
        };

        /* FIELD TYPES */

        if (field.type === "Dropdown" || field.type === "Checkbox") {
          item.questionItem.question.choiceQuestion = {
            type: field.type === "Dropdown" ? "DROP_DOWN" : "CHECKBOX",
            options:
              field.options?.length > 0
                ? field.options.map((o) => ({ value: String(o) }))
                : [{ value: "Option 1" }],
          };
        } else if (field.type === "Date") {
          item.questionItem.question.dateQuestion = {
            includeYear: true,
          };
        } else {
          item.questionItem.question.textQuestion = {
            paragraph: field.type === "Paragraph",
          };
        }

        requests.push({
          createItem: {
            item,
            location: { index: currentIndex++ },
          },
        });
      });
    }

    /* ================= PAGE BREAK ================= */

    requests.push({
      createItem: {
        item: {
          title: "Section 2: Assessment",
          pageBreakItem: {},
        },
        location: { index: currentIndex++ },
      },
    });

    /* ================= MCQs ================= */

    if (Array.isArray(mcqs)) {
      console.log("Adding MCQs:", mcqs.length);

      mcqs.forEach((mcq, i) => {
        const options = (mcq.options || []).map((o) => String(o).trim());

        if (!options.length) options.push("No options provided");

        const correct =
          options.includes(mcq.correctAnswer) ? mcq.correctAnswer : options[0];

        requests.push({
          createItem: {
            item: {
              title: mcq.question || `Question ${i + 1}`,
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: "RADIO",
                    options: options.map((opt) => ({ value: opt })),
                  },
                  grading: {
                    pointValue: 1,
                    correctAnswers: {
                      answers: [{ value: correct }],
                    },
                  },
                },
              },
            },
            location: { index: currentIndex++ },
          },
        });
      });
    }

    console.log("Sending batchUpdate:", requests.length);

    /* ================= SEND UPDATE ================= */

    const updateRes = await fetch(
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

    const updateData = await updateRes.json();

    if (updateData.error) {
      console.error("GForm API Error:", updateData.error);
      return NextResponse.json(
        { error: updateData.error.message },
        { status: 400 }
      );
    }

    console.log("=== SUCCESS ===");

    return NextResponse.json({
      formUrl: `https://docs.google.com/forms/d/${formId}/edit`,
    });

  } catch (err) {
    console.error("CRITICAL ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}