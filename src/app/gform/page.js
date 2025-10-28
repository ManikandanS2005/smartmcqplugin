"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const GFormsPage = () => {
  const [formLink, setFormLink] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get published (not edit) form link from sessionStorage
    const link = sessionStorage.getItem("generatedFormLink");
    if (link) {
      const publishedLink = link.replace("edit", "viewform"); // ✅ Ensure published form version
      setFormLink(publishedLink);
    }
    setLoading(false);
  }, []);

  const handleCopy = () => {
    if (formLink) {
      navigator.clipboard.writeText(formLink);
      alert("Form link copied!");
    }
  };

  const handleNavigateToEmail = () => {
    router.push(`/email?link=${encodeURIComponent(formLink)}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Generated Google Form</h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : formLink ? (
          <div className="space-y-4">
            <a
              href={formLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline block"
            >
              Open Published Google Form
            </a>
            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Copy Link
            </button>

            <button
              onClick={handleNavigateToEmail}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
            >
              Send Form via Email
            </button>
          </div>
        ) : (
          <p className="text-gray-400">No form generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default GFormsPage;
