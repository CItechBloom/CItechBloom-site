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
