import React, { useEffect, useState } from 'react';
import { Language, Year } from '../types';
import { 
  Building2, 
  X, 
  Award, 
  BookOpen, 
  MapPin, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface UniversityDetailModalProps {
  uniCode: string;
  lang: Language;
  year: Year;
  onClose: () => void;
  onSelectGop: (code: string) => void;
  setActiveTab: (tab: string) => void;
}

interface UniversityData {
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
  gopsCount: number;
  gopsList: {
    gopCode: string;
    gopNameKz: string;
    gopNameRu: string;
    areaCode: string;
    grantsCount: number;
    minScore: number;
    maxScore: number;
    avgScore: number;
  }[];
  topRecipients: {
    untId: string;
    fullName: string;
    score: number;
    gopCode: string;
    gopNameKz: string;
    gopNameRu: string;
    q1: number;
    q2: number;
    spec: number;
  }[];
}

export const UniversityDetailModal: React.FC<UniversityDetailModalProps> = ({
  uniCode,
  lang,
  year,
  onClose,
  onSelectGop,
  setActiveTab,
}) => {
  const [data, setData] = useState<UniversityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabInternal] = useState<'gops' | 'students'>('gops');

  const isKz = lang === 'kz';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/uni/${uniCode}?year=${year}`)
      .then((res) => res.json())
      .then((resData) => {
        if (isMounted) {
          setData(resData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching uni details:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [uniCode, year]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white flex items-start justify-between gap-4 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-extrabold bg-teal-500 text-slate-950 px-2.5 py-0.5 rounded-md shadow-xs">
                {uniCode}
              </span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <MapPin className="w-3 h-3 text-teal-400" />
                {data ? (isKz ? data.regNameKz : data.regNameRu) : '—'}
              </span>
              {uniCode.startsWith('90') && (
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  🌍 {isKz ? 'Халықаралық Филиал 2026' : 'Международный Филиал 2026'}
                </span>
              )}
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug">
              {data ? (isKz ? data.nameKz : data.nameRu) : (isKz ? 'Университет жүктелуде...' : 'Загрузка ВУЗа...')}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin mb-3" />
            <p className="text-xs text-slate-500 font-medium">
              {isKz ? 'Университет паспорты жүктелуде...' : 'Загрузка паспорта ВУЗа...'}
            </p>
          </div>
        ) : !data ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            {isKz ? 'Деректер табылмады.' : 'Данные не найдены.'}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="text-[11px] font-medium text-slate-500 mb-1">
                  {isKz ? 'Бөлінген Гранттар' : 'Выделено Грантов'}
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900">
                  {data.totalGrants.toLocaleString()}
                </div>
                <div className="text-[11px] text-teal-700 font-bold mt-0.5">
                  {data.gopsCount} {isKz ? 'мамандық бойынша' : 'специальностей'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="text-[11px] font-medium text-slate-500 mb-1">
                  {isKz ? 'Орташа ҰБТ Балл' : 'Средний Балл ЕНТ'}
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-teal-700">
                  {data.avgScore}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isKz ? 'Түскен грант иегерлері' : 'Зачисленных абитуриентов'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="text-[11px] font-medium text-slate-500 mb-1">
                  {isKz ? 'Ең Жоғары Балл' : 'Максимальный Балл'}
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-700">
                  {data.maxScore}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isKz ? 'Үздік балл' : 'Топ балл'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="text-[11px] font-medium text-slate-500 mb-1">
                  {isKz ? 'Минималды Өту Баллы' : 'Мин. Проходной Балл'}
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-amber-700">
                  {data.minScore}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isKz ? 'Шекті деңгей' : 'Пороговый уровень'}
                </div>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTabInternal('gops')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'gops'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {isKz ? `ГОП және Мамандықтар (${data.gopsList.length})` : `ГОП и Специальности (${data.gopsList.length})`}
              </button>

              <button
                onClick={() => setActiveTabInternal('students')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'students'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                {isKz ? 'Үздік Грант Иегерлері' : 'Топ Обладатели Грантов'}
              </button>
            </div>

            {/* Tab 1: GOPs List */}
            {activeTab === 'gops' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{isKz ? 'Осы университетте оқытылатын бағыттар:' : 'Направления подготовки в этом ВУЗе:'}</span>
                  <span className="font-semibold text-slate-700">{data.gopsList.length} {isKz ? 'ГОП' : 'ГОП'}</span>
                </div>

                <div className="space-y-2">
                  {data.gopsList.map((gop) => (
                    <div
                      key={gop.gopCode}
                      onClick={() => {
                        onClose();
                        onSelectGop(gop.gopCode);
                      }}
                      className="p-3.5 rounded-xl border border-slate-200/80 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                            {gop.gopCode}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 uppercase">
                            {gop.areaCode}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-teal-900 truncate">
                          {isKz ? gop.gopNameKz : gop.gopNameRu}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right text-xs">
                          <div className="font-mono font-bold text-slate-900">
                            {gop.grantsCount.toLocaleString()} {isKz ? 'грант' : 'грантов'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isKz ? 'Өту балы:' : 'Мин:'} <span className="font-mono font-bold text-amber-700">{gop.minScore}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Top Recipients */}
            {activeTab === 'students' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500">
                  {isKz 
                    ? 'Осы университетке грантпен түскен балы ең жоғары студенттер (алғашқы 30):' 
                    : 'Студенты с наибольшими баллами ЕНТ, поступившие в этот ВУЗ (топ-30):'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">ТЖК (ТК)</th>
                        <th className="py-2.5 px-3">{isKz ? 'Аты-жөні' : 'ФИО'}</th>
                        <th className="py-2.5 px-3 text-center">{isKz ? 'ҰБТ Баллы' : 'Балл ЕНТ'}</th>
                        <th className="py-2.5 px-3">{isKz ? 'Мамандық (ГОП)' : 'ГОП'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {data.topRecipients.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500 font-semibold">{rec.untId}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{rec.fullName}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-extrabold text-teal-700 bg-teal-50/50">
                            {rec.score}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-1">
                              {rec.gopCode}
                            </span>
                            <span className="text-slate-600">{isKz ? rec.gopNameKz : rec.gopNameRu}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>GRAND Grants Portal • {year}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {isKz ? 'Жабу' : 'Закрыть'}
          </button>
        </div>

      </div>
    </div>
  );
};
