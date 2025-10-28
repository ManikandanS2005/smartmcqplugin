import { google } from "googleapis";

export async function POST(req) {
  try {
    const { receiver, subject, message, accessToken } = await req.json();
    console.log("Received body:", { receiver, subject, accessToken });

    if (!accessToken) {
      console.error("No access token provided");
      return new Response(
        JSON.stringify({ success: false, error: "No access token provided." }),
        { status: 401 }
      );
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    const emailLines = [
      `From: me`,
      `To: ${receiver}`,
      `Subject: ${subject}`,
      "",
      message,
    ];

    const email = Buffer.from(emailLines.join("\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: email },
    });

    console.log("Gmail API response:", response.data);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Gmail API Error:", error);
    if (error.response) {
      console.error("Gmail API Response Error:", error.response.data);
    }
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
