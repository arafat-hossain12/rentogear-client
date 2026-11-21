import Logo from "./Logo";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hero-grid bg-base-200">
      <div className="container-page grid min-h-[calc(100vh-4rem)] items-center py-10">
        <div className="mx-auto w-full max-w-md rounded-box border border-base-300 bg-base-100 p-6 shadow-xl sm:p-8">
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>
            <h1 className="text-2xl font-extrabold">{title}</h1>
            <p className="mt-1 text-sm opacity-70">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
