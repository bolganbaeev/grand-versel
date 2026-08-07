import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { GitCompare, TrendingDown, Building2, Award, Sparkles, Globe2, ArrowRight } from 'lucide-react';

interface ComparisonViewProps {
  lang: Language;
  setActiveTab: (tab: string) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  lang,
  setActiveTab,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isKz = lang === 'kz';

  useEffect(() => {
    fetch('/api/stats/comparison')
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          {isKz ? 'Салыстырмалы талдау' : 'Сравнительный анализ'}
        </div>

        <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isKz ? '2024-2025 жж. және 2026-2027 жж. гранттар салыстырмасы' : 'Сравнение кампаний грантов 2024 vs 2026'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          {isKz
            ? 'Мемлекеттік білім беру гранттарының соңғы екі жылдағы бөлінісі, жаңа халықаралық кампустар мен мамандықтар үрдісі.'
            : 'Динамика распределения грантов за два года, новые международные филиалы и изменения трендов высшего образования РК.'}
        </p>
      </div>

      {loading ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">
            {isKz ? 'Салыстырмалы статистика жүктелуде...' : 'Загрузка сравнительной статистики...'}
          </p>
        </div>
      ) : data ? (
        <div className="space-y-8">
          
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 2024 Card */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-display font-extrabold text-lg text-slate-800">
                  2024 - 2025 {isKz ? 'Оқу жылы' : 'Учебный год'}
                </span>
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                  2024
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-xs font-semibold text-slate-500">{isKz ? 'Барлық гранттар' : 'Всего грантов'}:</span>
                  <span className="font-mono font-extrabold text-base text-slate-900">{data.grants2024.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-xs font-semibold text-slate-500">{isKz ? 'ГОП (мамандық) саны' : 'Групп ГОП'}:</span>
                  <span className="font-mono font-extrabold text-base text-slate-900">{data.gopsCount2024}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-xs font-semibold text-slate-500">{isKz ? 'Университеттер' : 'ВУЗов'}:</span>
                  <span className="font-mono font-extrabold text-base text-slate-900">{data.unisCount2024}</span>
                </div>
              </div>
            </div>

            {/* 2026 Card */}
            <div className="p-6 bg-white rounded-2xl border-2 border-teal-500/80 shadow-md space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-display font-extrabold text-lg text-teal-900">
                  2026 - 2027 {isKz ? 'Оқу жылы' : 'Учебный год'}
                </span>
                <span className="font-mono text-xs font-bold bg-teal-500 text-slate-950 px-3 py-1 rounded-full shadow-2xs">
                  2026
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/80">
                  <span className="text-xs font-bold text-teal-800">{isKz ? 'Барлық гранттар' : 'Всего грантов'}:</span>
                  <span className="font-mono font-extrabold text-base text-teal-950">{data.grants2026.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/80">
                  <span className="text-xs font-bold text-teal-800">{isKz ? 'ГОП (мамандық) саны' : 'Групп ГОП'}:</span>
                  <span className="font-mono font-extrabold text-base text-teal-950">{data.gopsCount2026}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/80">
                  <span className="text-xs font-bold text-teal-800">{isKz ? 'Университеттер' : 'ВУЗов'}:</span>
                  <span className="font-mono font-extrabold text-base text-teal-950">{data.unisCount2026}</span>
                </div>
              </div>
            </div>

          </div>

          {/* New International Branches Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-teal-600" />
                {isKz
                  ? '2026 жылы қосылған жаңа халықаралық университет филиалдары'
                  : 'Новые филиалы зарубежных вузов в конкурсе 2026 года'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isKz
                  ? 'Мемлекет басшысының тапсырмасы бойынша Қазақстанда ашылған жетекші шетелдік жоғары оқу орындарының кампустары.'
                  : 'Кампусы ведущих мировых университетов, открытые в Казахстане с целевыми грантами.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.newBranchCampuses2026.map((b: any) => (
                <div
                  key={b.code}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                >
                  <span className="font-mono text-xs font-bold bg-slate-900 text-teal-400 px-2 py-1 rounded shrink-0">
                    {b.code}
                  </span>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {isKz ? b.nameKz : b.nameRu}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {isKz ? 'Халықаралық кампус' : 'Международный кампус'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
};