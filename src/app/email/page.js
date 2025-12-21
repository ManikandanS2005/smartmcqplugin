import { Suspense } from "react";
import EmailClient from "./EmailClient";

export default function EmailPage() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading...</div>}>
      <EmailClient />
    </Suspense>
  );
}
