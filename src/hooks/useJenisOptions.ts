
import { useState, useEffect } from "react";
import { Jenis } from "@/types/jenis";
import { getJenisOptions } from "@/services/jenisService";

/**
 * Custom hook to fetch and provide transaction categories (Jenis)
 * Automatically handles the async nature of IndexedDB lookups.
 */
export function useJenisOptions(jenisTransaksi: string) {
  const [options, setOptions] = useState<Jenis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const data = await getJenisOptions(jenisTransaksi);
        if (isMounted) {
          setOptions(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load options");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOptions();

    // Listen for global updates to jenis data
    const handleUpdate = () => {
      fetchOptions();
    };

    window.addEventListener('jenisUpdated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('jenisUpdated', handleUpdate);
    };
  }, [jenisTransaksi]);

  return { options, isLoading, error };
}
