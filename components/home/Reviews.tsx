"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa6";
import { SectionHeading, Stars } from "@/components/ui";
import { api } from "@/lib/api";
import type { Review } from "@/lib/types";

// Shown until the server returns reviews (and if it is unreachable)
const fallback: Review[] = [
  { name: "Nusrat Jahan", rating: 5, comment: "Booked a camera kit for a shoot and everything arrived clean and on time. Payment was smooth." },
  { name: "Imran Hossain", rating: 5, comment: "Found a mixer for our small build in minutes. The owner was helpful and the price was fair." },
  { name: "Farhana Akter", rating: 4, comment: "Great variety of equipment. The delivery address option saved me a trip." },
  { name: "Rafiq Ahmed", rating: 5, comment: "I list my power tillers here and bookings come in regularly. The dashboard makes tracking earnings easy." },
];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(fallback);

  useEffect(() => {
    api<Review[]>("/reviews", { auth: false })
      .then((rows) => {
        if (rows.length >= 4) setReviews(rows.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading eyebrow="Customer reviews" title="Loved by renters and owners" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={`${r.name}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              className="flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-6"
            >
              <FaQuoteLeft className="mb-3 h-6 w-6 text-primary/30" />
              <blockquote className="flex-1 leading-relaxed opacity-85">{r.comment}</blockquote>
              <figcaption className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-primary-content">
                    {r.name.charAt(0)}
                  </span>
                  <span className="font-semibold">{r.name}</span>
                </span>
                <Stars value={r.rating} />
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
