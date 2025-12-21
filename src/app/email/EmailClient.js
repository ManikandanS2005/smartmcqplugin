"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const EmailClient = () => {
  const { data: session } = useSession();
  const params = useSearchParams();
  const formLink = params.get("link");

  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("Your Assessment Form");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!receiver || !formLink) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: session?.user?.email,
          receiver,
          subject,
          message: `Hello,\n\nPlease fill out the assessment form below:\n${formLink}\n\nRegards,\n${session?.user?.name}`,
          accessToken: session?.accessToken,
        }),
      });

      const data = await res.json();
      alert(data.success ? "✅ Email sent successfully!" : "❌ " + data.error);
    } catch {
      alert("❌ Error sending email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Send Google Form via Email
        </h1>

        <p className="text-sm mb-4 text-gray-400">
          Logged in as:{" "}
          <span className="text-blue-400">{session?.user?.email}</span>
        </p>

        <input
          type="email"
          placeholder="Receiver Email"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600"
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`w-full py-2 rounded-lg ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </div>
    </div>
  );
};

export default EmailClient;
