import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-gold font-medium tracking-widest text-sm uppercase mb-4">
          Student Tech Circle
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground tracking-tight leading-tight mb-6">
          CITechBloom
        </h1>

        <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed mb-10 max-w-xl mx-auto">
          テクノロジーと創造性が交差する場所。
          <br />
          プログラミング・AI・デザインを共に学び、
          <br />
          ともに咲き誇ろう。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/join"
            className="inline-flex items-center justify-center rounded-full bg-gold text-white px-8 py-3 text-base font-medium hover:bg-[#b8943e] transition-colors duration-200 shadow-sm"
          >
            入会する
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full border border-gold text-gold px-8 py-3 text-base font-medium hover:bg-gold hover:text-white transition-colors duration-200"
          >
            詳しく見る
          </Link>
        </div>
      </div>
    </section>
  );
}
