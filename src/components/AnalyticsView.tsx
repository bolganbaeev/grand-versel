import React, { useEffect, useState } from 'react';
import { Language, Year } from '../types';
import { 
  BarChart3, 
  PieChart, 
  Building2, 
  BookOpen, 
  MapPin, 
  TrendingUp, 
  Award, 
  Globe2, 
  Layers, 
  Zap, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface AnalyticsViewProps {
  lang: Language;
  year: Year;
}

interface AnalyticsData {
  year: string;
  totalGrants: number;
  totalGops: number;
  totalUnis: number;
  totalAreas: number;
  areaBreakdown: {
    code: string;
    nameKz: string;
    nameRu: string;
    grantsCount: number;
    gopsCount: number;
    percentage: number;
  }[];
  regionalBreakdown: {
    regCode: number;
    nameKz: string;
    nameRu: string;
    grantsCount: number;
    unisCount: number;
    percentage: number;
  }[];
  topUnis: {
    code: string;
    nameKz: string;
    nameRu: string;
    regCode: number;
    regNameKz: string;
    regNameRu: string;
    grantsCount: number;
    percentage: number;
  }[];
  topGops: {
    code: string;
    nameKz: string;
    nameRu: string;
    areaCode: string;
    grantsCount: number;
    percentage: number;
  }[];
  categoriesBreakdown: {
    nameKz: string;
    nameRu: string;
  }[];
  metroGrants: number;
  metroPercentage: number;
  regionGrants: number;
  regionPercentage: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ lang, year }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'areas' | 'unis' | 'gops' | 'regions' | 'categories'>('areas');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/analytics?year=${year}`)
      .then((res) => res.json())
      .then((resData) => {
        if (isMounted) {
          setData(resData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Analytics fetch error:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [year]);

  const isKz = lang === 'kz';

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">
          {isKz ? 'meta.json деректері негізінде аналитика дайындалуда...' : 'Подготовка аналитики на основе данных meta.json...'}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 text-center text-slate-500">
        {isKz ? 'Аналитикалық деректерді жүктеу мүмкін болмады.' : 'Не удалось загрузить аналитические данные.'}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            {isKz ? 'meta.json Деректер Аналитикасы' : 'Аналитика Данных meta.json'} ({data.year})
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-white mb-3">
            {isKz ? 'Қазақстан Гранттарының Толыққанды Аналитикалық Шолуы' : 'Комплексный Аналитический Обзор Грантов Казахстана'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isKz 
              ? `Бұл бөлімде meta.json файлындағы барлық ${data.totalGrants.toLocaleString()} мемлекеттік гранттың дайындық бағыттары, ЖОО-лар, өңірлер және квоталық санаттар бойынша терең талдауы берілген.` 
              : `В этом разделе представлен глубокий анализ всех ${data.totalGrants.toLocaleString()} государственных грантов из файла meta.json по направлениям подготовки, вузам, регионам и квотным категориям.`}
          </p>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{isKz ? 'Жалпы Грант Саны' : 'Всего Грантов'}</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {data.totalGrants.toLocaleString()}
          </div>
          <div className="text-xs text-teal-600 font-semibold mt-1">
            {isKz ? 'Мемлекеттік тапсырыс' : 'Госзаказ'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{isKz ? 'Білім беру салалары' : 'Области образования'}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {data.totalAreas}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {data.totalGops} {isKz ? 'БББТ (ГОП) қамтылған' : 'ГОП охвачено'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{isKz ? 'Әріптес ЖОО-лар' : 'ВУЗы-партнеры'}</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {data.totalUnis}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isKz ? 'Шетелдік филиалдармен' : 'Включая зарубежные филиалы'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{isKz ? 'Мегаполистер үлесі' : 'Доля мегаполисов'}</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {data.metroPercentage}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isKz ? 'Астана, Алматы, Шымкент' : 'Астана, Алматы, Шымкент'}
          </div>
        </div>
      </div>

      {/* Interactive Section Switcher Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('areas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'areas'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <PieChart className="w-4 h-4" />
          {isKz ? 'Салалық бөлініс' : 'Раздел по областям'}
        </button>

        <button
          onClick={() => setActiveSubTab('unis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'unis'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Building2 className="w-4 h-4" />
          {isKz ? 'Топ-15 Университеттер' : 'Топ-15 ВУЗов'}
        </button>

        <button
          onClick={() => setActiveSubTab('gops')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'gops'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {isKz ? 'Үздік Мамандықтар (ГОП)' : 'Топ Специальностей'}
        </button>

        <button
          onClick={() => setActiveSubTab('regions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'regions'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <MapPin className="w-4 h-4" />
          {isKz ? 'Өңірлік Бөлініс' : 'Региональный Раздел'}
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'categories'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          {isKz ? 'Санаттар мен Квоталар' : 'Категории и Квоты'}
        </button>
      </div>

      {/* SubTab 1: Area Breakdown */}
      {activeSubTab === 'areas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isKz ? 'Білім Беру Бағыттары Бойынша Гранттар Үлесі' : 'Распределение Грантов по Направлениям Обучения'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isKz ? 'Педагогика, Инженерия, АКТ, Медицина ж.б. салалар бойынша грант саны' : 'Распределение грантов по педагогике, инженерии, ИКТ, медицине и др.'}
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                11 {isKz ? 'Бағыт' : 'Направлений'}
              </span>
            </div>

            <div className="space-y-5">
              {data.areaBreakdown.map((area) => (
                <div key={area.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[11px]">
                        {area.code}
                      </span>
                      <span>{isKz ? area.nameKz : area.nameRu}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs hidden sm:inline">
                        {area.gopsCount} {isKz ? 'БББТ' : 'ГОП'}
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {area.grantsCount.toLocaleString()} {isKz ? 'грант' : 'грантов'}
                      </span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-xs">
                        {area.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, area.percentage * 2.8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insight Box */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-950 space-y-1">
              <p className="font-bold">
                {isKz ? 'Талдау нәтижесі (Инженерлік және Инженерлік-Ақпараттық басымдық):' : 'Результат анализа (Инженерный и ИТ приоритет):'}
              </p>
              <p>
                {isKz 
                  ? 'Мемлекеттік гранттардың ең үлкен үлесі Инженерлік, өңдеу өнеркәсібі (6B07), Ақпараттық-коммуникациялық технологиялар (6B06) және Педагогикалық ғылымдарға (6B01) бөлінген. Бұл еліміздегі техникалық мамандарға деген жоғары сұранысты көрсетеді.' 
                  : 'Наибольшая доля государственных грантов выделена на Инженерию и обработку (6B07), ИКТ (6B06) и Педагогические науки (6B01). Это отражает высокий государственный приоритет развития технического и цифрового потенциала.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Top Universities */}
      {activeSubTab === 'unis' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {isKz ? 'Ең Көп Грант Бөлінген Топ-15 Университет' : 'Топ-15 ВУЗов по Общему Количеству Грантов'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {isKz ? 'meta.json деректері бойынша мемлекеттік гранттардың ең үлкен көлемін иеленген ЖОО-лар' : 'ВУЗы, получившие крупнейший объем госзаказа по данным meta.json'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] bg-slate-50/50">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">{isKz ? 'Код' : 'Код'}</th>
                    <th className="py-3 px-3">{isKz ? 'Университет атауы' : 'Название ВУЗа'}</th>
                    <th className="py-3 px-3">{isKz ? 'Өңір' : 'Регион'}</th>
                    <th className="py-3 px-3 text-right">{isKz ? 'Грант саны' : 'Кол-во грантов'}</th>
                    <th className="py-3 px-3 text-right">{isKz ? 'Жалпы үлес' : 'Доля'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.topUnis.map((uni, idx) => (
                    <tr key={uni.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-teal-700">{uni.code}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        {isKz ? uni.nameKz : uni.nameRu}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {isKz ? uni.regNameKz : uni.regNameRu}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                        {uni.grantsCount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-emerald-600">
                        {uni.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Top GOPs */}
      {activeSubTab === 'gops' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {isKz ? 'Ең Көп Грант Бөлінген 12 Мамандық Тобы (БББТ)' : 'Топ-12 Групп Образовательных Программ (ГОП)'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {isKz ? 'Ақпараттық технологиялар, Инженерия, Мұғалімдер даярлау және Медицина салалары' : 'Информационные технологии, Инженерия, Педагогика и Медицина'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.topGops.map((gop, idx) => (
                <div key={gop.code} className="p-4 rounded-xl border border-slate-200/80 hover:border-teal-300 bg-slate-50/50 flex items-start gap-4 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded">
                        {gop.code}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 uppercase">
                        {gop.areaCode}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {isKz ? gop.nameKz : gop.nameRu}
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500">{isKz ? 'Бөлінген грант:' : 'Выделено грантов:'}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {gop.grantsCount.toLocaleString()}
                        </span>
                        <span className="font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-[11px]">
                          {gop.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Regional Breakdown */}
      {activeSubTab === 'regions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {isKz ? 'Өңірлер Бойынша Гранттар мен Университеттер Орналасуы' : 'Распределение Грантов и ВУЗов по Регионам'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {isKz ? '20 облыс пен республикалық маңызы бар қалалардың географиялық үлесі' : 'Географическое распределение по 20 областям и городам республиканского значения'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.regionalBreakdown.map((reg) => (
                <div key={reg.regCode} className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <MapPin className="w-4 h-4 text-teal-600" />
                      <span>{isKz ? reg.nameKz : reg.nameRu}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {reg.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{isKz ? 'Орналасқан ЖОО-лар:' : 'Расположено ВУЗов:'} <strong className="text-slate-900">{reg.unisCount}</strong></span>
                    <span>{isKz ? 'Гранттар:' : 'Гранты:'} <strong className="text-slate-900 font-mono">{reg.grantsCount.toLocaleString()}</strong></span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, reg.percentage * 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 5: Special Categories */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {isKz ? 'Конкурс Түрлері, Сециялар мен Квоталық Бағдарламалар' : 'Виды Конкурсов, Секций и Квотных Программ'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {isKz ? 'meta.json файлында бекітілген барлық 15 байқау санаты' : 'Все 15 категорий конкурсов, утвержденных в meta.json'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.categoriesBreakdown.map((cat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-semibold text-slate-800">
                    {isKz ? cat.nameKz : cat.nameRu}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <Globe2 className="w-4 h-4" />
              {isKz ? 'Шетелдік Серіктес Университеттер Филиалдары (2026 Ашылымдары)' : 'Зарубежные Филиалы Університетов (Открытия 2026)'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isKz 
                ? 'Қазақстанда ашылған шетелдік беделді жоғары оқу орындарының филиалдарына (Arizona State University, Heriot-Watt, City University of Hong Kong, Université de Lorraine, Anhalt University, Gazi Üniversitesi, МГИМО, ТИИИМСХ) арнайы халықаралық гранттар бөлінген.'
                : 'На филиалы ведущих зарубежных университетов в РК (Arizona State University, Heriot-Watt, City University of Hong Kong, Université de Lorraine, Anhalt University, Gazi Üniversitesi, МГИМО, ТИИИМСХ) выделены специальные гранты госзаказа.'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
