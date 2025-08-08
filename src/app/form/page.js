"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import { useMCQ } from "@/context/MCQContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();
  const { setGeneratedMCQs } = useMCQ();
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
      let parsed = typeof data.response === "string"
        ? JSON.parse(data.response)
        : data.response;

      if (!Array.isArray(parsed)) throw new Error("MCQ format invalid — expected an array.");

      setGeneratedMCQs(parsed); // ✅ Store in context
      router.push("/edit"); // ✅ Go to edit page
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

      <div className="flex flex-col">
        <Label htmlFor="topic" className="m-2">Topic</Label>
        <Input id="topic" name="topic" value={formData.topic || ""} onChange={handleChange} className="m-2" />
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
    </div>
  );
};

export default Page;
