import { splitText } from "../split";
import { toCamelCase } from "../toCamelCase";
import type { ParsedSystemMessage } from "./types";

export function parseSystemMessage(msg: string): ParsedSystemMessage {
  const parts = splitText(msg, ' ', 3);

  const action = parts.length === 3 ? parts[0] : parts[2];
  const data: Record<string, string> = {};

  parts[0].split(';').forEach((tag) => {
    const [key, value] = tag.split('=');
    if (!key || value === undefined) return;
    data[toCamelCase(key)] = value;
  });

  return { action, data };
}