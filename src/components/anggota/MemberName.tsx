import { useMemberLookup } from "@/hooks/useMemberLookup";
import * as Text from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MemberNameProps {
  memberId: string;
  className?: string;
  showId?: boolean;
}

export function MemberName({ memberId, className, showId = false }: MemberNameProps) {
  const { memberName, memberNo, loading } = useMemberLookup(memberId);

  if (loading) {
    return <Skeleton className="h-4 w-24 bg-slate-100" />;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <Text.Body className="font-bold text-slate-800">
        {memberName}
      </Text.Body>
      {showId && (
        <Text.Caption className="not-italic text-[10px] text-slate-400">
          {memberNo}
        </Text.Caption>
      )}
    </div>
  );
}
