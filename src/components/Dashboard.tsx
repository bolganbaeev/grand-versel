import React, { useEffect, useState } from 'react';
import { Language, MetaData, Year } from '../types';
import { 
  Award, 
  BookOpen, 
  Building2, 
  Calculator, 
  Search, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Compass,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  lang: Language;
  year: Year;
  meta: MetaData | null;
  setActiveTab: (tab: string) => void;
  onSelectGop: (gopCode: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lang,
  year,
  meta,
  setActiveTab,
  onSelectGop,
}) => {
  const [topGops, setTopGops] = useState<{ code: string; nameKz: string; nameRu: string; count: number }[]>([]);

  useEffect(() => {
    if (meta) {
      // Get top GOPs by grant count from meta.cgop
      const combined = meta.gops.map((g, idx) => ({
        code: g[0],
        nameKz: g[1],
        nameRu: g[2],
        count: meta.cgop[idx] || 0,
      }));
      combined.sort((a, b) => b.count - a.count);
      setTopGops(combined.slice(0, 8));
    }
  }, [meta]);

  const isKz = lang === 'kz';

  // Key stats highlights
  const totalGrants = meta ? meta.total.toLocaleString() : year === '2026' ? '67,032' : '73,561';
  const totalGops = meta ? meta.gops.length : 100;
  const totalUnis = meta ? meta.unis.length : 90;
  const totalAreas = meta ? meta.areas.length : 10;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            {isKz ? `${year}-${Number(year) + 1} оқу жылы гранттар жинағы` : `Конкурс грантов РК ${year}-${Number(year) + 1}`}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {isKz
              ? 'Қазақстан Мемлекеттік Бiлiм Гранттары'
              : 'Государственные Образовательные Гранты РК'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isKz
              ? `Ресми конкурстық нәтижелер, минималды өту баллдары, мамандықтар (БББТ) тізімі және ҰБТ балыңыз бойынша грантқа түсу мүмкіндігін есептейтін ақылды калькулятор.`
              : `Официальные конкурсные проходные баллы, реестр ГОП мамандықтар и умный калькулятор шансов поступления на грант по вашим баллам ЕНТ.`}
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              {isKz ? 'Грант мүмкіндігін есептеу' : 'Рассчитать шанс на грант'}
            </button>

            <button
              onClick={() => setActiveTab('gops')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              {isKz ? 'БББТ тізімі мен баллдар' : 'Каталог ГОП и проходные баллы'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-slate-900">{totalGrants}</div>
            <div className="text-xs font-medium text-slate-500">
              {isKz ? 'Бөлінген грант саны' : 'Всего грантов за ' + year}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-slate-900">{totalGops}</div>
            <div className="text-xs font-medium text-slate-500">
              {isKz ? 'БББТ (Мамандық тобы)' : 'Групп обр. программ (ГОП)'}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-slate-900">{totalUnis}</div>
            <div className="text-xs font-medium text-slate-500">
              {isKz ? 'Жоғары оқу орындары' : 'Университетов в конкурсе'}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-slate-900">{totalAreas}</div>
            <div className="text-xs font-medium text-slate-500">
              {isKz ? 'Даярлау бағыттары' : 'Направлений подготовки'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Top Grants Volume GOPs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  {isKz ? 'Ең көп грант бөлінген мамандықтар (БББТ)' : 'ГОП с наибольшим количеством грантов'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isKz ? 'Әр мамандық бойынша өту баллдары мен статистикасын қараңыз' : 'Нажмите на ГОП для просмотра детальных проходных баллов'}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('gops')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                {isKz ? 'Барлығы' : 'Все'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topGops.map((gop) => (
                <div
                  key={gop.code}
                  onClick={() => {
                    onSelectGop(gop.code);
                    setActiveTab('gops');
                  }}
                  className="p-4 rounded-xl border border-slate-200/70 hover:border-teal-400/80 hover:bg-teal-50/40 transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60">
                      {gop.code}
                    </span>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                      {gop.count.toLocaleString()} {isKz ? 'грант' : 'грантов'}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-teal-900 line-clamp-2">
                    {isKz ? gop.nameKz : gop.nameRu}
                  </h3>

                  <div className="text-[11px] font-medium text-slate-400 group-hover:text-teal-600 flex items-center gap-1 pt-1">
                    <span>{isKz ? 'Өту баллдарын көру' : 'Посмотреть проходной балл'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Search Applicant CTA Box */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display text-base font-bold flex items-center gap-2 justify-center sm:justify-start">
                <Search className="w-5 h-5 text-teal-400" />
                {isKz ? 'ҰБТ грант иегерлерін ТЖК (ИКТ) арқылы іздеу' : 'Поиск грантников по ИКТ (ТЖК) или Фамилии'}
              </h3>
              <p className="text-xs text-slate-300">
                {isKz
                  ? 'Өзіңіздің немесе таныстарыңыздың қай университетке грантқа түскенін тез тексеріңіз.'
                  : 'Быстро проверьте, в какой университет и на какую специальность поступил абитуриент.'}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('search')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {isKz ? 'Іздеуге өту' : 'Перейти к поиску'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Key Areas & Information */}
        <div className="space-y-6">
          
          {/* Areas List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Compass className="w-5 h-5 text-teal-600" />
              {isKz ? 'Даярлау бағыттары' : 'Направления подготовки'}
            </h3>

            <div className="space-y-2">
              {meta?.areas.map((area) => (
                <div
                  key={area[0]}
                  onClick={() => setActiveTab('gops')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200/60 hover:border-teal-200 text-xs font-semibold text-slate-700 hover:text-teal-900 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-teal-700 font-bold">{area[0]}</span>
                    <span>{isKz ? area[1] : area[2]}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200/80 text-emerald-950 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {isKz ? 'Грант конкурсы бойынша маңызды' : 'Важная информация о конкурсе'}
            </h4>
            <ul className="text-xs space-y-2 text-emerald-900/90 leading-relaxed">
              <li>• {isKz ? 'Ауыл квотасы (30%), көпбалалы отбасы, мүгедектік сияқты квоталар балл тең болғанда артықшылық береді.' : 'Сельская квота (30%), квота для многодетных семей и инвалидность учитываются при равных баллах.'}</li>
              <li>• {isKz ? 'Халықаралық кампустар (Arizona State, Heriot-Watt, CityU Hong Kong) бойынша арнайы гранттар белгіленген.' : 'В 2026 году выделены целевые гранты в международные филиалы вузов РК.'}</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};