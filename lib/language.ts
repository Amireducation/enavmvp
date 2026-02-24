export type Language = "am" | "om" | "en"

export const LANGUAGES = {
  am: { name: "Amharic", flag: "🇪🇹" },
  om: { name: "Oromo", flag: "🇪🇹" },
  en: { name: "English", flag: "🇬🇧" },
}

export function detectLanguage(text: string): Language {
  // Simple heuristic-based language detection
  const amharicPattern = /[\u1200-\u137F]/g
  const oromoPattern = /[qQ][aA]/

  if (amharicPattern.test(text)) return "am"
  if (oromoPattern.test(text)) return "om"
  return "en"
}

export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  // Placeholder for translation service
  // In production, integrate with Azure Translator or similar
  return text
}
