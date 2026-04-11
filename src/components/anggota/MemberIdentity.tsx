import { useMemberLookup } from "@/hooks/useMemberLookup";
import * as Text from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MemberIdentityProps {
  memberId: string;
  className?: string;
  layout?: "vertical" | "horizontal";
  priority?: "name" | "id";
}

/**
 * Standardized PakRT component for displaying member identity 
 * showing both Human-Readable Name and Clean ID.
 */
export function MemberIdentity({ 
  memberId, 
  className, 
  layout = "vertical",
  priority = "name"
}: MemberIdentityProps) {
  const { memberName, memberNo, loading } = useMemberLookup(memberId);

  if (loading) {
    return <Skeleton className="h-10 w-32 bg-slate-100 rounded-xl" />;
  }

  if (layout === "horizontal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Text.Body className="font-bold text-slate-800">
          {memberName}
        </Text.Body>
        <span className="text-slate-300">|</span>
        <Text.Caption className="not-italic font-mono text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
          {memberNo}
        </Text.Caption>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {priority === "name" ? (
        <>
          <Text.H2 className="text-sm font-bold text-slate-800 leading-tight">
            {memberName}
          </Text.H2>
          <Text.Caption className="not-italic text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {memberNo}
          </Text.Caption>
        </>
      ) : (
        <>
          <Text.Label className="text-slate-400 mb-0.5">
            Anggota
          </Text.Label>
          <div className="flex flex-col">
             <Text.Amount className="text-sm text-slate-600 font-bold">
               {memberNo}
             </Text.Amount>
             <Text.Body className="text-xs text-slate-500">
               {memberName}
             </Text.Body>
          </div>
        </>
      )}
    </div>
  );
}
