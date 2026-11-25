"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-5 py-3 rounded-xl font-bold border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
    >
      Save agreement as PDF
    </button>
  );
}
