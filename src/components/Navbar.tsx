import React from 'react';
import { Language, Year } from '../types';
import { 
  GraduationCap, 
  Calculator, 
  BookOpen, 
  Building2, 
  Search, 
  GitCompare, 
  Globe, 
  Calendar,
  BarChart3
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  year: Year;
  setYear: (year: Year) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  year,
  setYear,
  activeTab,
  setActiveTab,
}) => {
  const t = {
    title: lang === 'kz' ? 'GRAND' : 'GRAND',
    subtitle: lang === 'kz' ? 'Мемлекеттік Бiлiм Гранттары Порталы' : 'Портал Государственных Гранов РК',
    dashboard: lang === 'kz' ? 'Басты бет' : 'Главная',
    analytics: lang === 'kz' ? 'Аналитика' : 'Аналитика',
    calculator: lang === 'kz' ? 'Калькулятор' : 'Калькулятор',
    gops: lang === 'kz' ? 'Мамандықтар (БББТ)' : 'Специальности (ГОП)',
    unis: lang === 'kz' ? 'Университеттер' : 'ВУЗы',
    search: lang === 'kz' ? 'Грант иегерін іздеу' : 'Поиск грантника',
    comparison: lang === 'kz' ? '2024 vs 2026' : 'Сравнение 2024-2026',
  };

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: GraduationCap },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
    { id: 'calculator', label: t.calculator, icon: Calculator },
    { id: 'gops', label: t.gops, icon: BookOpen },
    { id: 'unis', label: t.unis, icon: Building2 },
    { id: 'search', label: t.search, icon: Search },
    { id: 'comparison', label: t.comparison, icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight">GRAND</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full border border-teal-200">
                  {year}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Right Controls: Year Switcher & Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Year Campaign Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                onClick={() => setYear('2026')}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg transition-all text-xs ${
                  year === '2026'
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600" />
                <span className="sm:hidden">2026</span>
                <span className="hidden sm:inline">2026-2027</span>
              </button>
              <button
                onClick={() => setYear('2024')}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg transition-all text-xs ${
                  year === '2024'
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="sm:hidden">2024</span>
                <span className="hidden sm:inline">2024-2025</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                onClick={() => setLang('kz')}
                className={`px-2 py-1 rounded-lg transition-all text-xs ${
                  lang === 'kz'
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ҚАЗ
              </button>
              <button
                onClick={() => setLang('ru')}
                className={`px-2 py-1 rounded-lg transition-all text-xs ${
                  lang === 'ru'
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                РУС
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 w-full max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};