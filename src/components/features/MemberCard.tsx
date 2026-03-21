import { Card } from "@/components/ui/Card";
import type { Member } from "@/types";
import { cn } from "@/lib/utils";

type MemberCardProps = {
  member: Member;
};

const roleColors: Record<string, string> = {
  代表: "bg-gold/10 text-gold",
  副代表: "bg-green/10 text-green",
  技術責任者: "bg-blue-50 text-blue-700",
  イベント担当: "bg-purple-50 text-purple-700",
  会計: "bg-orange-50 text-orange-700",
  広報: "bg-pink-50 text-pink-700",
};

function MemberAvatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className="w-20 h-20 rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/30 to-green/30 flex items-center justify-center">
      <span className="text-xl font-bold text-foreground/70">{initials}</span>
    </div>
  );
}

export function MemberCard({ member }: MemberCardProps) {
  const roleColorClass =
    roleColors[member.role] ?? "bg-gray-100 text-gray-600";

  return (
    <Card className="flex flex-col items-center text-center gap-4">
      <MemberAvatar name={member.name} imageUrl={member.imageUrl} />

      <div>
        <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
        <span
          className={cn(
            "inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium",
            roleColorClass
          )}
        >
          {member.role}
        </span>
      </div>

      <div className="text-sm text-foreground/60 space-y-1">
        <p>{member.year}{member.department && ` ・ ${member.department}`}</p>
      </div>

      <p className="text-sm text-foreground/70 leading-relaxed">{member.bio}</p>
    </Card>
  );
}
