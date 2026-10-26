export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2">Access restricted</h1>
        <p className="text-gray-600 mb-6">
          This area is only available to users with the right role.
          If you think this is a mistake, contact support.
        </p>
        <a
          href="/"
          className="inline-block rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-2 text-white font-semibold"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
