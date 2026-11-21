"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiLogOut, FiMenu } from "react-icons/fi";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { status, me, logout } = useAuth();
  const loggedIn = status === "authenticated" || status === "error";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  const closeMenu = () => {
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Open menu">
              <FiMenu className="h-5 w-5" />
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
            >
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={closeMenu} className={isActive(l.href) ? "menu-active" : ""}>
                    {l.label}
                  </Link>
                </li>
              ))}
              {!loggedIn && status !== "loading" && (
                <>
                  <li>
                    <Link href="/login" onClick={closeMenu}>Login</Link>
                  </li>
                  <li>
                    <Link href="/register" onClick={closeMenu}>Register</Link>
                  </li>
                </>
              )}
              {loggedIn && (
                <>
                  <li>
                    <Link href="/dashboard" onClick={closeMenu}>Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={() => { closeMenu(); logout(); }}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-base-200 ${
                isActive(l.href) ? "bg-base-200 text-primary" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          {status === "loading" && <div className="skeleton h-10 w-24 rounded-lg" />}

          {status === "unauthenticated" && (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}

          {loggedIn && (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm hidden lg:inline-flex">
                <FiGrid /> Dashboard
              </Link>
              <button onClick={logout} className="btn btn-outline btn-sm hidden lg:inline-flex">
                <FiLogOut /> Logout
              </button>
              <Link
                href="/dashboard/profile"
                className="avatar"
                title={me?.name || "My profile"}
                aria-label="My profile"
              >
                <div className="w-9 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  {me?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={me.image} alt={me.name} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-primary text-sm font-bold text-primary-content">
                      {(me?.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
