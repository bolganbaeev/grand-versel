import React from 'react';
import { Language } from '../types';
import { GraduationCap, ShieldCheck, Heart, Github } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          
          <div>
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              GRAND РК
            </div>
            <p className="text-slate-400 leading-relaxed">
              {lang === 'kz'
                ? 'Қазақстан Республикасы Мемлекеттік білім беру гранттарының ресми деректер базасы мен талдау жүйесі. ҰБТ талапкерлеріне арналған грант калькуляторы.'
                : 'Официальная база данных и аналитика государственных образовательных грантов Республики Казахстан. Калькулятор шансов для абитуриентов ЕНТ.'}
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">
              {lang === 'kz' ? 'Ақпараттық ресурстар мен дереккөздер' : 'Информационные ресурсы и источники'}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>{lang === 'kz' ? 'ҚР Ғылым және жоғары білім министрлігі (МҒЖБМ)' : 'МНВО Республики Казахстан'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>{lang === 'kz' ? 'Ұлттық тестілеу орталығы (ҰТО / НЦТ)' : 'Национальный центр тестирования (НЦТ)'}</span>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <Github className="w-4 h-4 text-slate-400" />
                <a 
                  href="https://github.com/NuraPernebek/nurnurnurnur" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-teal-400 transition-colors underline decoration-slate-600"
                >
                  {lang === 'kz' ? 'Деректер қоры (Open Data: NuraPernebek/nurnurnurnur)' : 'База данных (Open Data: NuraPernebek/nurnurnurnur)'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">
              {lang === 'kz' ? 'Ескерту' : 'Примечание'}
            </h4>
            <p className="text-slate-400 leading-relaxed">
              {lang === 'kz'
                ? 'Деректер 2024-2025 және 2026-2027 жылдардағы ресми конкурстық нәтижелер негізінде есептелген. Калькулятор нәтижелері ақпараттық-бағдарлау сипатына ие.'
                : 'Данные рассчитаны на основе официальных результатов конкурсов 2024-2025 и 2026-2027 годов. Результаты калькулятора носят ориентировочный характер.'}
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} GRAND РК. {lang === 'kz' ? 'Барлық құқықтар қорғалған.' : 'Все права защищены.'}</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>{lang === 'kz' ? 'Талапкерлерге қолдау көрсету үшін жасалған' : 'Создано в помощь абитуриентам Казахстан'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};