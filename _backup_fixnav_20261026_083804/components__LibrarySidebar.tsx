export default function LibrarySidebar({
  signedIn,
  profile,
}: {
  signedIn: boolean;
  profile?: any;
}) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-white/90">Your Library</h2>
        {signedIn ? (
          <p className="mt-2 text-xs text-white/60">
            Signed in as {profile?.display_name ?? "user"}
          </p>
        ) : (
          <p className="mt-2 text-xs text-white/60">
            Sign in to save artists and events.
          </p>
        )}
      </div>
    </aside>
  );
}
