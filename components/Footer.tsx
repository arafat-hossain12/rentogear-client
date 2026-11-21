import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Logo from "./Logo";

const socials = [
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-70">
            A transparent rental marketplace connecting equipment owners with customers who need the right gear for a
            day, a week or a month.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Explore</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link className="hover:text-primary" href="/equipment">All Equipment</Link></li>
            <li><Link className="hover:text-primary" href="/#how-it-works">How it works</Link></li>
            <li><Link className="hover:text-primary" href="/about">About us</Link></li>
            <li><Link className="hover:text-primary" href="/contact">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Account</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link className="hover:text-primary" href="/login">Login</Link></li>
            <li><Link className="hover:text-primary" href="/register">Register</Link></li>
            <li><Link className="hover:text-primary" href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Contact</h3>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-center gap-2"><FiMapPin className="shrink-0" /> Dhaka, Bangladesh</li>
            <li className="flex items-center gap-2"><FiPhone className="shrink-0" /> +880 1700 000000</li>
            <li className="flex items-center gap-2"><FiMail className="shrink-0" /> support@rentogear.com</li>
          </ul>
          <div className="mt-5 flex gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="btn btn-circle btn-sm btn-outline"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-base-300 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} RentoGear. All rights reserved.
      </div>
    </footer>
  );
}
