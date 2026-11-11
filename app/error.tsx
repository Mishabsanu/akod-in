"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/** Something failed while loading a page: offer a retry instead of a blank screen. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-light tracking-tight text-neutral-900">Something went wrong</h1>
      <p className="mt-2 text-neutral-500">Please try again. If it keeps happening, message us on WhatsApp.</p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700"
        >
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
        <Link href="/" className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 hover:border-neutral-900">
          Home
        </Link>
      </div>
    </div>
  );
}
