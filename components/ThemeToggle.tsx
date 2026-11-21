"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const LIGHT = "rentogear";
const DARK = "rentogear-dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(LIGHT);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || LIGHT);
  }, []);

  const toggle = () => {
    const next = theme === DARK ? LIGHT : DARK;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("rg-theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost btn-circle"
      aria-label={theme === DARK ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === DARK ? "Light mode" : "Dark mode"}
    >
      {theme === DARK ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  );
}
