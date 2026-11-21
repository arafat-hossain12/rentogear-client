"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-error">Oops</p>
        <h1 className="mt-2 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 opacity-70">An unexpected error happened. Please try again.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn btn-primary" onClick={() => reset()}>Try again</button>
          <Link href="/" className="btn btn-outline">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
