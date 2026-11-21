"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { api, errorMessage } from "@/lib/api";
import type { Equipment } from "@/lib/types";
import { calcRental, money, rentalLabel, todayISO } from "@/lib/utils";

export default function BookingModal({
  equipment,
  defaultAddress,
  defaultPhone,
  onClose,
}: {
  equipment: Equipment;
  defaultAddress: string;
  defaultPhone: string;
  onClose: () => void;
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [contact, setContact] = useState(defaultPhone);
  const [address, setAddress] = useState(defaultAddress);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const total = start && end ? calcRental(equipment.price, equipment.rentalType, start, end, quantity) : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) return void toast.error("Please select the rental start and end dates");
    if (end < start) return void toast.error("End date must be on or after the start date");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > equipment.quantity)
      return void toast.error(`Quantity must be between 1 and ${equipment.quantity}`);
    if (!/^[0-9+\-\s()]{7,20}$/.test(contact.trim())) return void toast.error("Please enter a valid contact number");
    if (address.trim().length < 5) return void toast.error("Please enter the delivery address");

    setBusy(true);
    try {
      // The server checks availability, calculates the total and opens Stripe Checkout
      const res = await api<{ url: string }>("/bookings/checkout", {
        method: "POST",
        body: {
          equipmentId: equipment._id,
          startDate: start,
          endDate: end,
          quantity,
          contact: contact.trim(),
          address: address.trim(),
          notes: notes.trim(),
        },
      });
      toast.success("Redirecting to secure payment...");
      window.location.href = res.url;
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Book equipment">
      <div className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-t-box bg-base-100 p-5 shadow-2xl sm:rounded-box sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Book {equipment.name}</h2>
            <p className="text-sm opacity-70">
              {money(equipment.price)} per {rentalLabel[equipment.rentalType]} · {equipment.quantity} available
            </p>
          </div>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose} aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Rental start date</span>
              <input
                type="date"
                min={todayISO()}
                className="input input-bordered w-full"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  if (end && e.target.value > end) setEnd("");
                }}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Rental end date</span>
              <input
                type="date"
                min={start || todayISO()}
                className="input input-bordered w-full"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Required quantity</span>
            <input
              type="number"
              min={1}
              max={equipment.quantity}
              className="input input-bordered w-full"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Contact number</span>
            <input
              className="input input-bordered w-full"
              placeholder="+880 1XXX XXXXXX"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Delivery address</span>
            <input
              className="input input-bordered w-full"
              placeholder="House, road, area, city"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Additional notes (optional)</span>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <div className="rounded-xl bg-base-200 p-4 text-sm">
            {total && total.amount > 0 ? (
              <>
                <div className="flex justify-between">
                  <span className="opacity-70">Duration</span>
                  <span>
                    {total.days} day{total.days > 1 ? "s" : ""} ({total.units} {rentalLabel[equipment.rentalType]}
                    {total.units > 1 ? "s" : ""} billed)
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-base font-extrabold">
                  <span>Total amount</span>
                  <span className="text-primary">{money(total.amount)}</span>
                </div>
              </>
            ) : (
              <p className="opacity-70">Choose your dates to see the total.</p>
            )}
          </div>

          <button className="btn btn-primary w-full" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />} Confirm and pay
          </button>
        </form>
      </div>
    </div>
  );
}
