"use client";
import React, { useEffect, useState } from "react";

const GFormsPage = () => {
  const [formLink, setFormLink] = useState("");

  useEffect(() => {
    const link = sessionStorage.getItem("generatedFormLink");
    if (link) setFormLink(link);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Generated Google Form</h1>
        {formLink ? (
          <a
            href={formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            Open Google Form
          </a>
        ) : (
          <p>No form generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default GFormsPage;
