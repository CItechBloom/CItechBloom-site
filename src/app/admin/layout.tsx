"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/stats", label: "統計値" },
  { href: "/admin/members", label: "メンバー" },
  { href: "/admin/about", label: "私たちについて" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // ログインページはレイアウトを適用しない
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold font-medium tracking-widest text-sm uppercase mb-1">
            Admin
          </p>
          <h1 className="text-2xl font-bold text-foreground">管理画面</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">
            サイトを見る
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-600 hover:text-red-700"
          >
            ログアウト
          </button>
        </div>
      </div>

      <nav className="flex gap-1 mb-8 overflow-x-auto">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              pathname === href
                ? "bg-gold/10 text-gold"
                : "text-foreground/60 hover:text-foreground hover:bg-white/50"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
