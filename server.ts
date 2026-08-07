import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(express.json());

const metaCache: Record<string, any> = {};

function loadMeta(year: string) {
  if (metaCache[year]) {
    return metaCache[year];
  }

  const dirName = year === '2026' ? 'grants2026' : 'grants2024';
  const candidates = [
    path.join(process.cwd(), dirName, 'data', 'meta.json'),
    path.join(__dirname, dirName, 'data', 'meta.json'),
    path.join(__dirname, '..', dirName, 'data', 'meta.json'),
  ];

  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    console.error('Meta file not found in any candidate path:', candidates);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    metaCache[year] = JSON.parse(content);
    return metaCache[year];
  } catch (error) {
    console.error(`Failed to load meta for ${year}:`, error);
    return null;
  }
}

const gopCache2024: Record<string, any[]> = {};
const gopCache2026: Record<string, any[]> = {};

function initGopCache() {
  const years = ['2024', '2026'];
  for (const yr of years) {
    const dirName = yr === '2026' ? 'grants2026' : 'grants2024';
    const cache = yr === '2026' ? gopCache2026 : gopCache2024;
    const candidates = [
      path.join(process.cwd(), dirName, 'data', 'g'),
      path.join(__dirname, dirName, 'data', 'g'),
      path.join(__dirname, '..', dirName, 'data', 'g'),
    ];
    let targetDir = '';
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        targetDir = p;
        break;
      }
    }
    if (targetDir && fs.existsSync(targetDir)) {
      const files = fs.readdirSync(targetDir).filter((f) => f.endsWith('.json'));
      for (const f of files) {
        const key = f.replace('.json', '');
        try {
          const content = JSON.parse(fs.readFileSync(path.join(targetDir, f), 'utf-8'));
          cache[key] = content;
        } catch (e) {
          console.error(`Error loading ${f}:`, e);
        }
      }
    }
  }
}

initGopCache();

function getGopMap(year: string): Record<string, any[]> {
  return year === '2026' ? gopCache2026 : gopCache2024;
}

