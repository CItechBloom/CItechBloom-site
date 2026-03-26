import { z } from "zod";

export const JoinFormSchema = z.object({
  name: z.string().trim().min(1, { message: "名前を入力してください" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  year: z.enum(["1年", "2年", "3年", "4年", "院1年", "院2年"], {
    error: "学年を選択してください",
  }),
  department: z.string().trim().min(1, { message: "学科・専攻を入力してください" }),
  message: z
    .string()
    .trim()
    .max(500, { message: "500文字以内で入力してください" })
    .optional(),
});

export type JoinFormData = z.infer<typeof JoinFormSchema>;

export const MemberFormSchema = z.object({
  name: z.string().trim().min(1, { message: "名前を入力してください" }),
  role: z.string().trim().min(1, { message: "役割を入力してください" }),
  bio: z
    .string()
    .trim()
    .min(1, { message: "自己紹介を入力してください" })
    .max(300, { message: "300文字以内で入力してください" }),
  year: z.string().min(1, { message: "学年を選択してください" }),
  department: z.string().trim().optional(),
  display_order: z.number().int().min(0),
  is_visible: z.boolean(),
});

export type MemberFormData = z.infer<typeof MemberFormSchema>;

export const SafeUrlSchema = z
  .string()
  .trim()
  .url({ message: "有効なURLを入力してください" })
  .refine((url) => url.startsWith("https://"), {
    message: "URLはhttps://で始まる必要があります",
  });

export const AboutContentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "タイトルを入力してください" })
    .max(200, { message: "200文字以内で入力してください" }),
  body: z
    .string()
    .trim()
    .max(5000, { message: "5000文字以内で入力してください" }),
});
