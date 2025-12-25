export default function PrivacyPolicy() {
  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Privacy Policy</h1>

      <p>
        Smart MCQ Plugin is a student-developed web application created for
        educational and portfolio purposes. This Privacy Policy explains how the
        application accesses, uses, stores, and protects Google user data in
        compliance with the Google API Services User Data Policy.
      </p>

      <h2>1. Data Accessed</h2>
      <p>
        Smart MCQ Plugin accesses the following Google user data only after the
        user explicitly authenticates using Google Sign-In:
      </p>
      <ul>
        <li>Google account email address</li>
        <li>Basic profile information (such as name and profile picture)</li>
        <li>
          Permission to send emails on behalf of the user using the Gmail API
          (<code>gmail.send</code> scope)
        </li>
      </ul>

      <h2>2. Data Usage</h2>
      <p>
        The accessed Google user data is used strictly for the following
        purposes:
      </p>
      <ul>
        <li>User authentication and account identification</li>
        <li>
          Sending emails initiated explicitly by the user through the
          application’s interface
        </li>
      </ul>
      <p>
        Emails are sent only when the user clicks the “Send Email” button. The
        application does not perform any automated, background, or unsolicited
        email sending.
      </p>

      <h2>3. Data Sharing</h2>
      <p>
        Smart MCQ Plugin does <strong>not</strong> sell, rent, or share Google
        user data with any third parties.
      </p>
      <p>
        The only data transfer that occurs is the delivery of user-initiated
        emails via the Gmail API to recipients specified by the user.
      </p>

      <h2>4. Data Storage and Security</h2>
      <p>
        Smart MCQ Plugin does not store Gmail messages, email content, or Google
        account data on its servers.
      </p>
      <p>
        Authentication credentials and access tokens are handled securely and
        are used only during active user sessions. Industry-standard security
        practices are followed to prevent unauthorized access.
      </p>

      <h2>5. Data Retention and Deletion</h2>
      <p>
        Smart MCQ Plugin does not retain Google user data beyond the active
        session. No Gmail content or personal Google data is stored persistently.
      </p>
      <p>
        Users may revoke the application’s access to their Google account at any
        time through their Google Account security settings.
      </p>
      <p>
        Users may also request clarification or confirmation regarding data
        handling by contacting the developer using the email address below.
      </p>

      <h2>6. User Control and Transparency</h2>
      <p>
        Users have full control over their data and can choose whether or not to
        sign in with Google. The application requests only the minimum required
        permissions to function correctly.
      </p>

      <h2>7. Contact Information</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy or
        data handling practices, please contact:
        <br />
        <strong>manikandansubramanian2005@gmail.com</strong>
      </p>
    </main>
  );
}
