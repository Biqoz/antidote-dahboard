export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "Non spécifié";
  
  if (min && max) {
    return `${min}k - ${max}k €`;
  }
  
  if (min) {
    return `À partir de ${min}k €`;
  }
  
  return `Jusqu'à ${max}k €`;
}

export function formatDate(dateString: string, locale = "fr-FR"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCompanySize(size?: string): string {
  const sizes: Record<string, string> = {
    startup: "Startup (1-10)",
    pme: "PME (11-250)",
    eti: "ETI (251-5000)",
    grand_groupe: "Grand groupe (5000+)",
  };
  
  return sizes[size || ""] || size || "Non spécifié";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}