import { useMemberLookup } from "@/hooks/useMemberLookup";
import * as Text from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberNameProps {
  memberId: string;
  className?: string;
}

export function MemberName({ memberId, className }: MemberNameProps) {
  const { memberName, loading } = useMemberLookup(memberId);

  if (loading) {
    return <Skeleton className="h-4 w-24 bg-slate-100" />;
  }

  return (
    <Text.Body className={className}>
      {memberName}
    </Text.Body>
  );
}
