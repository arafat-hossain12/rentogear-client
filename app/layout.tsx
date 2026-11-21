import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "RentoGear | Equipment Rental Marketplace",
    template: "%s | RentoGear",
  },
  description:
    "RentoGear connects equipment owners with customers. Browse, book and pay for construction, photography, farming, electronics and event equipment.",
};

// Sets the saved (or system) theme before the page paints to avoid a flash
const themeScript = `
try {
  var t = localStorage.getItem("rg-theme");
  if (t !== "rentogear" && t !== "rentogear-dark") {
    t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "rentogear-dark" : "rentogear";
  }
  document.documentElement.setAttribute("data-theme", t);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
        </AuthProvider>
      </body>
    </html>
  );
}
