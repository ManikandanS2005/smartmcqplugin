"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import { useMCQ } from "@/context/MCQContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();
  const { setGeneratedMCQs, generatedMCQs } = useMCQ();
  const [loading, setLoading] = useState(false);

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

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      let parsed =
        typeof data.response === "string"
          ? JSON.parse(data.response)
          : data.response;

      if (!Array.isArray(parsed))
        throw new Error("MCQ format invalid — expected an array.");

      setGeneratedMCQs(parsed);
    } catch (err) {
      console.error("❌ API Call or JSON Parsing Error:", err);
      alert("Something went wrong while generating MCQs.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRedirect = () => {
    router.push("/edit");
  };

  const handleVerifyAndProceed = () => {
    let hasEmpty = false;

    for (let mcq of generatedMCQs) {
      if (!mcq.question?.trim() || !mcq.answer?.trim()) {
        hasEmpty = true;
        break;
      }
      if (mcq.options.some((opt) => !opt?.trim())) {
        hasEmpty = true;
        break;
      }
    }

    if (hasEmpty) {
      toast.error(
        "You cannot leave an empty element. If you want to modify the basic structure, modify it in Basic Info Backwards."
      );
      return;
    }

    router.push("/formDetails");
  };

  const showActionButtons = generatedMCQs && generatedMCQs.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold text-center">
        Smart Assessment – Instantly Generate MCQs with AI!
      </h1>

      {/* Inputs */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="topic" className="m-2">
            Topic
          </Label>
          <Input
            id="topic"
            name="topic"
            value={formData.topic || ""}
            onChange={handleChange}
            className="m-2"
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="mcqno" className="m-2">
            No. of MCQs
          </Label>
          <Input
            id="mcqno"
            type="number"
            name="mcqno"
            value={formData.mcqno || "20"}
            onChange={handleChange}
            className="m-2"
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="choices" className="m-2">
            Choices per MCQ
          </Label>
          <Input
            id="choices"
            type="number"
            name="choices"
            value={formData.choices || "4"}
            onChange={handleChange}
            className="m-2"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <Label htmlFor="additionalDesc" className="m-2">
          Additional Instructions
        </Label>
        <Input
          id="additionalDesc"
          name="additionalDesc"
          value={formData.additionalDesc || ""}
          onChange={handleChange}
          className="m-2"
        />
      </div>

      {/* Buttons in one line */}
      <div className="flex justify-between mt-4 items-center ">
        <div><Button onClick={generateMCQs} disabled={loading} className="cursor-pointer hover:bg-white hover:text-black hover:scale-125"  >
          {loading ? "Generating..." : "Generate MCQs"}
        </Button>
        </div>
        <div className=" flex flex-row gap-7">
        {showActionButtons && (
          <>
            <Button variant="secondary" onClick={handleEditRedirect} className="cursor-pointer hover:bg-black hover:text-white hover:scale-125" >
              Edit
            </Button>
            <Button onClick={handleVerifyAndProceed} className="cursor-pointer hover:bg-white hover:text-black hover:scale-125"  >Verified</Button>
          </>
        )}
        </div>
      </div>

      {/* Generated MCQs */}
      {generatedMCQs && generatedMCQs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated MCQs</h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {generatedMCQs.map((q, i) => (
              <div
                key={i}
                className="border p-4 rounded shadow bg-black space-y-2 transform transition-transform duration-300 hover:scale-110"
              >
                <p className="font-medium">
                  {i + 1}. {q.question}
                </p>
                <ul className="list-none pl-0 space-y-1">
                  {q.options.map((opt, j) => {
                    const letter = String.fromCharCode(65 + j); // 65 is 'A'
                    return (
                      <li key={j} className="flex items-start space-x-2">
                        <span className="font-semibold">{letter}.</span>
                        <span>{opt}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="text-green-600 mt-2">Answer: {q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
