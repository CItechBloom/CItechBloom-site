"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { MemberFormSchema, type MemberFormData } from "@/lib/validations";
import { createMember, updateMember } from "@/app/admin/_actions/members";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const yearOptions = ["1年", "2年", "3年", "4年", "院1年", "院2年"] as const;

type Props = {
  memberId?: string;
  initialData?: MemberFormData & { image_url?: string };
};

export function MemberForm({ memberId, initialData }: Props) {
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialData?.image_url
  );
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(MemberFormSchema),
    defaultValues: initialData ?? {
      display_order: 0,
      is_visible: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("画像は2MB以下にしてください");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("JPEG、PNG、WebP形式の画像を選択してください");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const onSubmit = async (data: MemberFormData) => {
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("role", data.role);
    formData.set("bio", data.bio);
    formData.set("year", data.year);
    formData.set("department", data.department ?? "");
    formData.set("display_order", String(data.display_order));
    formData.set("is_visible", String(data.is_visible));

    if (imageFile) {
      formData.set("image", imageFile);
    }

    const result = memberId
      ? await updateMember(memberId, formData)
      : await createMember(formData);

    if (!result.success) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/admin/members");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors duration-200";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 space-y-5 max-w-2xl"
    >
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name")}
          className={cn(inputClass, errors.name && "border-red-400")}
          placeholder="山田 太郎"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            役割 <span className="text-red-500">*</span>
          </label>
          <input
            {...register("role")}
            className={cn(inputClass, errors.role && "border-red-400")}
            placeholder="代表"
          />
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            学年 <span className="text-red-500">*</span>
          </label>
          <select
            {...register("year")}
            className={cn(inputClass, errors.year && "border-red-400")}
          >
            <option value="">選択してください</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          学科・専攻
        </label>
        <input
          {...register("department")}
          className={inputClass}
          placeholder="情報工学科"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          自己紹介 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("bio")}
          rows={4}
          className={cn(inputClass, "resize-none", errors.bio && "border-red-400")}
          placeholder="自己紹介を入力してください（300文字以内）"
        />
        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          プロフィール写真
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="text-sm text-foreground/60"
        />
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="プレビュー"
            className="mt-2 w-20 h-20 rounded-full object-cover"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            表示順序
          </label>
          <input
            {...register("display_order", { valueAsNumber: true })}
            type="number"
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <input
            {...register("is_visible")}
            type="checkbox"
            id="is_visible"
            className="w-4 h-4 rounded border-black/15 text-gold focus:ring-gold/50"
          />
          <label htmlFor="is_visible" className="text-sm font-medium text-foreground">
            公開する
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "保存中..." : memberId ? "更新する" : "追加する"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/admin/members")}
          className="px-4 py-2 text-sm text-foreground/60 hover:text-foreground"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
