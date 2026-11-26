import { redirect } from "next/navigation";

// Old "Start distributing" link: send people to the release builder.
export default function DistributionStartRedirect() {
  redirect("/distribution/releases/new");
}
