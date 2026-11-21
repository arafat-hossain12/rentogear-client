"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHeart, FiList, FiMenu, FiUser } from "react-icons/fi";
import type { IconType } from "react-icons";
import { useAuth } from "./AuthProvider";
import type { Role } from "@/lib/types";

interface MenuItem {
  href: string;
  label: string;
  icon: IconType;
}

const menus: Record<Role, MenuItem[]> = {
  customer: [
    { href: "/dashboard/my-rentals", label: "My Rentals", icon: FiList },
    { href: "/dashboard/favorites", label: "Favorites", icon: FiHeart },
    { href: "/dashboard/profile", label: "Profile", icon: FiUser },
  ],
  owner: [{ href: "/dashboard/profile", label: "My Profile", icon: FiUser }],
  admin: [{ href: "/dashboard/profile", label: "My Profile", icon: FiUser }],
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { me } = useAuth();
  const items = me ? menus[me.role] : [];

  const nav = (
    <ul className="menu w-full gap-1 p-3">
      {items.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            className={`font-semibold ${pathname === href ? "menu-active" : ""}`}
            onClick={() => {
              const toggle = document.getElementById("dash-drawer") as HTMLInputElement | null;
              if (toggle) toggle.checked = false;
            }}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="drawer lg:drawer-open">
      <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content min-w-0 bg-base-200">
        <div className="flex items-center gap-2 border-b border-base-300 bg-base-100 px-4 py-2 lg:hidden">
          <label htmlFor="dash-drawer" className="btn btn-ghost btn-sm" aria-label="Open dashboard menu">
            <FiMenu className="h-5 w-5" /> Menu
          </label>
          <span className="text-sm font-semibold capitalize opacity-70">{me?.role} dashboard</span>
        </div>
        <div className="w-full p-4 sm:p-6 lg:p-8">{children}</div>
      </div>

      <div className="drawer-side z-30 lg:z-auto">
        <label htmlFor="dash-drawer" aria-label="Close menu" className="drawer-overlay" />
        <aside className="flex min-h-full w-64 flex-col border-r border-base-300 bg-base-100 lg:min-h-[calc(100vh-4rem)]">
          <div className="border-b border-base-300 p-5">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-11 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  {me?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={me.image} alt={me.name} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-primary font-bold text-primary-content">
                      {(me?.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold">{me?.name}</p>
                <span className="badge badge-primary badge-soft badge-sm capitalize">{me?.role}</span>
              </div>
            </div>
          </div>
          {nav}
        </aside>
      </div>
    </div>
  );
}
