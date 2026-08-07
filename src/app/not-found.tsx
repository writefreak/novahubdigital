export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold text-accent">404</h1>
      <p className="text-neutral-700 mt-4">Oops! This page doesn't exist.</p>
      <a
        href="/dashboard"
        className="mt-8 bg-accent text-white px-6 py-3 rounded-full text-sm hover:bg-blue transition-colors"
      >
        Return to dashboard
      </a>
    </div>
  );
}
