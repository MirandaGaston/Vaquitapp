import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProfile, formatAddress } from "../lib/storage";

export default function Layout({ children, title }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const navLinks = [
    { href: "/mis-vaquitas", label: "Mis Vaquitas", emoji: "🐄" },
    { href: "/crear", label: "Nueva Vaquita", emoji: "✨" },
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/mis-vaquitas" className="flex items-center gap-2 font-extrabold text-xl text-orange-500 hover:text-orange-600 transition-colors">
            🐄 <span>Vaquitapp</span>
          </Link>

          <div className="flex items-center gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${router.pathname === l.href
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
              >
                <span>{l.emoji}</span>
                {l.label}
              </Link>
            ))}

            {profile && (
              <Link
                href="/perfil"
                className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-all"
              >
                <span className="text-lg">{profile.photo || "🐄"}</span>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-gray-800 leading-tight">{profile.nickname}</p>
                  <p className="text-xs text-gray-400 leading-tight">{formatAddress(profile.address)}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-4 py-6 animate-fade-in">
        {title && (
          <h1 className="text-2xl font-extrabold text-gray-800 mb-6">{title}</h1>
        )}
        {children}
      </main>

      {/* Footer minimalista */}
      <footer className="text-center py-8 text-xs text-gray-400">
        🐄 Vaquitapp · Powered by Hardhat + Ethereum · Demo Universitario
      </footer>
    </div>
  );
}
