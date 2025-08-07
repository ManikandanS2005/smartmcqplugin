"use client";
import React, { useState } from "react";
import { useFormContext } from "@/context/FormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { formData, updateFormData } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [mcqs, setMcqs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const generateMCQs = async () => {
    setLoading(true);
    

    const payload = {
      role: formData.role,
      forWhom: formData.forWhom,
      topic: formData.topic,
      choices: parseInt(formData.choices) || 4,
      count: parseInt(formData.mcqno) || 20,
      additionalDesc: formData.additionalDesc,
    };
    console.log(`${formData.forWhom}hii`)
    console.log(JSON.stringify(payload))

   try {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data = await res.json();
  console.log("🧠 Gemini Raw Response:", data.response);

  const parsed = typeof data.response === "string" ? JSON.parse(data.response) : data.response;

  setMcqs(parsed);
  console.log("✅ Parsed MCQs:", parsed);

} catch (err) {
  console.error("❌ API Call or JSON Parsing Error:", err);
  alert("Something went wrong while generating MCQs.");
} finally {
  setLoading(false);
}

  };

  return (
    <div className="max-w-xl mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold text-center">
        Smart Assessment – Instantly Generate MCQs with AI!
      </h1>

      {/* Inputs */}
      <div className="flex flex-col">
        <Label htmlFor="topic" className="m-2">Topic</Label>
        <Input id="topic" name="topic" value={formData.topic || " "} onChange={handleChange} className="m-2" />
      </div>

      <div className="flex flex-col">
        <Label htmlFor="mcqno" className="m-2">No. of MCQs</Label>
        <Input id="mcqno" type="number" name="mcqno" value={formData.mcqno || "20"} onChange={handleChange} className="m-2" />
      </div>

      <div className="flex flex-col">
        <Label htmlFor="choices" className="m-2">Choices per MCQ</Label>
        <Input id="choices" type="number" name="choices" value={formData.choices || "4"} onChange={handleChange} className="m-2" />
      </div>

      <div className="flex flex-col">
        <Label htmlFor="additionalDesc" className="m-2">Additional Instructions</Label>
        <Input id="additionalDesc" name="additionalDesc" value={formData.additionalDesc || ""} onChange={handleChange} className="m-2" />
      </div>

      <Button onClick={generateMCQs} disabled={loading}>
        {loading ? "Generating..." : "Generate MCQs"}
      </Button>

      {/* Output */}
      {mcqs.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Generated MCQs</h2>
          {mcqs.map((q, i) => (
            <div key={i} className="border p-4 rounded shadow">
              <p className="font-medium">{i + 1}. {q.question}</p>
              <ul className="list-disc pl-6">
                {q.options.map((opt, j) => (
                  <li key={j}>{opt}</li>
                ))}
              </ul>
              <p className="text-green-600 mt-2">Answer: {q.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
