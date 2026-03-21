import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-background">CITechBloom</p>
            <p className="text-sm mt-1 text-background/60">
              テクノロジーと創造性が交差する学生サークル
            </p>
          </div>

          <nav className="flex gap-6 text-sm">
            <Link href="/about" className="hover:text-background transition-colors duration-200">
              について
            </Link>
            <Link href="/members" className="hover:text-background transition-colors duration-200">
              メンバー
            </Link>
            <Link href="/events" className="hover:text-background transition-colors duration-200">
              イベント
            </Link>
            <Link href="/join" className="hover:text-background transition-colors duration-200">
              入会する
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-background/20 text-center text-xs text-background/40">
          © {currentYear} CITechBloom. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
