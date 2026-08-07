import fs from 'fs';
import path from 'path';

function generate() {
  const g2024Dir = path.join(process.cwd(), 'grants2024', 'data', 'g');
  const g2026Dir = path.join(process.cwd(), 'grants2026', 'data', 'g');

  const files2024 = fs.existsSync(g2024Dir) ? fs.readdirSync(g2024Dir).filter(f => f.endsWith('.json')) : [];
  const files2026 = fs.existsSync(g2026Dir) ? fs.readdirSync(g2026Dir).filter(f => f.endsWith('.json')) : [];

  const map2024 = {};
  files2024.forEach(f => {
    const keyName = f.replace('.json', '');
    try {
      const content = JSON.parse(fs.readFileSync(path.join(g2024Dir, f), 'utf-8'));
      map2024[keyName] = content;
    } catch (e) {
      console.error(`Error reading ${f}:`, e);
    }
  });

  const map2026 = {};
  files2026.forEach(f => {
    const keyName = f.replace('.json', '');
    try {
      const content = JSON.parse(fs.readFileSync(path.join(g2026Dir, f), 'utf-8'));
      map2026[keyName] = content;
    } catch (e) {
      console.error(`Error reading ${f}:`, e);
    }
  });

  const outDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'gops2024.json'), JSON.stringify(map2024), 'utf-8');
  fs.writeFileSync(path.join(outDir, 'gops2026.json'), JSON.stringify(map2026), 'utf-8');

  // Also create helper TS file
  const helperContent = `import gops2024 from './gops2024.json';
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
`;

  fs.writeFileSync(path.join(outDir, 'gopData.ts'), helperContent, 'utf-8');
  console.log(`Successfully generated JSON bundles: 2024 (${Object.keys(map2024).length} GOPs), 2026 (${Object.keys(map2026).length} GOPs)`);
}

generate();
