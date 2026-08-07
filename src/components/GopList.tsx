import React, { useState, useMemo } from 'react';
import { GopDetailModal } from './GopDetailModal';
import { Language, MetaData, Year } from '../types';
import { Search, Filter, BookOpen, ChevronRight, Award, Layers, ArrowUpDown } from 'lucide-react';

interface GopListProps {
  lang: Language;
  year: Year;
  meta: MetaData | null;
  selectedGopCode?: string | null;
  onSelectGopCode?: (code: string | null) => void;
}

export const GopList: React.FC<GopListProps> = ({
  lang,
  year,
  meta,
  selectedGopCode,
  onSelectGopCode,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'grants' | 'code'>('grants');
  const [activeModalGop, setActiveModalGop] = useState<string | null>(selectedGopCode || null);

  const isKz = lang === 'kz';

  // Filter & Sort GOP list
  const gopItems = useMemo(() => {
    if (!meta) return [];

    let list = meta.gops.map((g, idx) => ({
      code: g[0],
      nameKz: g[1],
      nameRu: g[2],
      areaCode: g[3],
      grantsCount: meta.cgop[idx] || 0,
    }));

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.code.toLowerCase().includes(q) ||
          g.nameKz.toLowerCase().includes(q) ||
          g.nameRu.toLowerCase().includes(q)
      );
    }

    if (selectedArea !== 'all') {
      list = list.filter((g) => g.areaCode === selectedArea);
    }

    if (sortBy === 'grants') {
      list.sort((a, b) => b.grantsCount - a.grantsCount);
    } else {
      list.sort((a, b) => a.code.localeCompare(b.code));
    }

    return list;
  }, [meta, searchTerm, selectedArea, sortBy]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-teal-600" />
            {isKz ? 'Білім беру бағдарламаларының топтары (БББТ)' : 'Группы образовательных программ (ГОП)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isKz
              ? 'Қазақстанның мемлекеттік гранттар конкурсына қатысатын барлық мамандық топтары, бөлінген грант саны мен өту баллдары.'
              : 'Каталог всех групп образовательных программ конкурса грантов РК, проходные баллы и распределение по ВУЗам.'}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={isKz ? 'БББТ коды немесе атауы бойынша іздеу...' : 'Поиск по коду или названию ГОП...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:outline-hidden bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Area Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="all">{isKz ? 'Барлық бағыттар' : 'Все направления'}</option>
              {meta?.areas.map((a) => (
                <option key={a[0]} value={a[0]}>
                  {a[0]} - {isKz ? a[1] : a[2]}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="grants">{isKz ? 'Грант саны бойынша (кему)' : 'По количеству грантов'}</option>
              <option value="code">{isKz ? 'Коды бойынша (А-Я)' : 'По коду ГОП'}</option>
            </select>
          </div>

        </div>
      </div>

      {/* GOP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gopItems.map((gop) => (
          <div
            key={gop.code}
            onClick={() => {
              setActiveModalGop(gop.code);
              if (onSelectGopCode) onSelectGopCode(gop.code);
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400/80 hover:bg-teal-50/20 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-teal-400">
                  {gop.code}
                </span>

                <span className="text-xs font-bold text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {gop.grantsCount.toLocaleString()} {isKz ? 'грант' : 'грантов'}
                </span>
              </div>

              <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-teal-900 leading-snug line-clamp-2">
                {isKz ? gop.nameKz : gop.nameRu}
              </h3>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-teal-700 font-semibold">
              <span className="font-mono text-[11px] text-slate-500">
                {isKz ? 'Бағыты' : 'Область'}: {gop.areaCode}
              </span>

              <div className="flex items-center gap-1">
                <span>{isKz ? 'Баллдарды көру' : 'Подробнее'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {activeModalGop && (
        <GopDetailModal
          gopCode={activeModalGop}
          year={year}
          lang={lang}
          onClose={() => {
            setActiveModalGop(null);
            if (onSelectGopCode) onSelectGopCode(null);
          }}
        />
      )}

    </div>
  );
};