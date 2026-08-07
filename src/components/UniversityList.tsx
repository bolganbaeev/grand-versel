import React, { useState, useMemo, useEffect } from 'react';
import { Language, MetaData, Year } from '../types';
import { 
  Building2, 
  Search, 
  MapPin, 
  Award, 
  ChevronRight, 
  Trophy, 
  TrendingUp, 
  Sparkles, 
  Globe2, 
  Layers, 
  CheckCircle2,
  Filter,
  BarChart3
} from 'lucide-react';
import { UniversityDetailModal } from './UniversityDetailModal';

interface UniversityListProps {
  lang: Language;
  year: Year;
  meta: MetaData | null;
  onSelectGop: (code: string) => void;
  setActiveTab: (tab: string) => void;
}

interface UniversityStats {
  code: string;
  nameKz: string;
  nameRu: string;
  regCode: number;
  regNameKz: string;
  regNameRu: string;
  totalGrants: number;
  avgScore: number;
  minScore: number;
  maxScore: number;
  medianScore: number;
  gopsCount: number;
  isBranch: boolean;
}

export const UniversityList: React.FC<UniversityListProps> = ({
  lang,
  year,
  meta,
  onSelectGop,
  setActiveTab,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [rankingMode, setRankingMode] = useState<'prestigious' | 'grants' | 'minScore' | 'branches'>('prestigious');
  const [statsData, setStatsData] = useState<UniversityStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUniCode, setSelectedUniCode] = useState<string | null>(null);

  const isKz = lang === 'kz';

  // Fetch full stats from API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/universities/stats?year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setStatsData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching university stats:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [year]);

  // Filtered & Ranked University List
  const processedList = useMemo(() => {
    let list = [...statsData];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.code.toLowerCase().includes(q) ||
          u.nameKz.toLowerCase().includes(q) ||
          u.nameRu.toLowerCase().includes(q)
      );
    }

    if (selectedRegion !== 'all') {
      const codeNum = parseInt(selectedRegion, 10);
      list = list.filter((u) => u.regCode === codeNum);
    }

    if (rankingMode === 'branches') {
      list = list.filter((u) => u.isBranch || u.code.startsWith('90'));
    }

    // Sorting logic based on ranking mode
    list.sort((a, b) => {
      if (rankingMode === 'prestigious') {
        return b.avgScore - a.avgScore;
      }
      if (rankingMode === 'minScore') {
        return b.minScore - a.minScore;
      }
      if (rankingMode === 'branches') {
        return b.totalGrants - a.totalGrants;
      }
      return b.totalGrants - a.totalGrants; // 'grants'
    });

    return list;
  }, [statsData, searchTerm, selectedRegion, rankingMode]);

  // Top 3 Podium
  const topPodium = useMemo(() => {
    return processedList.slice(0, 3);
  }, [processedList]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            {isKz ? 'Университеттер Рейтингі мен Порталы' : 'Рейтинг и Портал ВУЗов'} ({year})
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-white">
            {isKz ? 'Қазақстанның Үздік Жоғары Оқу Орындары' : 'Лучшие Университеты и ВУЗы Казахстана'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isKz 
              ? 'Грант саны, орташа ҰБТ балы, өту деңгейі және халықаралық кампустар бойынша ЖОО-лардың толық аналитикалық тізімі мен рейтингі.'
              : 'Полная аналитическая база и рейтинг ВУЗов Казахстана по количеству грантов, среднему баллу ЕНТ и международным филиалам.'}
          </p>
        </div>
      </div>

      {/* Ranking Mode Switcher Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setRankingMode('prestigious')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              rankingMode === 'prestigious'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            {isKz ? '🔥 Ең Беделді (Орташа ҰБТ балы)' : '🔥 Самые Престижные (Средний ЕНТ)'}
          </button>

          <button
            onClick={() => setRankingMode('grants')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              rankingMode === 'grants'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            {isKz ? '🏆 Грант Көлемі Бойынша' : '🏆 По Количеству Грантов'}
          </button>

          <button
            onClick={() => setRankingMode('minScore')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              rankingMode === 'minScore'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {isKz ? '🎯 Ең Жоғары Өту Баллы' : '🎯 Самый Высокий Проходной'}
          </button>

          <button
            onClick={() => setRankingMode('branches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              rankingMode === 'branches'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            {isKz ? '🌍 Халықаралық Филиалдар (2026)' : '🌍 Международные Филиалы (2026)'}
          </button>
        </div>

        {/* Search and Filters Input */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={isKz ? 'Университет коды немесе атауы бойынша іздеу...' : 'Поиск по коду или названию ВУЗа...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="all">{isKz ? 'Барлық өңірлер' : 'Все регионы'}</option>
              {meta?.regs.map((r) => (
                <option key={r[0]} value={r[0]}>
                  {isKz ? r[1] : r[2]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Podium Cards for Top 3 (if no search filter is active) */}
      {!searchTerm && selectedRegion === 'all' && topPodium.length >= 3 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-500" />
            {rankingMode === 'prestigious' && (isKz ? 'ҰБТ БАЛЛЫ БОЙЫНША ТҮСКЕН ЕҢ БЕДЕЛДІ ТОП-3 УНИВЕРСИТЕТ' : 'ТОП-3 САМЫХ ПРЕСТИЖНЫХ ВУЗА ПО БАЛЛАМ ЕНТ')}
            {rankingMode === 'grants' && (isKz ? 'ГРАНТ САНЫ БОЙЫНША ТҮСКЕН ТОП-3 УНИВЕРСИТЕТ' : 'ТОП-3 ВУЗА ПО КОЛИЧЕСТВУ ГРАНТОВ')}
            {rankingMode === 'minScore' && (isKz ? 'ЕҢ ЖОҒАРЫ ӨТУ БАЛЫ БАР ТОП-3 УНИВЕРСИТЕТ' : 'ТОП-3 ВУЗА С НАИВЫСШИМ МИНИМАЛЬНЫМ БАЛЛОМ')}
            {rankingMode === 'branches' && (isKz ? 'ЕҢ ТАНЫМАЛ ТОП-3 ХАЛЫҚАРАЛЫҚ ФИЛИАЛ' : 'ТОП-3 МЕЖДУНАРОДНЫХ ФИЛИАЛА')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPodium.map((uni, idx) => {
              const medals = ['🥇 #1', '🥈 #2', '🥉 #3'];
              const medalStyles = [
                'bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-amber-500/20',
                'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-500/20',
                'bg-gradient-to-br from-amber-700 to-yellow-900 text-white shadow-amber-900/20',
              ];

              return (
                <div
                  key={uni.code}
                  onClick={() => setSelectedUniCode(uni.code)}
                  className="bg-white rounded-2xl p-5 border-2 border-slate-200/90 hover:border-teal-500 shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-black shadow-xs ${medals[idx] ? medalStyles[idx] : ''}`}>
                        {medals[idx]}
                      </span>

                      <span className="font-mono text-xs font-extrabold bg-slate-900 text-teal-400 px-2.5 py-1 rounded-lg">
                        {uni.code}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-slate-900 group-hover:text-teal-900 text-base leading-snug line-clamp-2">
                      {isKz ? uni.nameKz : uni.nameRu}
                    </h3>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{isKz ? 'Орташа ҰБТ балы:' : 'Средний балл ЕНТ:'}</span>
                      <span className="font-mono font-bold text-teal-700 text-sm">{uni.avgScore}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{isKz ? 'Бөлінген гранттар:' : 'Выделено грантов:'}</span>
                      <span className="font-mono font-bold text-slate-900">{uni.totalGrants.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        {isKz ? uni.regNameKz : uni.regNameRu}
                      </span>
                      <span className="text-teal-600 font-bold text-[11px] group-hover:underline flex items-center gap-0.5">
                        {isKz ? 'Паспорт' : 'Паспорт'} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Universities Grid / Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            {isKz ? `Табылды: ${processedList.length} университет` : `Найдено: ${processedList.length} университетов`}
          </span>
          <span>
            {isKz ? 'Карточканы басып толық мамандықтар мен студенттер тізімін ашыңыз' : 'Кликните для просмотра мамандығы и точного списка'}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">
              {isKz ? 'Университеттер рейтингі дайындалуда...' : 'Подготовка рейтинга ВУЗов...'}
            </p>
          </div>
        ) : processedList.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl text-center border border-slate-200 text-slate-500 text-sm">
            {isKz ? 'Іздеу бойынша университеттер табылмады.' : 'Университеты по запросу не найдены.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedList.map((uni, idx) => (
              <div
                key={uni.code}
                onClick={() => setSelectedUniCode(uni.code)}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400/90 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-teal-400">
                        {uni.code}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                      {uni.totalGrants.toLocaleString()} {isKz ? 'грант' : 'грантов'}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-teal-900 leading-snug line-clamp-2">
                    {isKz ? uni.nameKz : uni.nameRu}
                  </h3>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-slate-400">{isKz ? 'Орташа ҰБТ:' : 'Ср. балл ЕНТ:'}</div>
                      <div className="font-mono font-bold text-teal-700">{uni.avgScore > 0 ? uni.avgScore : '—'}</div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-slate-400">{isKz ? 'Өту балы:' : 'Мин. балл:'}</div>
                      <div className="font-mono font-bold text-amber-700">{uni.minScore > 0 ? uni.minScore : '—'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 group-hover:text-teal-700 font-semibold pt-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span className="truncate max-w-[140px]">{isKz ? uni.regNameKz : uni.regNameRu}</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Passport Modal */}
      {selectedUniCode && (
        <UniversityDetailModal
          uniCode={selectedUniCode}
          lang={lang}
          year={year}
          onClose={() => setSelectedUniCode(null)}
          onSelectGop={onSelectGop}
          setActiveTab={setActiveTab}
        />
      )}

    </div>
  );
};
