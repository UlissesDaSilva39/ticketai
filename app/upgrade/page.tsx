import { redirect } from "next/navigation";

// /upgrade was an empty placeholder; upgrades happen on /pro.
export default function UpgradePage() {
  redirect("/pro");
}
