import { redirect } from "next/navigation";

// Live streams now happen in GRID LIVE (chat, gifts, shop).
export default function StreamLiveRedirect() {
  redirect("/live");
}
