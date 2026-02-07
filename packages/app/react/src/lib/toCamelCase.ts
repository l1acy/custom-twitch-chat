export function toCamelCase(text: string): string {
  const parts = text.split('-');
  if (parts.length === 1) return text;
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}