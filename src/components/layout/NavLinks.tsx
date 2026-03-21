"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { href: "/", label: "ホーム" },
  { href: "/about", label: "について" },
  { href: "/members", label: "メンバー" },
  { href: "/events", label: "イベント" },
  { href: "/blog", label: "ブログ" },
  { href: "/join", label: "入会する" },
];

export function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              pathname === href
                ? "text-gold"
                : "text-foreground/70 hover:text-foreground hover:bg-black/5"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "block w-5 h-0.5 bg-foreground transition-all duration-300",
            isOpen && "rotate-45 translate-y-2"
          )}
        />
        <span
          className={cn(
            "block w-5 h-0.5 bg-foreground transition-all duration-300",
            isOpen && "opacity-0"
          )}
        />
        <span
          className={cn(
            "block w-5 h-0.5 bg-foreground transition-all duration-300",
            isOpen && "-rotate-45 -translate-y-2"
          )}
        />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-black/10 shadow-lg">
          <nav className="flex flex-col py-2">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-colors duration-200",
                  pathname === href
                    ? "text-gold"
                    : "text-foreground/70 hover:text-foreground hover:bg-black/5"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
