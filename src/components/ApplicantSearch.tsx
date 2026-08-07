import React, { useState, useEffect } from 'react';
import { ApplicantSearchResult, Language, Year } from '../types';
import { Search, UserCheck, ShieldCheck, GraduationCap, Building2, ArrowRight, Sparkles } from 'lucide-react';

interface ApplicantSearchProps {
  lang: Language;
  year: Year;
  onSelectGop: (code: string) => void;
  setActiveTab: (tab: string) => void;
}

export const ApplicantSearch: React.FC<ApplicantSearchProps> = ({
  lang,
  year,
  onSelectGop,
  setActiveTab,
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ApplicantSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const isKz = lang === 'kz';

  // Real-time debounced search
  useEffect(() => {
    const q = query.trim();
    if (!q || q.length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/applicant?q=${encodeURIComponent(q)}&year=${year}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Real-time search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, year]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || q.length < 2) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search/applicant?q=${encodeURIComponent(q)}&year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-8 text-white shadow-lg space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            {isKz ? 'Ресми конкурс деректер қоры' : 'Официальная база данных конкурса'}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {isKz ? '⚡ Нақты уақытты іздеу (Real-time)' : '⚡ Живой поиск (Real-time)'}
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isKz ? 'Грант иегерін ТЖК (ИКТ) немесе тегі бойынша іздеу' : 'Поиск грантников по ИКТ (ТЖК) или ФИО'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          {isKz
            ? 'ТЖК (ИКТ) кодын немесе талапкердің тегін енгізіп, мемлекеттік білім беру грантын иеленген университет пен мамандықты тексеріңіз.'
            : 'Введите ИКТ (ТЖК) код или фамилию абитуриента для проверки выигранного государственного гранта и университета.'}
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder={isKz ? 'Мысалы: 002925453 немесе Абдрахманов' : 'Например: 002925453 или Абдрахманов'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-sm focus:border-teal-400 focus:outline-hidden placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                {isKz ? 'Іздеу' : 'Искать'}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">
            {isKz ? 'Грант иегерлері базасынан ізделуде...' : 'Поиск в базе данных грантников...'}
          </p>
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              {isKz
                ? `Табылған нәтижелер саны: ${results.length}`
                : `Найдено записей: ${results.length}`}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {results.map((r, idx) => (
                <div
                  key={`${r.untId}-${idx}`}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-teal-400/80 shadow-2xs space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                          ТЖК: {r.untId}
                        </span>
                        {r.quotaFlag1 === 1 || r.specialQuota > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            Квота
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                        {r.fullName}
                      </h3>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-[11px] text-slate-400 font-bold uppercase">{isKz ? 'ҰБТ балы' : 'Балл ЕНТ'}</div>
                      <div className="text-2xl font-mono font-extrabold text-teal-700">{r.score}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-teal-600" />
                        <span>{isKz ? 'Мамандық (БББТ):' : 'ГОП спеціальность:'}</span>
                      </div>
                      <div className="font-bold text-slate-800">
                        {r.gopCode} - {isKz ? r.gopNameKz : r.gopNameRu}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-semibold text-slate-400 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-teal-600" />
                        <span>{isKz ? 'Иеленген университеті:' : 'Выигранный ВУЗ:'}</span>
                      </div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs px-2 py-0.5 bg-teal-100 text-teal-900 border border-teal-200 rounded-md font-extrabold">
                          {r.uniCode}
                        </span>
                        <span>{isKz ? r.uniNameKz : r.uniNameRu}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onSelectGop(r.gopCode);
                        setActiveTab('gops');
                      }}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200/80"
                    >
                      <span>{isKz ? 'Бұл мамандықтың барлық баллдарын көру' : 'Посмотреть баллы этой специальности'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-base text-slate-700">
              {isKz ? 'Грант иегері табылмады' : 'Запись не найдена'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isKz
                ? 'Деректер қорынан сәйкестік табылмады. Енгізілген ТЖК немесе аты-жөнін қайта тексеріп көріңіз.'
                : 'По вашему запросу совпадений не найдено. Проверьте правильность ввода ИКТ или ФИО.'}
            </p>
          </div>
        )
      ) : null}

    </div>
  );
};