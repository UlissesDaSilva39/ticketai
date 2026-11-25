import { redirect } from "next/navigation";

// Browsing now lives in the /licensing hub; keep old links working.
export default function LicenceTracksRedirect() {
  redirect("/licensing");
}
