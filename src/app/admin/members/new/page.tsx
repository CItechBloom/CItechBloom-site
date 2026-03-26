"use client";

import { MemberForm } from "@/app/admin/members/_components/MemberForm";

export default function NewMemberPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">メンバー新規追加</h2>
      <MemberForm />
    </div>
  );
}
