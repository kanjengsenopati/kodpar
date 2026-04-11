
import { useState, useEffect } from "react";
import { getJenisById } from "@/services/jenisService";

interface JenisNameProps {
  jenisId?: string;
  fallback?: string;
  showKode?: boolean;
}

/**
 * Component to resolve Jenis ID (UUID) to its display name or code
 * Ensures SSOT and traceability even after category names change.
 */
export function JenisName({ jenisId, fallback = "N/A", showKode = false }: JenisNameProps) {
  const [name, setName] = useState<string>(fallback);
  const [kode, setKode] = useState<string | undefined>();

  useEffect(() => {
    if (!jenisId) {
      setName(fallback);
      return;
    }

    const jenis = getJenisById(jenisId);
    if (jenis) {
      setName(jenis.nama);
      setKode(jenis.kode);
    } else {
      // If not found in modular table, it might be a legacy string name
      // Try to see if there's a record with this name
      setName(jenisId || fallback);
    }
  }, [jenisId, fallback]);

  if (showKode && kode) {
    return (
      <span className="flex items-center gap-1">
        <span className="font-medium">{name}</span>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded uppercase tracking-tighter">
          {kode}
        </span>
      </span>
    );
  }

  return <span>{name}</span>;
}
