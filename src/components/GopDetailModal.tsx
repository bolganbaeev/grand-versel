import React, { useEffect, useState } from 'react';
import { GopDetail, Language, Year } from '../types';
import { X, Search, Award, Building2, UserCheck, ShieldCheck, ArrowUpDown } from 'lucide-react';

interface GopDetailModalProps {
  gopCode: string | null;
  year: Year;
  lang: Language;
  onClose: () => void;
}

export const GopDetailModal: React.FC<GopDetailModalProps> = ({
  gopCode,
  year,
  lang,
  onClose,
}) => {
  const [data, setData] = useState<GopDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchRecipient, setSearchRecipient] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'unis' | 'recipients'>('unis');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const isKz = lang === 'kz';

  useEffect(() => {
    if (!gopCode) return;
    setLoading(true);
    fetch(`/api/gop/${encodeURIComponent(gopCode)}?year=${year}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [gopCode, year]);

  if (!gopCode) return null;

  const filteredRecipients = data?.recipients.filter((r) => {
    const q = searchRecipient.toLowerCase().trim();
    if (!q) return true;
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.untId.includes(q) ||
      r.uniNameKz.toLowerCase().includes(q) ||
      r.uniNameRu.toLowerCase().includes(q)
    );
  }) || [];

  if (sortAsc) {
    filteredRecipients.sort((a, b) => a.score - b.score);
  } else {
    filteredRecipients.sort((a, b) => b.score - a.score);
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-teal-500 text-slate-950 px-2.5 py-0.5 rounded-md">
                {gopCode}
              </span>
              <span className="text-xs text-slate-400">
                {isKz ? `${year}-${Number(year) + 1} оқу жылы` : `Учебный год ${year}`}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold mt-2">
              {loading ? (isKz ? 'Жүктелуде...' : 'Загрузка...') : isKz ? data?.nameKz : data?.nameRu}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium text-slate-500">
              {isKz ? 'Деректер жүктелуде...' : 'Загрузка данных по ГОП...'}
            </p>
          </div>
        ) : data ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Stats KPI Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80">
                <div className="text-[11px] font-bold text-teal-800 uppercase">
                  {isKz ? 'Барлық гранттар' : 'Всего грантов'}
                </div>
                <div className="text-xl font-bold font-mono text-teal-950 mt-1">
                  {data.totalRecipients.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  {isKz ? 'Мин. өту балы' : 'Мин. проходной'}
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {data.minScore}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80">
                <div className="text-[11px] font-bold text-indigo-800 uppercase">
                  {isKz ? 'Орташа балл' : 'Средний балл'}
                </div>
                <div className="text-xl font-bold font-mono text-indigo-950 mt-1">
                  {data.avgScore}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  {isKz ? 'Макс. балл' : 'Макс. балл'}
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {data.maxScore}
                </div>
              </div>
            </div>

            {/* Toggle Tabs: Universities vs Recipients */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('unis')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'unis'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {isKz ? 'ЖОО бөлінісі' : 'Распределение по ВУЗам'} ({data.uniBreakdown.length})
              </button>

              <button
                onClick={() => setActiveTab('recipients')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'recipients'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                {isKz ? 'Грант иегерлерінің тізімі' : 'Список обладателей гранта'} ({data.recipients.length})
              </button>
            </div>

            {/* Tab 1: Universities Breakdown */}
            {activeTab === 'unis' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.uniBreakdown.map((uni) => (
                    <div
                      key={uni.uniCode}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {uni.uniCode}
                        </span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          {uni.count} {isKz ? 'грант' : 'грантов'}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                        {isKz ? uni.uniNameKz : uni.uniNameRu}
                      </h4>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{isKz ? 'Мин. балл:' : 'Мин. балл:'} <strong className="text-slate-800 font-mono">{uni.minScore}</strong></span>
                        <span>{isKz ? 'Орташа:' : 'Средний:'} <strong className="text-slate-800 font-mono">{uni.avgScore}</strong></span>
                        <span>{isKz ? 'Макс.:' : 'Макс.:'} <strong className="text-slate-800 font-mono">{uni.maxScore}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Recipients List */}
            {activeTab === 'recipients' && (
              <div className="space-y-4">
                
                {/* Search & SortBar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder={isKz ? 'Аты-жөні немесе ТЖК арқылы іздеу...' : 'Поиск по ФИО или ИКТ...'}
                      value={searchRecipient}
                      onChange={(e) => setSearchRecipient(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    onClick={() => setSortAsc(!sortAsc)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer shrink-0"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {sortAsc ? (isKz ? 'Балл: өсу ретімен' : 'Баллы: по возрастанию') : (isKz ? 'Балл: кему ретімен' : 'Баллы: по убыванию')}
                  </button>
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-3">ТЖК (ИКТ)</th>
                          <th className="p-3">{isKz ? 'Аты-жөні' : 'ФИО'}</th>
                          <th className="p-3 text-center">{isKz ? 'Балл' : 'Балл'}</th>
                          <th className="p-3">{isKz ? 'Университет' : 'ВУЗ'}</th>
                          <th className="p-3 text-center">{isKz ? 'Квота' : 'Квота'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {filteredRecipients.slice(0, 150).map((r) => (
                          <tr key={r.untId} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-600">{r.untId}</td>
                            <td className="p-3 font-semibold text-slate-900">{r.fullName}</td>
                            <td className="p-3 text-center">
                              <span className="font-mono font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                                {r.score}
                              </span>
                            </td>
                            <td className="p-3 text-slate-800 font-semibold leading-normal min-w-[220px]">
                              <span className="inline-block px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono font-bold text-teal-800 mr-1.5">
                                {r.uniCode}
                              </span>
                              <span>{isKz ? r.uniNameKz : r.uniNameRu}</span>
                            </td>
                            <td className="p-3 text-center">
                              {r.quotaFlag1 === 1 || r.specialQuota > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                  <ShieldCheck className="w-3 h-3" />
                                  Квота
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            {isKz ? 'Деректер табылған жоқ.' : 'Данные не найдены.'}
          </div>
        )}

      </div>
    </div>
  );
};