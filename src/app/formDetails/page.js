"use client";

import React, { useState } from "react";
import { useFormInfo } from "@/context/FormInfoContext";
import { useMCQ } from "@/context/MCQContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormDetailsPage() {

  const {
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    customFields,
    addCustomField,
    removeField,
    toggleRequired,
    setFieldExample,
  } = useFormInfo();

  const { generatedMCQs } = useMCQ();

  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("Paragraph");
  const [optionsString, setOptionsString] = useState("");
  const [activeExample, setActiveExample] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const handleAddField = () => {
    if (!fieldName.trim()) return;

    const optionsArray = optionsString
      .split(",")
      .map((o) => o.trim())
      .filter((o) => o);

    addCustomField(fieldName, fieldType, optionsArray);
    setFieldName("");
    setOptionsString("");
  };

  const handleSubmit = async () => {
    if (!session) return alert("Login first");

    setLoading(true);

    const res = await fetch("/api/gform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formName,
        formDescription,
        fields: customFields,
        mcqs: generatedMCQs,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.formUrl) {
      sessionStorage.setItem("generatedFormLink", data.formUrl);
      router.push("/gform");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* LEFT BUILDER (UNCHANGED UI) */}

      <div className="bg-gray-800 p-8 rounded-xl shadow-md">
        <h1 className="text-xl font-semibold text-[#ebeef7] mb-6">Form Setup</h1>

        <input
          value={formName || ""}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Form Title"
          className="w-full p-3 mb-4 border border-[#dadce0] rounded"
        />

        <textarea
          value={formDescription || ""}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder="Form Description"
          className="w-full p-3 mb-6 border border-[#dadce0] rounded"
        />

        <div className="flex gap-2 mb-3">

          <input
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Field Label"
            className="flex-1 p-3 border border-[#dadce0] rounded"
          />

          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="p-3 bg-gray-700 border border-[#dadce0] rounded"
          >
            <option>Paragraph</option>
            <option>Number</option>
            <option>Alphanumeric</option>
            <option>Email</option>
            <option>Date</option>
            <option>Dropdown</option>
            <option>Checkbox</option>
          </select>

          <button
            onClick={handleAddField}
            className="bg-[#1a73e8] text-white px-4 rounded"
          >
            +
          </button>

        </div>

        {(fieldType === "Dropdown" || fieldType === "Checkbox") && (
          <input
            value={optionsString}
            onChange={(e) => setOptionsString(e.target.value)}
            placeholder="Options (comma separated)"
            className="w-full p-2 border border-[#dadce0] rounded mb-4"
          />
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-[#1a73e8] text-white py-3 rounded mt-4 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Generating...
            </>
          ) : (
            "Generate Google Form"
          )}
        </button>

      </div>

      {/* RIGHT PREVIEW */}

      <div className="bg-white rounded-xl shadow-md overflow-y-auto h-[85vh]">

        <div className="p-6 border-b border-[#dadce0]">
          <h2 className="text-2xl font-semibold text-[#202124]">
            {formName || "Untitled Form"}
          </h2>
          <p className="text-[#5f6368] mt-1">
            {formDescription || "Form description will appear here"}
          </p>
        </div>

        <div className="p-6 space-y-5 bg-[#f8f9fa]">

          <AnimatePresence>

            {customFields.map((field) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg border border-[#dadce0]"
              >

                <div className="flex justify-between items-center mb-2">

                  <label className="text-[15px] text-[#202124] font-medium">
                    {field.name}
                    {field.required && (
                      <span className="text-red-600 ml-1">*</span>
                    )}
                  </label>

                  <div className="flex gap-4">

                    <button
                      onClick={() => toggleRequired(field.id)}
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${
                        field.required
                          ? "border-red-500 text-red-600 bg-red-50"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {field.required ? "Required" : "Optional"}
                    </button>

                    <button
                      onClick={() => removeField(field.id)}
                      className="text-red-600 text-sm font-medium"
                    >
                      Remove
                    </button>

                  </div>

                </div>

                {/* EXAMPLE HOVER CLICK */}

                {field.example ? (

                  activeExample === field.id ? (

                    <motion.input
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      value={field.example}
                      onChange={(e) =>
                        setFieldExample(field.id, e.target.value)
                      }
                      onBlur={() => setActiveExample(null)}
                      autoFocus
                      className="w-full border text-black border-[#dadce0] rounded px-2 py-1 text-sm mb-2"
                    />

                  ) : (

                    <p
                      onClick={() => setActiveExample(field.id)}
                      className="text-xs text-[#5f6368] mb-2 cursor-pointer hover:underline"
                    >
                      Example: {field.example}
                    </p>

                  )

                ) : (

                  <p
                    onClick={() => {
                      setFieldExample(field.id, " ");
                      setActiveExample(field.id);
                    }}
                    className="text-xs text-[#1a73e8] mb-2 cursor-pointer"
                  >
                    Add Example
                  </p>

                )}

                <input className="w-full border border-[#dadce0] rounded px-3 py-2"/>

              </motion.div>
            ))}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}