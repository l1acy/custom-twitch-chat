export function splitText(text: string, separator: string, limit: number): string[] {
  const splitted = text.split(separator, limit);
  let lengthSoFar = splitted.reduce((sum, part) => sum + part.length, 0);
  const otherText = text.slice(lengthSoFar + limit);
  splitted.push(otherText);
  return splitted;
}