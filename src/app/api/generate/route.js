import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Use private env key (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { role, forWhom, topic, choices, count, additionalDesc } = body;

    if (!role || !forWhom || !topic || !count || !choices) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Act as a ${role} creating MCQs for ${forWhom}.
Generate ${count} MCQs on the topic "${topic}".
Each question should have ${choices} choices, with only one correct answer.
Additional Instructions: ${additionalDesc}

Return strictly a raw JSON array. Do NOT use triple backticks or markdown. Example format:
[
  {
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
  }
]
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let text = result.response.text();
    console.log("🧠 Gemini Raw Response:", text);

    // ✅ Remove triple backticks (if any)
    text = text.replace(/```json|```/g, "").trim();

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate MCQs",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
