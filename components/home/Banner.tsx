"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

// Drop a real photo at public/banner.jpg and it shows on top of this illustration.
function BannerArt() {
  return (
    <svg viewBox="0 0 520 420" className="absolute inset-0 h-full w-full" role="img" aria-label="Equipment illustration">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="1" stopColor="#134e4a" />
        </linearGradient>
      </defs>
      <rect width="520" height="420" fill="url(#bg)" />
      <circle cx="420" cy="90" r="120" fill="#fbbf24" opacity="0.16" />
      <circle cx="90" cy="360" r="140" fill="#ffffff" opacity="0.06" />
      {/* excavator */}
      <g transform="translate(70 170)">
        <rect x="0" y="95" width="190" height="34" rx="17" fill="#0b2e2c" />
        <circle cx="26" cy="112" r="14" fill="#134e4a" />
        <circle cx="95" cy="112" r="14" fill="#134e4a" />
        <circle cx="164" cy="112" r="14" fill="#134e4a" />
        <rect x="20" y="52" width="120" height="48" rx="8" fill="#fbbf24" />
        <rect x="32" y="26" width="58" height="40" rx="6" fill="#f59e0b" />
        <rect x="42" y="34" width="38" height="22" rx="3" fill="#ccfbf1" opacity="0.85" />
        <path d="M130 62 L210 14 L240 36" stroke="#fbbf24" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M240 36 L262 92" stroke="#f59e0b" strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M250 90 L286 98 L268 124 Z" fill="#0b2e2c" />
      </g>
      {/* camera */}
      <g transform="translate(330 250)">
        <rect x="0" y="12" width="120" height="78" rx="14" fill="#ffffff" opacity="0.95" />
        <rect x="38" y="0" width="44" height="18" rx="6" fill="#ffffff" opacity="0.95" />
        <circle cx="60" cy="51" r="26" fill="#134e4a" />
        <circle cx="60" cy="51" r="16" fill="#0f766e" />
        <circle cx="54" cy="45" r="5" fill="#ccfbf1" opacity="0.8" />
        <rect x="94" y="22" width="14" height="8" rx="3" fill="#fbbf24" />
      </g>
      {/* gear */}
      <g transform="translate(386 60)" fill="none" stroke="#fbbf24" strokeWidth="9" strokeLinecap="round">
        <circle cx="40" cy="40" r="16" />
        <path d="M40 6v10M40 64v10M6 40h10M64 40h10M16 16l7 7M57 57l7 7M16 64l7-7M57 23l7-7" />
      </g>
    </svg>
  );
}

export default function Banner() {
  // Shows public/banner.jpg only if the file exists
  const [photo, setPhoto] = useState(false);
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setPhoto(true);
    img.src = "/banner.jpg";
  }, []);

  return (
    <section className="hero-grid relative overflow-hidden border-b border-base-300 bg-base-200">
      <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary"
          >
            <span className="h-2 w-2 rounded-full bg-accent" /> The equipment rental marketplace
          </motion.span>
          <motion.h1 variants={item} className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Rent the right gear. <span className="text-primary">Skip the ownership.</span>
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-xl text-lg leading-relaxed opacity-75">
            From excavators to cameras, find verified equipment near you, book it for the exact days you need and pay
            securely online, all in one place.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link href="/equipment" className="btn btn-primary btn-lg">
              Browse equipment <FiArrowRight />
            </Link>
            <Link href="/register" className="btn btn-outline btn-lg">
              List your equipment
            </Link>
          </motion.div>
          <motion.ul variants={item} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium opacity-80">
            {["Verified owners", "Flexible rental periods", "Secure Stripe payments"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <FiCheckCircle className="text-primary" /> {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-[2rem] border border-base-300 shadow-2xl"
        >
          <BannerArt />
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/banner.jpg" alt="Rental equipment" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute bottom-4 left-4 rounded-xl bg-base-100 px-4 py-3 shadow-lg"
          >
            <p className="text-xs font-semibold opacity-60">Starting from</p>
            <p className="text-lg font-extrabold">
              $28 <span className="text-sm font-medium opacity-60">/ day</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
