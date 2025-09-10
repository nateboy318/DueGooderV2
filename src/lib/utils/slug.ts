/**
 * Generates a URL-safe slug from a given string
 * Replaces all non-alphanumeric characters with hyphens and handles edge cases
 */
export function generateSlug(text: string): string {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace any non-alphanumeric character with hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

/**
 * Generates a class ID from a class name using the same logic as generateSlug
 * This ensures consistency between class ID generation and URL slug matching
 */
export function generateClassId(className: string): string {
  return generateSlug(className);
}
