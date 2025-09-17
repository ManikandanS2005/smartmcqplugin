// src/app/formDetails/page.js
"use client";
import React, { useState } from "react";
import { useFormInfo } from "@/context/FormInfoContext";
import { useMCQ } from "@/context/MCQContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const FormDetailsPage = () => {
  const {
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    includeName,
    setIncludeName,
    includeRollNo,
    setIncludeRollNo,
    customFields,
    addCustomField,
  } = useFormInfo();

  const { generatedMCQs } = useMCQ();
  const [newField, setNewField] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const addField = () => {
    if (newField.trim()) {
      addCustomField(newField);
      setNewField("");
    }
  };

  const handleSubmit = async () => {
    if (status !== "authenticated") {
      alert("Please sign in with Google to generate the form.");
      return;
    }

    const payload = {
      formName,
      formDescription,
      fields: [
        ...(includeName ? ["Name"] : []),
        ...(includeRollNo ? ["Roll No"] : []),
        ...customFields,
      ],
      // pass MCQs as-is; server will map into the Forms API schema
      mcqs: generatedMCQs,
    };

    try {
      setLoading(true);

      const res = await fetch("/api/gform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("API response from /api/gform:", data);

      if (data?.formUrl) {
        // store and navigate
        sessionStorage.setItem("generatedFormLink", data.formUrl);
        router.push("/gform");
      } else {
        alert(`Failed to generate form: ${data?.error || "unknown error"}`);
      }
    } catch (err) {
      console.error("Error generating form:", err);
      alert("Something went wrong while generating the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">SMARTPLUGIN</h1>
        <h2 className="text-lg font-semibold mb-4">Create Google Form</h2>

        {/* Form Name */}
        <div className="mb-4">
          <label className="block mb-1">Form Name:</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>

        {/* Form Description */}
        <div className="mb-4">
          <label className="block mb-1">Form Description:</label>
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Enter form description"
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>

        {/* Standard Fields */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Select Standard Fields</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeName}
              onChange={(e) => setIncludeName(e.target.checked)}
              className="accent-blue-500"
            />
            <span>Name</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={includeRollNo}
              onChange={(e) => setIncludeRollNo(e.target.checked)}
              className="accent-blue-500"
            />
            <span>Roll No</span>
          </label>
        </div>

        {/* Custom Fields */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Custom Fields</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              placeholder="Enter custom field name"
              className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600"
            />
            <button
              onClick={addField}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Add Field
            </button>
          </div>
          <ul className="list-disc list-inside text-gray-300">
            {customFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold flex justify-center"
        >
          {loading ? "Generating..." : "Generate Form"}
        </button>
      </div>
    </div>
  );
};

export default FormDetailsPage;
