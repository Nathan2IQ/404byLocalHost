import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat-source",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Easter Egg by Localhost",
  description: "A fun Easter Egg project by Localhost",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone">
        <header className="bg-neutral-dark">
          <div className="flex items-center justify-between px-2">
            <Image
              src="/logo_localhost_blanc.png"
              alt="Localhost Logo"
              width={200}
              height={200}
            />
            <Link
              href="/"
              className="rounded-lg border border-white/30 px-4 py-2 mr-8 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Accueil
            </Link>
          </div>
          <div className="bg-neutral-light h-0.5 min-w-40 mt-2"></div>
        </header>
        {children}
        <footer className="text-center bg-neutral-dark text-white pb-4 pt-2 px-4">
          <div className="flex flex-col justify-center items-center">
            <Image
              src="/logo_localhost_blanc.png"
              alt="Localhost Logo"
              width={150}
              height={150}
            />
            <p className="text-white mt-2">Coworking tech ~ Cesson-Sévigné</p>
            <p className="text-white my-2">
              &copy; 2026 Localhost. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
