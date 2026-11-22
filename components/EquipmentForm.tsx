"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import { CATEGORIES, RENTAL_TYPES, type Equipment } from "@/lib/types";
import { canUpload, isHttpUrl, uploadToImgbb } from "@/lib/utils";
import { errorMessage } from "@/lib/api";

export interface EquipmentInput {
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: string;
  quantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
}

const CONDITIONS = ["New", "Like new", "Good", "Fair"];

export const LOCATIONS = [
  "Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh",
  "Gazipur", "Narayanganj", "Cumilla", "Bogura", "Jashore", "Cox's Bazar", "Savar", "Tangail",
];
const OTHER = "Other";

export default function EquipmentForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Equipment;
  submitLabel: string;
  onSubmit: (data: EquipmentInput) => Promise<void>;
  onCancel?: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [f, setF] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    category: initial?.category || CATEGORIES[0],
    location: initial ? (LOCATIONS.includes(initial.location) ? initial.location : OTHER) : "Dhaka",
    otherLocation: initial && !LOCATIONS.includes(initial.location) ? initial.location : "",
    price: initial ? String(initial.price) : "",
    rentalType: initial?.rentalType || "daily",
    quantity: initial ? String(initial.quantity) : "1",
    condition: initial?.condition || "Good",
    brand: initial?.brand || "",
    model: initial?.model || "",
    image: initial?.image || "",
    terms: initial?.terms || "",
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setF((p) => ({ ...p, image: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(f.price);
    const quantity = Number(f.quantity);
    if (f.name.trim().length < 3) return void toast.error("Equipment name must be at least 3 characters");
    if (f.description.trim().length < 10) return void toast.error("Description must be at least 10 characters");
    const location = f.location === OTHER ? f.otherLocation.trim() : f.location;
    if (location.length < 2) return void toast.error("Location is required");
    if (!Number.isFinite(price) || price <= 0) return void toast.error("Rental price must be greater than 0");
    if (!Number.isInteger(quantity) || quantity < 1) return void toast.error("Quantity must be a whole number of at least 1");
    if (!f.brand.trim() || !f.model.trim()) return void toast.error("Brand and model are required");
    if (!isHttpUrl(f.image.trim())) return void toast.error("Enter a valid image link");
    if (f.terms.trim().length < 5) return void toast.error("Rental terms are required");

    setBusy(true);
    try {
      await onSubmit({
        name: f.name.trim(),
        description: f.description.trim(),
        category: f.category,
        location,
        price,
        rentalType: f.rentalType,
        quantity,
        condition: f.condition,
        brand: f.brand.trim(),
        model: f.model.trim(),
        image: f.image.trim(),
        terms: f.terms.trim(),
      });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const label = "mb-1 block text-sm font-semibold";

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={label}>Equipment name</span>
          <input className="input input-bordered w-full" value={f.name} onChange={set("name")} placeholder="e.g. Mini Excavator 1.8T" />
        </label>
        <label className="block">
          <span className={label}>Category</span>
          <select className="select select-bordered w-full" value={f.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>Location</span>
          <select className="select select-bordered w-full" value={f.location} onChange={set("location")}>
            {LOCATIONS.map((l) => (
              <option key={l}>{l}</option>
            ))}
            <option value={OTHER}>Other (type your own)</option>
          </select>
          {f.location === OTHER && (
            <input
              className="input input-bordered mt-2 w-full"
              value={f.otherLocation}
              onChange={set("otherLocation")}
              placeholder="City or area"
            />
          )}
        </label>
        <label className="block">
          <span className={label}>Rental price (USD)</span>
          <input className="input input-bordered w-full" type="number" min="0" step="0.01" value={f.price} onChange={set("price")} />
        </label>
        <label className="block">
          <span className={label}>Rental type</span>
          <select className="select select-bordered w-full capitalize" value={f.rentalType} onChange={set("rentalType")}>
            {RENTAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>Available quantity</span>
          <input className="input input-bordered w-full" type="number" min="1" step="1" value={f.quantity} onChange={set("quantity")} />
        </label>
        <label className="block">
          <span className={label}>Condition</span>
          <select className="select select-bordered w-full" value={f.condition} onChange={set("condition")}>
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>Brand</span>
          <input className="input input-bordered w-full" value={f.brand} onChange={set("brand")} />
        </label>
        <label className="block">
          <span className={label}>Model</span>
          <input className="input input-bordered w-full" value={f.model} onChange={set("model")} />
        </label>
      </div>

      <div>
        <span className={label}>Equipment image</span>
        <div className="flex gap-2">
          <input
            className="input input-bordered w-full"
            placeholder="Direct image link (https://...)"
            value={f.image}
            onChange={set("image")}
          />
          {canUpload() && (
            <>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
              <button type="button" className="btn btn-outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <span className="loading loading-spinner loading-sm" /> : <FiUpload />} Upload
              </button>
            </>
          )}
        </div>
        {f.image && isHttpUrl(f.image) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={f.image} alt="Preview" className="mt-3 h-32 w-48 rounded-lg border border-base-300 object-cover" />
        )}
      </div>

      <label className="block">
        <span className={label}>Description</span>
        <textarea className="textarea textarea-bordered min-h-28 w-full" value={f.description} onChange={set("description")} />
      </label>
      <label className="block">
        <span className={label}>Rental terms and conditions</span>
        <textarea className="textarea textarea-bordered min-h-24 w-full" value={f.terms} onChange={set("terms")} />
      </label>

      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary" disabled={busy || uploading}>
          {busy && <span className="loading loading-spinner loading-sm" />} {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
