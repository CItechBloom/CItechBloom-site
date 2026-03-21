import Link from "next/link";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-black/10">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-foreground tracking-tight hover:text-gold transition-colors duration-200"
        >
          CITechBloom
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
