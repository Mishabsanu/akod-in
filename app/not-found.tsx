import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-neutral-500">The page you are looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white">
        Back to Home
      </Link>
    </div>
  );
}
