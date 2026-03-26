import { getMember } from "@/app/admin/_actions/members";
import { MemberForm } from "@/app/admin/members/_components/MemberForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params;
  const result = await getMember(id);

  if (!result.success) {
    return <p className="text-red-600 text-sm">{result.error}</p>;
  }

  const data = result.data;
  const initialData = {
    name: data.name,
    role: data.role,
    bio: data.bio,
    year: data.year,
    department: data.department ?? "",
    display_order: data.display_order,
    is_visible: data.is_visible,
    image_url: data.image_url ?? undefined,
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">メンバー編集</h2>
      <MemberForm memberId={id} initialData={initialData} />
    </div>
  );
}
