"use client";
import React from "react";
import { useMCQ } from "@/context/MCQContext";
import { Input } from "@/components/ui/input";

const EditPage = () => {
  const { generatedMCQs, updateMCQ } = useMCQ();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit MCQs</h1>

      {/* Responsive grid: 1 column on mobile, 2 on md, 3 on lg */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {generatedMCQs.map((q, i) => (
          <div
            key={i}
            className="border p-4 rounded shadow space-y-2 bg-black"
          >
            <Input
              value={q.question}
              onChange={(e) =>
                updateMCQ(i, { ...q, question: e.target.value })
              }
              placeholder={`Question ${i + 1}`}
            />

            {q.options.map((opt, j) => (
              <Input
                key={j}
                value={opt}
                onChange={(e) => {
                  const updatedOptions = [...q.options];
                  updatedOptions[j] = e.target.value;
                  updateMCQ(i, { ...q, options: updatedOptions });
                }}
                placeholder={`Option ${j + 1}`}
              />
            ))}

            <Input
              value={q.answer}
              onChange={(e) =>
                updateMCQ(i, { ...q, answer: e.target.value })
              }
              placeholder="Answer"
              className="text-green-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditPage;
