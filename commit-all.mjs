// Creates one meaningful git commit per feature. Run: node commit-all.mjs
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const run = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8", shell: false });

run("git", ["init"]);
run("git", ["branch", "-M", "main"]);

const steps = [
  [["package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs", ".gitignore"], "chore: setup Next.js project with TypeScript and Tailwind"],
  [["app/globals.css", "app/icon.svg"], "style: add DaisyUI light and dark themes and global styles"],
  [["lib/types.ts", "lib/utils.ts"], "feat: add shared types and utility helpers"],
  [["lib/api.ts"], "feat: add API client with token handling"],
  [["lib/auth.ts", "lib/auth-client.ts", "app/api/auth/[...all]/route.ts"], "feat: configure BetterAuth with email and Google login"],
  [["app/api/token/route.ts"], "feat: add JWT token route for server API access"],
  [["components/AuthProvider.tsx", "components/RequireAuth.tsx"], "feat: add auth provider and protected route guard"],
  [["components/Logo.tsx", "components/ThemeToggle.tsx", "components/Navbar.tsx"], "feat: add responsive navbar with theme toggle"],
  [["components/Footer.tsx"], "feat: add footer"],
  [["components/ui.tsx", "components/EquipmentCard.tsx"], "feat: add shared UI pieces and equipment card"],
  [["components/home/Banner.tsx"], "feat: add animated home banner"],
  [["components/home/Featured.tsx", "components/home/Categories.tsx"], "feat: add featured equipment and categories sections"],
  [["components/home/WhyChooseUs.tsx", "components/home/HowItWorks.tsx"], "feat: add why choose us and how it works sections"],
  [["components/home/Reviews.tsx", "components/home/OwnerCta.tsx", "app/page.tsx"], "feat: add reviews, owner call to action and compose home page"],
  [["app/layout.tsx", "app/loading.tsx", "app/error.tsx", "app/not-found.tsx"], "feat: add root layout, loading, error and not found pages"],
  [["components/AuthShell.tsx", "components/GoogleButton.tsx", "app/login/page.tsx"], "feat: add login page"],
  [["app/register/page.tsx"], "feat: add register page with password validation and role choice"],
  [["app/equipment/page.tsx"], "feat: add all equipment page with search, filters, sort and pagination"],
  [["components/BookingModal.tsx", "app/equipment/[id]/page.tsx"], "feat: add private equipment details page with booking modal"],
  [["app/payment/success/page.tsx", "app/payment/cancel/page.tsx"], "feat: add Stripe payment success and cancel pages"],
  [["components/DashHeader.tsx", "components/DashboardShell.tsx", "app/dashboard/layout.tsx", "app/dashboard/page.tsx"], "feat: add dashboard layout with sidebar"],
  [["app/dashboard/my-rentals/page.tsx"], "feat: add customer my rentals page"],
  [["app/dashboard/favorites/page.tsx"], "feat: add customer favorites page"],
  [["app/dashboard/profile/page.tsx"], "feat: add profile page with update form"],
  [["app/about/page.tsx", "app/contact/page.tsx"], "feat: add about and contact pages"],
  [[".env.example", "README.md"], "docs: add README and environment variable example"],
];

let made = 0;
for (const [files, message] of steps) {
  const present = files.filter((f) => existsSync(f));
  if (!present.length) continue;
  const status = run("git", ["status", "--porcelain", "--", ...present]).stdout.trim();
  if (!status) continue;
  run("git", ["add", "--", ...present]);
  const res = run("git", ["commit", "-m", message]);
  if (res.status === 0) { made++; console.log("committed:", message); }
  else console.log("FAILED:", message, "\n", res.stderr || res.stdout);
}
// anything left over
run("git", ["add", "-A"]);
if (run("git", ["status", "--porcelain"]).stdout.trim()) {
  run("git", ["commit", "-m", "chore: add remaining project files"]);
  made++;
}
console.log(`\nDone. ${made} commit(s) created.`);
console.log(run("git", ["rev-list", "--count", "HEAD"]).stdout.trim() + " commits in total.");
