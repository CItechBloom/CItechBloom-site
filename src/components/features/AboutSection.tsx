import { cn } from "@/lib/utils";

type AboutSectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
};

export function AboutSection({
  title,
  subtitle,
  children,
  className,
  reverse = false,
}: AboutSectionProps) {
  return (
    <section className={cn("py-16 px-4 sm:px-6", className)}>
      <div
        className={cn(
          "max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center",
          reverse && "md:flex-row-reverse"
        )}
      >
        <div className="flex-1">
          {subtitle && (
            <p className="text-gold font-medium tracking-widest text-sm uppercase mb-3">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
            {title}
          </h2>
          <div className="text-foreground/70 leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
