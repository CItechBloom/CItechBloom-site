import { getMembers } from "@/app/admin/_actions/members";
import { MemberList } from "./_components/MemberList";

export default async function AdminMembersPage() {
  const result = await getMembers();

  if (!result.success) {
    return (
      <p className="text-red-600 text-sm">
        メンバーの取得に失敗しました: {result.error}
      </p>
    );
  }

  return <MemberList initialMembers={result.data} />;
}
