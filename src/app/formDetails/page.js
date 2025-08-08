"use client";
import React, { useState } from "react";
import { useFormInfo } from "@/context/FormInfoContext";

const Page = () => {
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

  const [newField, setNewField] = useState("");

  const addField = () => {
    if (newField.trim()) {
      addCustomField(newField);
      setNewField("");
    }
  };

  const handleSubmit = () => {
    const formDetails = {
      formName,
      formDescription,
      fields: [
        ...(includeName ? ["Name"] : []),
        ...(includeRollNo ? ["Roll No"] : []),
        ...customFields,
      ],
    };
    console.log("Generated Form Details:", formDetails);
    // You can save this in context or send it to Google Scripts API here
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
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Form Description */}
        <div className="mb-4">
          <label className="block mb-1">Form Description:</label>
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Enter form description"
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
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
              className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
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
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
        >
          Generate Form
        </button>
      </div>
    </div>
  );
};

export default Page;
