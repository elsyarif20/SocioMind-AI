
import React, { useState, useMemo } from 'react';
import { View, Language } from './types';
import Home from './views/Home';
import Learn from './views/Learn';
import Quiz from './views/Quiz';
import CaseStudies from './views/CaseStudies';
import DataLab from './views/DataLab';
import Glossary from './views/Glossary';
import Creator from './views/Creator';

export const translations = {
  en: {
    home: "Home",
    learn: "Academy",
    cases: "Cases",
    quiz: "Quiz",
    lab: "Data Lab",
    glossary: "Lexicon",
    creator: "Creator",
    start: "Enter Academy",
    tryLab: "Launch Lab",
    heroTitle: "Sociological Insight",
    heroTitleHighlight: "Powered by AI",
    heroDesc: "Navigate complex social structures from classical theories to modern digital phenomena with precision academic AI.",
    tagline: "NEXT-GEN SOCIOLOGY",
    curriculumTitle: "Academic Pathways",
    lang: "Language"
  },
  id: {
    home: "Beranda",
    learn: "Akademi",
    cases: "Studi Kasus",
    quiz: "Kuis HOTS",
    lab: "Lab Data",
    glossary: "Glosarium",
    creator: "Lab Soal",
    start: "Masuk Akademi",
    tryLab: "Luncurkan Lab",
    heroTitle: "Wawasan Sosiologis",
    heroTitleHighlight: "Berbasis AI",
    heroDesc: "Navigasi struktur sosial kompleks dari teori klasik hingga fenomena digital modern dengan AI akademik presisi.",
    tagline: "Sosiologi Masa Depan",
    curriculumTitle: "Jalur Akademik",
    lang: "Bahasa"
  },
  ar: {
    home: "الرئيسية",
    learn: "الأكاديمية",
    cases: "الحالات",
    quiz: "اختبار",
    lab: "مختبر",
    glossary: "المعجم",
    creator: "المنشئ",
    start: "دخول الأكاديمية",
    tryLab: "إطلاق المختبر",
    heroTitle: "رؤية اجتماعية",
    heroTitleHighlight: "بذكاء اصطناعي",
    heroDesc: "تنقل عبر الهياكل الاجتماعية المعقدة من النظريات الكلاسيكية إلى الظواهر الرقمية الحديثة بدقة الذكاء الاصطناعي الأكاديمي.",
    tagline: "علم الاجتماع القادم",
    curriculumTitle: "المسارات الأكاديمية",
    lang: "اللغة"
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [language, setLanguage] = useState<Language>('id');

  const t = useMemo(() => translations[language], [language]);
  const isRtl = language === 'ar';

  const NavItem = ({ view, label, icon }: { view: View, label: string, icon: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
      }`}
    >
      <span className={`text-lg transition-transform group-hover:scale-125 ${currentView === view ? 'scale-110' : ''}`}>{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-widest hidden xl:block">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Premium Header */}
      <header className="glass fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl border border-white/50 shadow-2xl px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setCurrentView(View.HOME)}
        >
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl font-black group-hover:bg-indigo-600 transition-colors">
            S
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">SocioMind <span className="text-indigo-600">AI</span></h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          <NavItem view={View.HOME} label={t.home} icon="🏠" />
          <NavItem view={View.LEARN} label={t.learn} icon="🎓" />
          <NavItem view={View.CASES} label={t.cases} icon="🔬" />
          <NavItem view={View.QUIZ} label={t.quiz} icon="⚡" />
          <NavItem view={View.LAB} label={t.lab} icon="📊" />
          <NavItem view={View.CREATOR} label={t.creator} icon="🧪" />
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100/50 rounded-full p-1 border border-slate-200">
            {(['en', 'id', 'ar'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${language === l ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {(() => {
          switch (currentView) {
            case View.HOME: return <Home onNavigate={setCurrentView} lang={language} />;
            case View.LEARN: return <Learn lang={language} />;
            case View.QUIZ: return <Quiz lang={language} />;
            case View.CASES: return <CaseStudies lang={language} />;
            case View.LAB: return <DataLab lang={language} />;
            case View.GLOSSARY: return <Glossary lang={language} />;
            case View.CREATOR: return <Creator lang={language} />;
            default: return <Home onNavigate={setCurrentView} lang={language} />;
          }
        })()}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass-dark rounded-2xl shadow-2xl z-50 flex items-center justify-around py-3 px-4 border border-white/10">
        <button onClick={() => setCurrentView(View.HOME)} className={`text-2xl ${currentView === View.HOME ? 'text-indigo-400' : 'text-slate-400'}`}>🏠</button>
        <button onClick={() => setCurrentView(View.LEARN)} className={`text-2xl ${currentView === View.LEARN ? 'text-indigo-400' : 'text-slate-400'}`}>🎓</button>
        <button onClick={() => setCurrentView(View.QUIZ)} className={`text-2xl ${currentView === View.QUIZ ? 'text-indigo-400' : 'text-slate-400'}`}>⚡</button>
        <button onClick={() => setCurrentView(View.CASES)} className={`text-2xl ${currentView === View.CASES ? 'text-indigo-400' : 'text-slate-400'}`}>🔬</button>
        <button onClick={() => setCurrentView(View.CREATOR)} className={`text-2xl ${currentView === View.CREATOR ? 'text-indigo-400' : 'text-slate-400'}`}>🧪</button>
      </nav>
    </div>
  );
};

export default App;
