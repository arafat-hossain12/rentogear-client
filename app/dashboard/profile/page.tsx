"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import RequireAuth from "@/components/RequireAuth";
import DashHeader from "@/components/DashHeader";
import { useAuth } from "@/components/AuthProvider";
import { api, errorMessage } from "@/lib/api";
import type { Me } from "@/lib/types";
import { canUpload, isHttpUrl, uploadToImgbb } from "@/lib/utils";

function Profile() {
  const { me, refreshMe } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!me) return;
    setName(me.name);
    setImage(me.image);
    setPhone(me.phone);
    setAddress(me.address);
  }, [me]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setImage(await uploadToImgbb(file));
      toast.success("Photo uploaded. Click Save changes to apply it.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return void toast.error("Name must be at least 2 characters");
    if (image.trim() && !isHttpUrl(image.trim())) return void toast.error("Profile image must be a valid link");
    if (phone.trim() && !/^[0-9+\-\s()]{7,20}$/.test(phone.trim())) return void toast.error("Enter a valid phone number");

    setBusy(true);
    try {
      await api<Me>("/me", {
        method: "PATCH",
        body: { name: name.trim(), image: image.trim(), phone: phone.trim(), address: address.trim() },
      });
      await refreshMe();
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DashHeader title="Profile" subtitle="Keep your details up to date" />

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3" noValidate>
        <div className="rounded-box border border-base-300 bg-base-100 p-6 text-center">
          <div className="avatar">
            <div className="w-28 rounded-full ring ring-primary ring-offset-4 ring-offset-base-100">
              {image && isHttpUrl(image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={name} referrerPolicy="no-referrer" />
              ) : (
                <span className="grid h-full w-full place-items-center bg-primary text-4xl font-bold text-primary-content">
                  {(name || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <p className="mt-4 text-lg font-bold">{name || me?.name}</p>
          <p className="text-sm opacity-70">{me?.email}</p>
          <span className="badge badge-primary badge-soft mt-3 capitalize">{me?.role}</span>
        </div>

        <div className="space-y-4 rounded-box border border-base-300 bg-base-100 p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Name</span>
              <input className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Email</span>
              <input className="input input-bordered w-full" value={me?.email || ""} readOnly disabled />
            </label>
          </div>

          <div>
            <span className="mb-1 block text-sm font-semibold">Profile image</span>
            <div className="flex gap-2">
              <input
                className="input input-bordered w-full"
                placeholder="Direct image link (https://...)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Phone number</span>
              <input className="input input-bordered w-full" placeholder="+880 1XXX XXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Address</span>
              <input className="input input-bordered w-full" placeholder="House, road, area, city" value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
          </div>

          <button className="btn btn-primary" disabled={busy || uploading}>
            {busy && <span className="loading loading-spinner loading-sm" />} Save changes
          </button>
        </div>
      </form>
    </>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth bare>
      <Profile />
    </RequireAuth>
  );
}
