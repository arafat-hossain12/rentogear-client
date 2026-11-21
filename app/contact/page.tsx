"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { isEmail } from "@/lib/utils";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return void toast.error("Please enter your name");
    if (!isEmail(email.trim())) return void toast.error("Please enter a valid email address");
    if (message.trim().length < 10) return void toast.error("Please write a short message");
    toast.success("Thanks! Your message has been received.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Contact us</h1>
        <p className="mt-3 opacity-70">Questions about a booking or listing? Send us a message.</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-5">
        <ul className="space-y-4 md:col-span-2">
          {[
            { icon: FiMapPin, text: "Dhaka, Bangladesh" },
            { icon: FiPhone, text: "+880 1700 000000" },
            { icon: FiMail, text: "support@rentogear.com" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon />
              </span>
              <span className="font-medium">{text}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={onSubmit} className="space-y-4 rounded-box border border-base-300 bg-base-100 p-6 md:col-span-3" noValidate>
          <input className="input input-bordered w-full" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" className="input input-bordered w-full" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea className="textarea textarea-bordered w-full" rows={5} placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="btn btn-primary w-full">Send message</button>
        </form>
      </div>
    </div>
  );
}
