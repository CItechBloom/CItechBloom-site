"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useId, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { JoinFormSchema, type JoinFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const yearOptions = ["1年", "2年", "3年", "4年", "院1年", "院2年"] as const;

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  errorId?: string;
  required?: boolean;
  children: ReactNode;
};

function Field({ label, htmlFor, error, errorId, required, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors duration-200";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function JoinForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const router = useRouter();
  const id = useId();

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const fieldId = (name: string) => `${id}-${name}`;
  const errorId = (name: string) => `${id}-${name}-error`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinFormData>({
    resolver: zodResolver(JoinFormSchema),
  });

  const onSubmit = async (data: JoinFormData) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          ...(turnstileSiteKey && { turnstileToken }),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      reset();
      router.push(`/join/welcome?name=${encodeURIComponent(data.name)}`);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="お名前" htmlFor={fieldId("name")} error={errors.name?.message} errorId={errorId("name")} required>
        <input
          {...register("name")}
          id={fieldId("name")}
          type="text"
          placeholder="山田 太郎"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? errorId("name") : undefined}
          className={cn(inputClass, errors.name && "border-red-400 focus:ring-red-300 focus:border-red-400")}
        />
      </Field>

      <Field label="メールアドレス" htmlFor={fieldId("email")} error={errors.email?.message} errorId={errorId("email")} required>
        <input
          {...register("email")}
          id={fieldId("email")}
          type="email"
          placeholder="your@email.example"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? errorId("email") : undefined}
          className={cn(inputClass, errors.email && "border-red-400 focus:ring-red-300 focus:border-red-400")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="学年" htmlFor={fieldId("year")} error={errors.year?.message} errorId={errorId("year")} required>
          <select
            {...register("year")}
            id={fieldId("year")}
            aria-invalid={!!errors.year}
            aria-describedby={errors.year ? errorId("year") : undefined}
            className={cn(inputClass, errors.year && "border-red-400 focus:ring-red-300 focus:border-red-400")}
          >
            <option value="">選択してください</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Field>

        <Field label="学科・専攻" htmlFor={fieldId("department")} error={errors.department?.message} errorId={errorId("department")} required>
          <input
            {...register("department")}
            id={fieldId("department")}
            type="text"
            placeholder="情報工学科"
            aria-invalid={!!errors.department}
            aria-describedby={errors.department ? errorId("department") : undefined}
            className={cn(inputClass, errors.department && "border-red-400 focus:ring-red-300 focus:border-red-400")}
          />
        </Field>
      </div>

      <Field label="メッセージ（任意）" htmlFor={fieldId("message")} error={errors.message?.message} errorId={errorId("message")}>
        <textarea
          {...register("message")}
          id={fieldId("message")}
          rows={4}
          placeholder="興味のある技術や、サークルでやってみたいことなどを教えてください。"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className={cn(inputClass, "resize-none", errors.message && "border-red-400 focus:ring-red-300 focus:border-red-400")}
        />
      </Field>

      {turnstileSiteKey && (
        <div className="flex justify-center">
          <Turnstile
            siteKey={turnstileSiteKey}
            onSuccess={handleTurnstileSuccess}
            onExpire={() => setTurnstileToken("")}
          />
        </div>
      )}

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          送信に失敗しました。しばらくしてから再度お試しください。
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "submitting" || (!!turnstileSiteKey && !turnstileToken)}
        size="lg"
        className="w-full"
      >
        {status === "submitting" ? "送信中..." : "入会を申請する"}
      </Button>
    </form>
  );
}
