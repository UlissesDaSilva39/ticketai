import { redirect } from "next/navigation";

// /messaging used to show hard-coded demo conversations; the real inbox is /messages.
export default function MessagingPage() {
  redirect("/messages");
}
