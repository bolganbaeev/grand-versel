import React, { useState, useMemo } from 'react';
import { CalculatorOutput, Language, MetaData, Year } from '../types';
import { 
  Calculator as CalcIcon, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Search
} from 'lucide-react';

interface CalculatorProps {
  lang: Language;
  year: Year;
  meta: MetaData | null;
  onSelectGop: (gopCode: string) => void;
  setActiveTab: (tab: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  lang,
  year,
  meta,
  onSelectGop,
  setActiveTab,
}) => {
  const [score, setScore] = useState<number>(95);
  const [selectedGop, setSelectedGop] = useState<string>('B057');
  const [hasQuota, setHasQuota] = useState<boolean>(false);
  const [quotaType, setQuotaType] = useState<string>('rural');
  const [searchGopText, setSearchGopText] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CalculatorOutput | null>(null);

  const isKz = lang === 'kz';

  // Filtered GOP list for searchable dropdown
  const filteredGops = useMemo(() => {
    if (!meta) return [];
    const q = searchGopText.toLowerCase().trim();
    if (!q) return meta.gops;
    return meta.gops.filter(
      (g) =>
        g[0].toLowerCase().includes(q) ||
        g[1].toLowerCase().includes(q) ||
        g[2].toLowerCase().includes(q)
    );
  }, [meta, searchGopText]);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedGop) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/calculate?score=${score}&gop=${selectedGop}&year=${year}`
      );
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          {isKz ? 'ҰБТ-2026 Ақылды Грант Индикаторы' : 'Умный Индикатор Грантов ЕНТ'}
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isKz ? 'Грантқа түсу мүмкіндігін есептеу' : 'Калькулятор шансов на грант'}
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          {isKz
            ? 'ҰБТ балыңыз бен таңдаған мамандығыңызды енгізіп, ресми грант конкурсының нәтижелері негізінде мүмкіндігіңізді бағалаңыз.'
            : 'Введите ваши баллы ЕНТ и выберите ГОП для расчета вероятности получения гранта по официальным данным конкурса.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <form onSubmit={handleCalculate} className="space-y-6">
            
            {/* UNT Score Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>{isKz ? 'ҰБТ балы (0 - 140)' : 'Балл ЕНТ (0 - 140)'}</span>
                <span className="font-mono text-sm text-teal-600 font-extrabold">{score}</span>
              </label>

              <input
                type="number"
                min={0}
                max={140}
                value={score}
                onChange={(e) => setScore(Math.min(140, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-lg font-bold font-mono text-slate-900 transition-all"
              />

              <input
                type="range"
                min={0}
                max={140}
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Educational Program Group (GOP) Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {isKz ? 'Мамандық тобы (БББТ / ГОП)' : 'Группа обр. программ (ГОП)'}
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder={isKz ? 'Код немесе атауы бойынша іздеу...' : 'Поиск по коду или названию...'}
                  value={searchGopText}
                  onChange={(e) => setSearchGopText(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-hidden transition-all mb-2"
                />
              </div>

              <select
                value={selectedGop}
                onChange={(e) => setSelectedGop(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all bg-white"
              >
                {filteredGops.map((g) => (
                  <option key={g[0]} value={g[0]}>
                    {g[0]} - {isKz ? g[1] : g[2]}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Quota Toggle */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  {isKz ? 'Квота бар ма?' : 'Имеется ли квота?'}
                </span>
                <button
                  type="button"
                  onClick={() => setHasQuota(!hasQuota)}
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    hasQuota ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {hasQuota && (
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs space-y-2 animate-fadeIn">
                  <label className="block text-[11px] font-semibold text-teal-900">
                    {isKz ? 'Квота түрі:' : 'Тип квоты:'}
                  </label>
                  <select
                    value={quotaType}
                    onChange={(e) => setQuotaType(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 bg-white text-xs font-medium text-slate-800"
                  >
                    <option value="rural">{isKz ? 'Ауыл квотасы (30%)' : 'Сельская квота (30%)'}</option>
                    <option value="largeFamily">{isKz ? 'Көпбалалы отбасы квотасы' : 'Многодетная семья'}</option>
                    <option value="disabled">{isKz ? 'Мүгедектік / Арнайы квота' : 'Квота по инвалидности'}</option>
                  </select>
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CalcIcon className="w-4 h-4" />
                  {isKz ? 'Есептеу' : 'Рассчитать вероятность'}
                </>
              )}
            </button>

          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
              
              {/* Chance Badge & Percentage */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isKz ? 'Грантқа түсу ықтималдығы' : 'Вероятность получения гранта'}
                  </div>
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    {isKz ? result.gopNameKz : result.gopNameRu} ({result.gopCode})
                  </h2>
                </div>

                <div className="text-center shrink-0">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-extrabold text-lg sm:text-xl ${
                    result.chanceLabel === 'high'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : result.chanceLabel === 'medium'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {result.chanceLabel === 'high' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {result.chanceLabel === 'medium' && <TrendingUp className="w-5 h-5 text-amber-600" />}
                    {result.chanceLabel === 'low' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                    <span>{result.chancePercent}%</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                    {result.chanceLabel === 'high' && (isKz ? 'Жоғары мүмкіндік' : 'Высокий шанс')}
                    {result.chanceLabel === 'medium' && (isKz ? 'Орташа мүмкіндік' : 'Средний шанс')}
                    {result.chanceLabel === 'low' && (isKz ? 'Төмен мүмкіндік' : 'Низкий шанс')}
                    {result.chanceLabel === 'unlikely' && (isKz ? 'Өту балы жеткіліксіз' : 'Ниже проходного')}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.chancePercent >= 75
                        ? 'bg-emerald-500'
                        : result.chancePercent >= 45
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(5, result.chancePercent)}%` }}
                  />
                </div>
              </div>

              {/* Score Statistics Cards */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-[11px] font-bold uppercase text-slate-500">
                    {isKz ? 'Минималды өту балы' : 'Мин. проходной'}
                  </div>
                  <div className="text-xl font-mono font-extrabold text-slate-900 mt-1">
                    {result.minPassingScore}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 text-center">
                  <div className="text-[11px] font-bold uppercase text-teal-800">
                    {isKz ? 'Орташа балл' : 'Средний балл'}
                  </div>
                  <div className="text-xl font-mono font-extrabold text-teal-900 mt-1">
                    {result.avgScore}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-[11px] font-bold uppercase text-slate-500">
                    {isKz ? 'Максималды балл' : 'Максимальный'}
                  </div>
                  <div className="text-xl font-mono font-extrabold text-slate-900 mt-1">
                    {result.maxScore}
                  </div>
                </div>
              </div>

              {/* Percentile Info */}
              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-xs text-indigo-950 flex items-center gap-3">
                <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  {isKz
                    ? `Сіздің балыңыз (${result.score}) өткен жылғы грант иегерлерінің ${result.percentile}%-нан жоғары.`
                    : `Ваш балл (${result.score}) выше, чем у ${result.percentile}% обладателей гранта прошлого года.`}
                </span>
              </div>

              {/* Alternative Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    {isKz ? 'Баламалы мамандықтар (жоғары мүмкіндік):' : 'Альтернативные ГОП с высоким шансом:'}
                  </h3>

                  <div className="space-y-2">
                    {result.recommendations.map((rec) => (
                      <div
                        key={rec.gopCode}
                        onClick={() => {
                          onSelectGop(rec.gopCode);
                          setActiveTab('gops');
                        }}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 flex items-center justify-between text-xs transition-all cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800">
                            {rec.gopCode} - {isKz ? rec.gopNameKz : rec.gopNameRu}
                          </div>
                          <div className="text-slate-500">
                            {isKz ? `Мин. өту балы: ${rec.minScore}` : `Мин. проходной: ${rec.minScore}`}
                          </div>
                        </div>

                        <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
                          {rec.chancePercent}% {isKz ? 'мүмкіндік' : 'шанс'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <CalcIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-display font-bold text-base text-slate-700">
                {isKz ? 'Есептеу нәтижесі осында шығады' : 'Результаты расчета появятся здесь'}
              </h3>
              <p className="text-xs max-w-sm mx-auto">
                {isKz
                  ? 'Сол жақтағы формада ҰБТ балыңыз бен мамандықты таңдап, «Есептеу» батырмасын басыңыз.'
                  : 'Выберите баллы ЕНТ и ГОП слева, затем нажмите «Рассчитать».'}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};