import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { AnalyticsView } from './components/AnalyticsView';
import { Calculator } from './components/Calculator';
import { GopList } from './components/GopList';
import { UniversityList } from './components/UniversityList';
import { ApplicantSearch } from './components/ApplicantSearch';
import { ComparisonView } from './components/ComparisonView';
import { Language, MetaData, Year } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('kz');
  const [year, setYear] = useState<Year>('2026');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedGopCode, setSelectedGopCode] = useState<string | null>(null);

  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loadingMeta, setLoadingMeta] = useState<boolean>(true);

  useEffect(() => {
    setLoadingMeta(true);
    fetch(`/api/meta?year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setMeta(data);
      })
      .catch((err) => console.error('Failed to load metadata:', err))
      .finally(() => setLoadingMeta(false));
  }, [year]);

  const handleSelectGop = (gopCode: string) => {
    setSelectedGopCode(gopCode);
    setActiveTab('gops');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        year={year}
        setYear={setYear}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-12 overflow-x-hidden">
        {loadingMeta && !meta ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              {lang === 'kz' ? 'Гранттар порталының деректер қоры жүктелуде...' : 'Загрузка базы данных портала грантов...'}
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                lang={lang}
                year={year}
                meta={meta}
                setActiveTab={setActiveTab}
                onSelectGop={handleSelectGop}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                lang={lang}
                year={year}
              />
            )}

            {activeTab === 'calculator' && (
              <Calculator
                lang={lang}
                year={year}
                meta={meta}
                onSelectGop={handleSelectGop}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'gops' && (
              <GopList
                lang={lang}
                year={year}
                meta={meta}
                selectedGopCode={selectedGopCode}
                onSelectGopCode={setSelectedGopCode}
              />
            )}

            {activeTab === 'unis' && (
              <UniversityList
                lang={lang}
                year={year}
                meta={meta}
                onSelectGop={handleSelectGop}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'search' && (
              <ApplicantSearch
                lang={lang}
                year={year}
                onSelectGop={handleSelectGop}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'comparison' && (
              <ComparisonView
                lang={lang}
                setActiveTab={setActiveTab}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer lang={lang} />

    </div>
  );
}