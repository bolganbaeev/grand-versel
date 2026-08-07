import fs from 'fs';
import path from 'path';

function generate() {
  const g2024Dir = path.join(process.cwd(), 'grants2024', 'data', 'g');
  const g2026Dir = path.join(process.cwd(), 'grants2026', 'data', 'g');

  const files2024 = fs.existsSync(g2024Dir) ? fs.readdirSync(g2024Dir).filter(f => f.endsWith('.json')) : [];
  const files2026 = fs.existsSync(g2026Dir) ? fs.readdirSync(g2026Dir).filter(f => f.endsWith('.json')) : [];

  let imports = [];
  let map2024 = [];
  let map2026 = [];

  let count = 0;

  files2024.forEach(f => {
    const varName = `g2024_${count++}`;
    const keyName = f.replace('.json', '');
    const relPath = `../../grants2024/data/g/${f}`;
    imports.push(`import ${varName} from '${relPath}';`);
    map2024.push(`  ${JSON.stringify(keyName)}: ${varName},`);
  });

  files2026.forEach(f => {
    const varName = `g2026_${count++}`;
    const keyName = f.replace('.json', '');
    const relPath = `../../grants2026/data/g/${f}`;
    imports.push(`import ${varName} from '${relPath}';`);
    map2026.push(`  ${JSON.stringify(keyName)}: ${varName},`);
  });

  const content = `// Auto-generated GOP Data Loader for Vercel / Cloud Run
${imports.join('\n')}

export const gops2024Data: Record<string, any[]> = {
${map2024.join('\n')}
};

export const gops2026Data: Record<string, any[]> = {
${map2026.join('\n')}
};

export function getGopData(year: string, code: string): any[] | null {
  const map = year === '2026' ? gops2026Data : gops2024Data;
  if (map[code]) return map[code];

  // Try case-insensitive or trimmed key match
  const lowerCode = code.toLowerCase().trim();
  for (const k of Object.keys(map)) {
    if (k.toLowerCase().trim() === lowerCode) {
      return map[k];
    }
  }

  // Try prefix match (e.g., "B001" matching "B001 (KZ-040)")
  for (const k of Object.keys(map)) {
    if (k.startsWith(code)) {
      return map[k];
    }
  }

  return null;
}

export function getAllGopKeys(year: string): string[] {
  const map = year === '2026' ? gops2026Data : gops2024Data;
  return Object.keys(map);
}
`;

  const outDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outDir, 'gopData.ts'), content, 'utf-8');
  console.log(`Generated src/data/gopData.ts with ${files2024.length} (2024) and ${files2026.length} (2026) files.`);
}

generate();
