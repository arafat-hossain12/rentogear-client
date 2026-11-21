import Link from "next/link";

export const metadata = { title: "About us" };

const values = [
  { title: "Transparent pricing", text: "Owners publish their daily, weekly or monthly rate and you always see the full total before paying." },
  { title: "Trusted listings", text: "Every item is reviewed by an admin before it goes live, so what you see is what you rent." },
  { title: "Built for both sides", text: "Customers book in minutes, and owners get a dashboard with bookings, earnings and analytics." },
];

export default function AboutPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">About RentoGear</h1>
        <p className="mt-4 text-lg leading-relaxed opacity-75">
          RentoGear is an equipment rental marketplace. We connect people who own useful equipment with people who need
          it for a short time, so nothing sits idle and nobody has to buy gear they will use once.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-box border border-base-300 bg-base-100 p-6">
            <h2 className="text-lg font-bold">{v.title}</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/equipment" className="btn btn-primary">Explore equipment</Link>
      </div>
    </div>
  );
}
