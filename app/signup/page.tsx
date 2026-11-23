import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import SignupForm from "./SignupForm";

export const metadata = { title: "Create your account | GRID" };

const POINTS = [
  "Get matched to gigs and collabs in your genre and city",
  "Secure escrow payments on every deal",
  "Verified badges to build trust",
  "Free to start. No credit card required.",
];

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Already signed in? Skip the form.
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect("/home");
  } catch (e) {
    // redirect() works by throwing; let it through.
    if (e && typeof e === "object" && "digest" in e) throw e;
  }

  const roleParam = (await searchParams).role;
  const initialRole = roleParam === "venue" || roleParam === "promoter" || roleParam === "industry" ? "industry" : "artist";

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-[#f4f2ee] dark:bg-black text-gray-900 dark:text-gray-100">
      <aside className="hidden lg:flex flex-col justify-center px-12 xl:px-20 bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 text-white">
        <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-4">Join the music industry network.</h2>
        <p className="text-lg text-white/85 mb-10">Get booked. Get paid. Build your career on GRID.</p>
        <ul className="space-y-4">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-0.5 flex-none w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm" aria-hidden="true">
                ✓
              </span>
              <span className="text-white/95">{p}</span>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          <SignupForm initialRole={initialRole} />
        </div>
      </section>
    </div>
  );
}
