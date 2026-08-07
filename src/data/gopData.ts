import gops2024 from './gops2024.json';
import gops2026 from './gops2026.json';

export const gops2024Data: Record<string, any[]> = gops2024 as Record<string, any[]>;
export const gops2026Data: Record<string, any[]> = gops2026 as Record<string, any[]>;

export function getGopData(year: string, code: string): any[] | null {
  const map = year === '2026' ? gops2026Data : gops2024Data;
  if (map[code]) return map[code];

  const lowerCode = code.toLowerCase().trim();
  for (const k of Object.keys(map)) {
    if (k.toLowerCase().trim() === lowerCode) {
      return map[k];
    }
  }

  for (const k of Object.keys(map)) {
    if (k.startsWith(code)) {
      return map[k];
    }
  }

  return null;
}
