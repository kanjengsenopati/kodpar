import { useState, useEffect } from "react";
import { getAnggotaById } from "@/services/anggotaService";
import { Anggota } from "@/types/anggota";

// Simple in-memory cache to prevent multiple DB queries for the same member
const memberCache: Record<string, Anggota> = {};

export function useMemberLookup(memberId?: string) {
  const [member, setMember] = useState<Anggota | null>(
    memberId && memberCache[memberId] ? memberCache[memberId] : null
  );
  const [loading, setLoading] = useState(!!memberId && !memberCache[memberId]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) {
      setMember(null);
      setLoading(false);
      return;
    }

    if (memberCache[memberId]) {
      setMember(memberCache[memberId]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchMember = async () => {
      try {
        const data = await getAnggotaById(memberId);
        if (isMounted) {
          if (data) {
            memberCache[memberId] = data;
            setMember(data);
          } else {
            setError("Member not found");
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch member");
          setLoading(false);
        }
      }
    };

    fetchMember();

    return () => {
      isMounted = false;
    };
  }, [memberId]);

  return { 
    member, 
    memberName: member?.nama || "Unknown", 
    memberNo: member?.noAnggota || "-",
    loading, 
    error 
  };
}

/**
 * Bulk lookup helper (non-hook version for use in mappings)
 */
export async function getMemberNames(memberIds: string[]): Promise<Record<string, string>> {
  const uniqueIds = Array.from(new Set(memberIds));
  const results: Record<string, string> = {};
  
  await Promise.all(uniqueIds.map(async (id) => {
    if (memberCache[id]) {
      results[id] = memberCache[id].nama;
    } else {
      const member = await getAnggotaById(id);
      if (member) {
        memberCache[id] = member;
        results[id] = member.nama;
      } else {
        results[id] = "Unknown Member";
      }
    }
  }));
  
  return results;
}
