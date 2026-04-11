import { useState, useEffect } from "react";
import { getJenisById } from "@/services/jenisService";
import { Jenis } from "@/types";

// Simple in-memory cache to prevent multiple queries
const categoryCache: Record<string, string> = {};

export function useCategoryLookup(categoryId?: string) {
  const [categoryName, setCategoryName] = useState<string>(
    categoryId && categoryCache[categoryId] ? categoryCache[categoryId] : "Loading..."
  );
  const [loading, setLoading] = useState(!!categoryId && !categoryCache[categoryId]);

  useEffect(() => {
    if (!categoryId) {
      setCategoryName("-");
      setLoading(false);
      return;
    }

    if (categoryCache[categoryId]) {
      setCategoryName(categoryCache[categoryId]);
      setLoading(false);
      return;
    }

    const fetchName = async () => {
      try {
        // jenisService is currently synchronous (localStorage)
        const data = getJenisById(categoryId);
        const name = data?.nama || "Kategori Unknown";
        categoryCache[categoryId] = name;
        setCategoryName(name);
      } catch (err) {
        setCategoryName("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchName();
  }, [categoryId]);

  return { categoryName, loading };
}

/**
 * Non-hook version for use in sync mappings or table renders where hooks aren't usable
 */
export function getCategoryNameSync(categoryId?: string): string {
  if (!categoryId) return "-";
  if (categoryCache[categoryId]) return categoryCache[categoryId];
  
  const data = getJenisById(categoryId);
  if (data) {
    categoryCache[categoryId] = data.nama;
    return data.nama;
  }
  
  return "Kategori Unknown";
}
