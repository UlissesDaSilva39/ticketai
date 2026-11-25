import { redirect } from "next/navigation";

// "My licences" now lives in the /licensing hub; keep old links working.
export default function MyLicencesRedirect() {
  redirect("/licensing?tab=mine");
}
