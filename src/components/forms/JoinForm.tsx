"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { JoinFormSchema, type JoinFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const yearOptions = ["1年", "2年", "3年", "4年", "院1年", "院2年"] as const;

type FieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors duration-200";

export function JoinForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12 px-6 bg-green/5 rounded-2xl border border-green/20">
        <p className="text-2xl font-bold text-green mb-2">申請を受け付けました！</p>
        <p className="text-foreground/70 text-sm">
          確認メールをお送りしました。しばらくお待ちください。
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-gold hover:underline"
        >
          もう一度送信する
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="お名前" error={errors.name?.message} required>
        <input
          {...register("name")}
          type="text"
          placeholder="山田 太郎"
          className={cn(inputClass, errors.name && "border-red-400 focus:ring-red-300 focus:border-red-400")}
        />
      </Field>

      <Field label="メールアドレス" error={errors.email?.message} required>
        <input
          {...register("email")}
          type="email"
          placeholder="your@email.example"
          className={cn(inputClass, errors.email && "border-red-400 focus:ring-red-300 focus:border-red-400")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="学年" error={errors.year?.message} required>
          <select
            {...register("year")}
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

        <Field label="学科・専攻" error={errors.department?.message} required>
          <input
            {...register("department")}
            type="text"
            placeholder="情報工学科"
            className={cn(inputClass, errors.department && "border-red-400 focus:ring-red-300 focus:border-red-400")}
          />
        </Field>
      </div>

      <Field label="メッセージ（任意）" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="興味のある技術や、サークルでやってみたいことなどを教えてください。"
          className={cn(inputClass, "resize-none", errors.message && "border-red-400 focus:ring-red-300 focus:border-red-400")}
        />
      </Field>

      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          送信に失敗しました。しばらくしてから再度お試しください。
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        size="lg"
        className="w-full"
      >
        {status === "submitting" ? "送信中..." : "入会を申請する"}
      </Button>
    </form>
  );
}
