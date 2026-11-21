import Link from "next/link";
import { FiXCircle } from "react-icons/fi";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg rounded-box border border-base-300 bg-base-100 p-8 text-center shadow-lg">
        <FiXCircle className="mx-auto h-16 w-16 text-warning" />
        <h1 className="mt-4 text-3xl font-extrabold">Payment cancelled</h1>
        <p className="mt-2 opacity-70">No money was taken and your booking was not confirmed. You can try again any time.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/equipment" className="btn btn-primary">Back to equipment</Link>
          <Link href="/dashboard/my-rentals" className="btn btn-outline">My rentals</Link>
        </div>
      </div>
    </div>
  );
}
