
/**
 * Get the appropriate badge variant based on the relationship type
 */
export function getBadgeVariantByRelationship(
  relationship: "Anak" | "Suami" | "Istri" | "Orang Tua" | "Saudara Kandung" | "Kerabat"
): "default" | "secondary" | "destructive" | "outline" | "success" | "info" | "warning" {
  switch (relationship) {
    case "Anak":
      return "info";
    case "Suami":
      return "success";
    case "Istri":
      return "success";
    case "Orang Tua":
      return "warning";
    case "Saudara Kandung":
      return "secondary";
    case "Kerabat":
      return "outline";
    default:
      return "default";
  }
}
