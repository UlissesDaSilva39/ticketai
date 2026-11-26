import Link from "next/link";

export const metadata = { title: "Contact | GRID", description: "Get in touch with the GRID team." };

const CHANNELS = [
  { title: "General questions", body: "Accounts, features, feedback or anything else.", email: "hello@grid.app" },
  { title: "Licensing", body: "Licence deals, the GRID Programme and rights questions.", email: "licensing@grid.app" },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">Contact</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-10">Get in touch with the GRID team. We usually reply within 2 working days.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((c) => (
          <li key={c.email} className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h2 className="font-bold text-gray-900 dark:text-white">{c.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">{c.body}</p>
            <a href={`mailto:${c.email}`} className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">{c.email}</a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-10">
        Already a member? Questions about the app are often answered by Remi, the guide in the bottom-right corner after you <Link href="/login" className="underline">log in</Link>.
      </p>
    </main>
  );
}