function getGopData(year: string, code: string): any[] | null {
  const map = getGopMap(year);
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

// API Routes
app.get('/api/meta', (req, res) => {
  const year = (req.query.year as string) || '2026';
  const meta = loadMeta(year);
  if (!meta) {
    return res.status(404).json({ error: 'Metadata not found' });
  }
  res.json(meta);
});

// Full Analytical Endpoint reading meta.json
app.get('/api/analytics', (req, res) => {
  const year = (req.query.year as string) || '2026';
  const meta = loadMeta(year);

  if (!meta) {
    return res.status(404).json({ error: 'Metadata not found' });
  }

  const totalGrants = meta.total || 0;

  // 1. Area Breakdown (by 6B01..6B11)
  const areaMap = new Map<string, { code: string; nameKz: string; nameRu: string; grantsCount: number; gopsCount: number }>();
  if (meta.areas) {
    meta.areas.forEach((a: any[]) => {
      areaMap.set(a[0], { code: a[0], nameKz: a[1], nameRu: a[2], grantsCount: 0, gopsCount: 0 });
    });
  }

  if (meta.gops && meta.cgop) {
    meta.gops.forEach((g: any[], idx: number) => {
      const areaCode = g[3];
      const grants = meta.cgop[idx] || 0;
      if (areaMap.has(areaCode)) {
        const item = areaMap.get(areaCode)!;
        item.grantsCount += grants;
        item.gopsCount += 1;
      } else {
        // Fallback for codes without clear prefix
        const basePrefix = areaCode ? areaCode.split(' ')[0] : 'Other';
        if (!areaMap.has(basePrefix)) {
          areaMap.set(basePrefix, { code: basePrefix, nameKz: basePrefix, nameRu: basePrefix, grantsCount: 0, gopsCount: 0 });
        }
        const item = areaMap.get(basePrefix)!;
        item.grantsCount += grants;
        item.gopsCount += 1;
      }
    });
  }

  const areaBreakdown = Array.from(areaMap.values())
    .map((a) => ({
      ...a,
      percentage: totalGrants > 0 ? Math.round((a.grantsCount / totalGrants) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.grantsCount - a.grantsCount);

  // 2. Regional Breakdown
  const regMap = new Map<number, { regCode: number; nameKz: string; nameRu: string; grantsCount: number; unisCount: number }>();
  if (meta.regs) {
    meta.regs.forEach((r: any[]) => {
      if (r[0] !== 0) {
        regMap.set(r[0], { regCode: r[0], nameKz: r[1], nameRu: r[2], grantsCount: 0, unisCount: 0 });
      }
    });
  }

  if (meta.unis && meta.cuni) {
    meta.unis.forEach((u: any[], idx: number) => {
      const regCode = u[3];
      const grants = meta.cuni[idx] || 0;
      if (regMap.has(regCode)) {
        const item = regMap.get(regCode)!;
        item.grantsCount += grants;
        item.unisCount += 1;
      }
    });
  }

  const regionalBreakdown = Array.from(regMap.values())
    .map((r) => ({
      ...r,
      percentage: totalGrants > 0 ? Math.round((r.grantsCount / totalGrants) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.grantsCount - a.grantsCount);

  // 3. Top Universities Ranking
  const topUnis = meta.unis.map((u: any[], idx: number) => {
    const regTuple = meta.regs.find((r: any[]) => r[0] === u[3]) || [u[3], '—', '—'];
    const grants = meta.cuni[idx] || 0;
    return {
      code: u[0],
      nameKz: u[1],
      nameRu: u[2],
      regCode: u[3],
      regNameKz: regTuple[1],
      regNameRu: regTuple[2],
      grantsCount: grants,
      percentage: totalGrants > 0 ? Math.round((grants / totalGrants) * 1000) / 10 : 0,
    };
  }).sort((a: any, b: any) => b.grantsCount - a.grantsCount).slice(0, 15);

  // 4. Top GOPs Ranking
  const topGops = meta.gops.map((g: any[], idx: number) => {
    const grants = meta.cgop[idx] || 0;
    return {
      code: g[0],
      nameKz: g[1],
      nameRu: g[2],
      areaCode: g[3],
      grantsCount: grants,
      percentage: totalGrants > 0 ? Math.round((grants / totalGrants) * 1000) / 10 : 0,
    };
  }).sort((a: any, b: any) => b.grantsCount - a.grantsCount).slice(0, 12);

  // 5. Special Categories Breakdown (from meta.secs)
  const categoriesBreakdown = meta.secs.map((s: any[]) => ({
    nameKz: s[0],
    nameRu: s[1],
  }));

  // 6. Metropolitan vs Regional Grant Ratio
  // Metropolitan codes: 16 (Almaty), 21 (Astana), 17 (Shymkent)
  let metroGrants = 0;
  let regionGrants = 0;
  regionalBreakdown.forEach((r) => {
    if ([16, 21, 17].includes(r.regCode)) {
      metroGrants += r.grantsCount;
    } else {
      regionGrants += r.grantsCount;
    }
  });

  const metroPercentage = totalGrants > 0 ? Math.round((metroGrants / totalGrants) * 1000) / 10 : 0;
  const regionPercentage = totalGrants > 0 ? Math.round((regionGrants / totalGrants) * 1000) / 10 : 0;

  res.json({
    year: meta.year,
    totalGrants,
    totalGops: meta.gops.length,
    totalUnis: meta.unis.length,
    totalAreas: meta.areas.length,
    areaBreakdown,
    regionalBreakdown,
    topUnis,
    topGops,
    categoriesBreakdown,
    metroGrants,
    metroPercentage,
    regionGrants,
    regionPercentage,
  });
});

// All Universities Full Stats & Ranking Endpoint
app.get('/api/universities/stats', (req, res) => {
  const year = (req.query.year as string) || '2026';
  const meta = loadMeta(year);
  if (!meta) return res.status(404).json({ error: 'Metadata not found' });

  const regMap = new Map<number, { nameKz: string; nameRu: string }>();
  if (meta.regs) {
    meta.regs.forEach((r: any[]) => regMap.set(r[0], { nameKz: r[1], nameRu: r[2] }));
  }

  const uniStatsMap = new Map<string, {
    code: string;
    nameKz: string;
    nameRu: string;
    regCode: number;
    regNameKz: string;
    regNameRu: string;
    totalGrants: number;
    scores: number[];
    gopsSet: Set<string>;
    isBranch: boolean;
  }>();

  // Initialize with meta.unis
  meta.unis.forEach((u: any[], idx: number) => {
    const regInfo = regMap.get(u[3]) || { nameKz: '—', nameRu: '—' };
    const nameLower = (u[1] + ' ' + u[2]).toLowerCase();
    const isBranch = u[0].startsWith('90') || nameLower.includes('филиал') || nameLower.includes('branch');
    uniStatsMap.set(u[0], {
      code: u[0],
      nameKz: u[1],
      nameRu: u[2],
      regCode: u[3],
      regNameKz: regInfo.nameKz,
      regNameRu: regInfo.nameRu,
      totalGrants: meta.cuni?.[idx] || 0,
      scores: [],
      gopsSet: new Set(),
      isBranch,
    });
  });

  const gopMap = getGopMap(year);

  for (const [gopCode, items] of Object.entries(gopMap)) {
    for (const item of (items as any[])) {
      const [, , score, , uniIndex] = item;
      const uTuple = meta.unis[uniIndex];
      if (!uTuple) continue;
      const uniCode = uTuple[0];
      const stat = uniStatsMap.get(uniCode);
      if (stat) {
        stat.scores.push(score);
        stat.gopsSet.add(gopCode);
      }
    }
  }

  const result = Array.from(uniStatsMap.values()).map((u) => {
    let avgScore = 0;
    let minScore = 0;
    let maxScore = 0;
    let medianScore = 0;

    if (u.scores.length > 0) {
      u.scores.sort((a, b) => a - b);
      minScore = u.scores[0];
      maxScore = u.scores[u.scores.length - 1];
      const sum = u.scores.reduce((a, b) => a + b, 0);
      avgScore = Math.round((sum / u.scores.length) * 10) / 10;
      medianScore = u.scores[Math.floor(u.scores.length / 2)];
    }

    return {
      code: u.code,
      nameKz: u.nameKz,
      nameRu: u.nameRu,
      regCode: u.regCode,
      regNameKz: u.regNameKz,
      regNameRu: u.regNameRu,
      totalGrants: u.totalGrants,
      avgScore,
      minScore,
      maxScore,
      medianScore,
      gopsCount: u.gopsSet.size,
      isBranch: u.isBranch,
    };
  });

  res.json(result);
});

// Single University Detailed Passport Endpoint
app.get('/api/uni/:code', (req, res) => {
  const year = (req.query.year as string) || '2026';
  const targetCode = req.params.code;
  const meta = loadMeta(year);

  if (!meta) return res.status(404).json({ error: 'Metadata not found' });

  const uniTuple = meta.unis.find(
    (u: any[]) => u[0] === targetCode || u[0] === targetCode.padStart(3, '0')
  );

  if (!uniTuple) {
    return res.status(404).json({ error: 'University not found' });
  }

  const regTuple = meta.regs.find((r: any[]) => r[0] === uniTuple[3]) || [uniTuple[3], '—', '—'];

  const gopsMap = new Map<string, {
    gopCode: string;
    gopNameKz: string;
    gopNameRu: string;
    areaCode: string;
    grantsCount: number;
    scores: number[];
  }>();

  const recipients: any[] = [];

  const gopMap = getGopMap(year);

  for (const [gopCode, items] of Object.entries(gopMap)) {
    for (const item of (items as any[])) {
      const [untId, fullName, score, gopIndex, uniIndex, q1, q2, spec] = item;
      const uTuple = meta.unis[uniIndex];
      if (!uTuple || (uTuple[0] !== targetCode && uTuple[0] !== targetCode.padStart(3, '0'))) continue;

      const gTuple = meta.gops[gopIndex] || [gopCode, gopCode, gopCode, ''];

      recipients.push({
        untId,
        fullName,
        score,
        gopCode: gTuple[0],
        gopNameKz: gTuple[1],
        gopNameRu: gTuple[2],
        q1,
        q2,
        spec,
      });

      if (!gopsMap.has(gopCode)) {
        gopsMap.set(gopCode, {
          gopCode,
          gopNameKz: gTuple[1],
          gopNameRu: gTuple[2],
          areaCode: gTuple[3],
          grantsCount: 0,
          scores: [],
        });
      }
      const gStat = gopsMap.get(gopCode)!;
      gStat.grantsCount++;
      gStat.scores.push(score);
    }
  }

  recipients.sort((a, b) => b.score - a.score);

  const gopsList = Array.from(gopsMap.values()).map((g) => {
    g.scores.sort((a, b) => a - b);
    const sum = g.scores.reduce((a, b) => a + b, 0);
    return {
      gopCode: g.gopCode,
      gopNameKz: g.gopNameKz,
      gopNameRu: g.gopNameRu,
      areaCode: g.areaCode,
      grantsCount: g.grantsCount,
      minScore: g.scores[0],
      maxScore: g.scores[g.scores.length - 1],
      avgScore: Math.round((sum / g.scores.length) * 10) / 10,
    };
  }).sort((a, b) => b.grantsCount - a.grantsCount);

  const totalGrants = recipients.length;
  let avgScore = 0;
  let minScore = 0;
  let maxScore = 0;

  if (totalGrants > 0) {
    const scores = recipients.map((r) => r.score).sort((a, b) => a - b);
    minScore = scores[0];
    maxScore = scores[scores.length - 1];
    avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / totalGrants) * 10) / 10;
  }

  res.json({
    code: uniTuple[0],
    nameKz: uniTuple[1],
    nameRu: uniTuple[2],
    regCode: uniTuple[3],
    regNameKz: regTuple[1],
    regNameRu: regTuple[2],
    totalGrants,
    avgScore,
    minScore,
    maxScore,
    gopsCount: gopsList.length,
    gopsList,
    topRecipients: recipients.slice(0, 30),
  });
});

// Get GOP Detail
app.get('/api/gop/:code', (req, res) => {
  const year = (req.query.year as string) || '2026';
  const code = req.params.code;
  const meta = loadMeta(year);

  if (!meta) {
    return res.status(404).json({ error: 'Metadata not found' });
  }

  // Find GOP tuple in meta
  const gopTuple = meta.gops.find((g: any[]) => g[0] === code || g[0].toLowerCase() === code.toLowerCase());
  if (!gopTuple) {
    return res.status(404).json({ error: 'GOP code not found in meta' });
  }

  const rawData = getGopData(year, code);

  if (!rawData || rawData.length === 0) {
    return res.json({
      code: gopTuple[0],
      nameKz: gopTuple[1],
      nameRu: gopTuple[2],
      areaCode: gopTuple[3],
      totalRecipients: 0,
      minScore: 0,
      maxScore: 0,
      avgScore: 0,
      recipients: [],
      uniBreakdown: [],
    });
  }

  try {
    
    let minScore = Infinity;
    let maxScore = 0;
    let totalScore = 0;
    const uniMap = new Map<string, { count: number; minScore: number; maxScore: number; totalScore: number }>();

    const recipients = rawData.map((item) => {
      // item[3] is gopIndex, item[4] is uniIndex in dataset
      const [untId, fullName, score, gopIndex, uniIndex, q1, q2, spec] = item;
      
      if (score < minScore) minScore = score;
      if (score > maxScore) maxScore = score;
      totalScore += score;

      const uniTuple = meta.unis[uniIndex] || [String(uniIndex), 'Белгісіз', 'Неизвестно', 0];
      const uniCode = uniTuple[0];

      if (!uniMap.has(uniCode)) {
        uniMap.set(uniCode, { count: 0, minScore: Infinity, maxScore: 0, totalScore: 0 });
      }
      const uStat = uniMap.get(uniCode)!;
      uStat.count++;
      if (score < uStat.minScore) uStat.minScore = score;
      if (score > uStat.maxScore) uStat.maxScore = score;
      uStat.totalScore += score;

      return {
        untId,
        fullName,
        score,
        uniCode,
        uniNameKz: uniTuple[1],
        uniNameRu: uniTuple[2],
        quotaFlag1: q1,
        quotaFlag2: q2,
        specialQuota: spec,
      };
    });

    const count = recipients.length;
    const avgScore = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;

    const uniBreakdown = Array.from(uniMap.entries()).map(([uniCode, stat]) => {
      const uniTuple = meta.unis.find((u: any[]) => u[0] === uniCode) || [uniCode, 'Белгісіз', 'Неизвестно', 0];
      return {
        uniCode,
        uniNameKz: uniTuple[1],
        uniNameRu: uniTuple[2],
        regCode: uniTuple[3],
        count: stat.count,
        minScore: stat.minScore === Infinity ? 0 : stat.minScore,
        maxScore: stat.maxScore,
        avgScore: Math.round((stat.totalScore / stat.count) * 10) / 10,
      };
    }).sort((a, b) => b.count - a.count);

    res.json({
      code: gopTuple[0],
      nameKz: gopTuple[1],
      nameRu: gopTuple[2],
      areaCode: gopTuple[3],
      totalRecipients: count,
      minScore: minScore === Infinity ? 0 : minScore,
      maxScore,
      avgScore,
      recipients,
      uniBreakdown,
    });
  } catch (err) {
    console.error('Error reading GOP file:', err);
    res.status(500).json({ error: 'Failed to process GOP dataset' });
  }
});

// Search Applicants
app.get('/api/search/applicant', (req, res) => {
  const year = (req.query.year as string) || '2026';
  const query = (req.query.q as string || '').trim().toLowerCase();

  if (!query || query.length < 2) {
    return res.json([]);
  }

  const meta = loadMeta(year);
  if (!meta) return res.json([]);

  const gopMap = getGopMap(year);
  const results: any[] = [];
  const isNumeric = /^\d+$/.test(query);

  for (const [gopCode, items] of Object.entries(gopMap)) {
    if (results.length >= 50) break;
    const gopTuple = meta.gops.find((g: any[]) => g[0] === gopCode) || [gopCode, gopCode, gopCode, ''];

    for (const item of (items as any[])) {
      const [untId, fullName, score, gopIndex, uniIndex, q1, q2, spec] = item;
      const matches = isNumeric
        ? untId.includes(query)
        : fullName.toLowerCase().includes(query);

      if (matches) {
        const uniTuple = meta.unis[uniIndex] || [String(uniIndex), 'Белгісіз', 'Неизвестно', 0];
        results.push({
          untId,
          fullName,
          score,
          gopCode,
          gopNameKz: gopTuple[1],
          gopNameRu: gopTuple[2],
          uniCode: uniTuple[0],
          uniNameKz: uniTuple[1],
          uniNameRu: uniTuple[2],
          quotaFlag1: q1,
          quotaFlag2: q2,
          specialQuota: spec,
          year,
        });

        if (results.length >= 50) break;
      }
    }
  }

  res.json(results);
});

// Chance Estimator / Calculator
app.get('/api/calculate', (req, res) => {
  const score = parseInt(req.query.score as string, 10) || 0;
  const gopCode = req.query.gop as string;
  const year = (req.query.year as string) || '2026';

  if (!gopCode) {
    return res.status(400).json({ error: 'GOP code required' });
  }

  const meta = loadMeta(year);
  if (!meta) return res.status(404).json({ error: 'Metadata not found' });

  const gopTuple = meta.gops.find((g: any[]) => g[0] === gopCode);
  if (!gopTuple) {
    return res.status(404).json({ error: 'GOP not found' });
  }

  const items = getGopData(year, gopCode) || [];

  let minPassingScore = 140;
  let maxScore = 0;
  let totalScore = 0;
  let totalGrants = items.length;
  let scores: number[] = [];

  if (items.length > 0) {
    scores = items.map((i) => i[2]).sort((a, b) => a - b);
    minPassingScore = scores[0];
    maxScore = scores[scores.length - 1];
    totalScore = scores.reduce((acc, curr) => acc + curr, 0);
  }

  const avgScore = totalGrants > 0 ? Math.round((totalScore / totalGrants) * 10) / 10 : 0;

  // Calculate chance percentage
  let chancePercent = 0;
  let chanceLabel: 'high' | 'medium' | 'low' | 'unlikely' = 'unlikely';

  if (score < minPassingScore) {
    const diff = minPassingScore - score;
    if (diff <= 3) {
      chancePercent = Math.max(10, 40 - diff * 10);
      chanceLabel = 'low';
    } else {
      chancePercent = Math.max(2, 20 - diff * 5);
      chanceLabel = 'unlikely';
    }
  } else if (score >= avgScore) {
    chancePercent = Math.min(99, 85 + Math.round(((score - avgScore) / (maxScore - avgScore + 1)) * 14));
    chanceLabel = 'high';
  } else {
    // Between min and avg
    chancePercent = 50 + Math.round(((score - minPassingScore) / (avgScore - minPassingScore + 1)) * 34);
    chanceLabel = 'medium';
  }

  // Calculate percentile
  let belowCount = 0;
  for (const s of scores) {
    if (s < score) belowCount++;
  }
  const percentile = scores.length > 0 ? Math.round((belowCount / scores.length) * 100) : 0;

  // Recommendations: Find other GOPs in same area or overall where user has higher chance
  const recommendations: any[] = [];
  const areaCode = gopTuple[3];

  for (const otherGop of meta.gops) {
    if (otherGop[0] === gopCode) continue;
    if (recommendations.length >= 4) break;

    const otherItems = getGopData(year, otherGop[0]);
    if (!otherItems || otherItems.length === 0) continue;

    const otherScores = otherItems.map((i) => i[2]).sort((a, b) => a - b);
    const otherMin = otherScores[0];
    const otherAvg = Math.round((otherScores.reduce((a, b) => a + b, 0) / otherItems.length) * 10) / 10;

    if (score >= otherMin) {
      const recChance = score >= otherAvg ? 88 : 65;
      recommendations.push({
        gopCode: otherGop[0],
        gopNameKz: otherGop[1],
        gopNameRu: otherGop[2],
        minScore: otherMin,
        avgScore: otherAvg,
        totalGrants: otherItems.length,
        chancePercent: recChance,
      });
    }
  }

  res.json({
    score,
    gopCode,
    gopNameKz: gopTuple[1],
    gopNameRu: gopTuple[2],
    minPassingScore,
    maxScore,
    avgScore,
    totalGrants,
    chancePercent,
    chanceLabel,
    percentile,
    recommendations,
  });
});

// Comparison Insights
app.get('/api/stats/comparison', (req, res) => {
  const m24 = loadMeta('2024');
  const m26 = loadMeta('2026');

  if (!m24 || !m26) {
    return res.status(500).json({ error: 'Data not loaded' });
  }

  // Compare total grants
  const grants2024 = m24.total;
  const grants2026 = m26.total;

  // Compare universities count and detect new branch campuses in 2026
  const unis2024Codes = new Set(m24.unis.map((u: any[]) => u[0]));
  const newUnis2026 = m26.unis.filter((u: any[]) => !unis2024Codes.has(u[0]));

  res.json({
    grants2024,
    grants2026,
    gopsCount2024: m24.gops.length,
    gopsCount2026: m26.gops.length,
    unisCount2024: m24.unis.length,
    unisCount2026: m26.unis.length,
    newBranchCampuses2026: newUnis2026.map((u: any[]) => ({
      code: u[0],
      nameKz: u[1],
      nameRu: u[2],
      regCode: u[3],
    })),
  });
});

async function startServer() {
  // Vite dev middleware or static serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GRAND Grants Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

export { app };

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const isLocalDev = process.env.NODE_ENV !== 'production' && !isVercel;

if (isLocalDev) {
  startServer();
}