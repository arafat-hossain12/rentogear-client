"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiUpload } from "react-icons/fi";
import AuthShell from "@/components/AuthShell";
import GoogleButton from "@/components/GoogleButton";
import { useAuth } from "@/components/AuthProvider";
import { authClient } from "@/lib/auth-client";
import { canUpload, isEmail, isHttpUrl, passwordProblem, uploadToImgbb } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState<"customer" | "owner">("customer");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setPhoto(await uploadToImgbb(file));
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return void toast.error("Please enter your name");
    if (!isEmail(email.trim())) return void toast.error("Please enter a valid email address");
    if (!photo.trim() || !isHttpUrl(photo.trim())) return void toast.error("Please provide a valid photo link or upload a photo");
    const problem = passwordProblem(password);
    if (problem) return void toast.error(problem);

    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: photo.trim(),
      role,
    });
    setBusy(false);

    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }
    toast.success("Registration successful! Welcome to RentoGear.");
    router.replace("/");
  };

  return (
    <AuthShell title="Create your account" subtitle="Rent equipment or list your own in minutes">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Name</span>
          <input
            className="input input-bordered w-full"
            placeholder="Your full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Email</span>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <div>
          <span className="mb-1 block text-sm font-semibold">Photo</span>
          <div className="flex gap-2">
            <input
              className="input input-bordered w-full"
              placeholder="Direct image link (https://...)"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />
            {canUpload() && (
              <>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  title="Upload to imgbb"
                >
                  {uploading ? <span className="loading loading-spinner loading-sm" /> : <FiUpload />}
                </button>
              </>
            )}
          </div>
          {isHttpUrl(photo.trim()) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.trim()} alt="Preview" className="mt-2 h-14 w-14 rounded-full object-cover ring ring-primary/40" />
          )}
        </div>

        <div>
          <span className="mb-1 block text-sm font-semibold">I want to</span>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["customer", "Rent equipment"],
                ["owner", "List my equipment"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`btn ${role === value ? "btn-primary" : "btn-outline"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Password</span>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className="input input-bordered w-full pr-11"
              placeholder="Min 6 characters, upper and lower case"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>

        <button type="submit" className="btn btn-primary w-full" disabled={busy || uploading}>
          {busy && <span className="loading loading-spinner loading-sm" />} Register
        </button>
      </form>

      <div className="divider my-5 text-xs">OR</div>
      <GoogleButton label="Sign up with Google" />

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
