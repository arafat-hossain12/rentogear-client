import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-primary">404</p>
        <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 opacity-70">The page you are looking for does not exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/equipment" className="btn btn-outline">Browse equipment</Link>
        </div>
      </div>
    </div>
  );
}
