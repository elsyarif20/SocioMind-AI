
import React, { useState, useMemo, useEffect } from 'react';
import { View, Language, Subject } from './types';
import Home from './views/Home';
import Learn from './views/Learn';
import Quiz from './views/Quiz';
import CaseStudies from './views/CaseStudies';
import DataLab from './views/DataLab';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

export const translations = {
  en: {
    home: "Home", learn: "Academy", cases: "Cases", quiz: "Quiz", lab: "Analysis Lab",
    creator: "Creator", start: "Enter Academy", heroTitle: "Smart Learning",
    heroTitleHighlight: "Powered by AI", tagline: "FUTURE EDUCATION", curriculumTitle: "Pathways",
    unlock: "Unlock Academic Power", unlockDesc: "Select a paid API Key to access high-level Gemini 3 Pro reasoning.",
    switchKey: "Switch Key",
    demoMode: "Demo Mode (Offline)",
    enterDemo: "Explore Demo Mode"
  },
  id: {
    home: "Beranda", learn: "Akademi", cases: "Studi Kasus", quiz: "Kuis HOTS", lab: "Lab Analisis",
    creator: "Lab Soal", start: "Masuk Akademi", heroTitle: "Wawasan Pintar",
    heroTitleHighlight: "Berbasis AI", tagline: "EDUKASI MASA DEPAN", curriculumTitle: "Jalur Belajar",
    unlock: "Buka Kekuatan Akademik", unlockDesc: "Pilih Kunci API berbayar untuk mengakses penalaran tingkat tinggi Gemini 3 Pro.",
    switchKey: "Ganti Kunci",
    demoMode: "Mode Demo (Terbatas)",
    enterDemo: "Jelajahi Mode Demo"
  },
  ar: {
    home: "الرئيسية", learn: "الأكاديمية", cases: "الحالات", quiz: "اختبار", lab: "المختبر",
    creator: "المنشئ", start: "دخول الأكاديمية", heroTitle: "تعلم ذكي",
    heroTitleHighlight: "بذكاء اصطناعي", tagline: "تعليم المستقبل", curriculumTitle: "المسارات",
    unlock: "فتح القدرة الأكاديمية", unlockDesc: "اختر مفتاح API مدفوعًا للوصول إلى تفكير Gemini 3 Pro عالي المستوى.",
    switchKey: "تبديل المفتاح",
    demoMode: "وضع التجربة",
    enterDemo: "استكشاف وضع التجربة"
  }
};

const SUBJECT_CONFIG: Record<Subject, { name: string, color: string, icon: string }> = {
  sociology: { name: 'Sosiologi', color: 'indigo', icon: '🏛️' },
  history: { name: 'Sejarah', color: 'rose', icon: '📜' },
  economics: { name: 'Ekonomi', color: 'blue', icon: '📈' },
  biology: { name: 'Biologi', color: 'emerald', icon: '🌿' }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [language, setLanguage] = useState<Language>('id');
  const [subject, setSubject] = useState<Subject>('sociology');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } catch (e) {
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
    setIsDemo(false);
  };

  const handleEnterDemo = () => {
    setIsDemo(true);
    setHasApiKey(true); // Bypass login screen
  };

  const t = useMemo(() => translations[language], [language]);
  const s = SUBJECT_CONFIG[subject];

  const NavItem = ({ view, label, icon }: { view: View, label: string, icon: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
        currentView === view 
          ? `bg-${s.color}-600 text-white shadow-lg shadow-${s.color}-200` 
          : `text-slate-500 hover:text-${s.color}-600 hover:bg-${s.color}-50`
      }`}
    >
      <span className={`text-lg transition-transform group-hover:scale-125 ${currentView === view ? 'scale-110' : ''}`}>{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-widest hidden xl:block">{label}</span>
    </button>
  );

  if (hasApiKey === false && !isDemo) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-2xl animate-bounce">🔑</div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tighter">{t.unlock}</h1>
            <p className="text-slate-400 font-medium leading-relaxed">{t.unlockDesc}</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={handleSelectKey}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-500 transition-all shadow-xl active:scale-95"
            >
              Select API Key
            </button>
            <button 
              onClick={handleEnterDemo}
              className="w-full bg-slate-800 text-indigo-300 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-700 transition-all border border-indigo-500/30"
            >
              {t.enterDemo}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Learn more at <a href="https://ai.google.dev/gemini-api/docs/billing" className="underline hover:text-indigo-400" target="_blank" rel="noopener noreferrer">ai.google.dev/billing</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="glass fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-7xl rounded-2xl border border-white/50 shadow-2xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView(View.HOME)}>
          <div className={`w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl font-black group-hover:bg-${s.color}-600 transition-colors`}>
            {s.icon[0]}
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">
            {s.name} <span className={`text-${s.color}-600`}>AI</span>
            {isDemo && <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] rounded uppercase">Demo</span>}
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          <NavItem view={View.HOME} label={t.home} icon="🏠" />
          <NavItem view={View.LEARN} label={t.learn} icon="🎓" />
          <NavItem view={View.CASES} label={t.cases} icon="🔬" />
          <NavItem view={View.QUIZ} label={t.quiz} icon="⚡" />
          <NavItem view={View.LAB} label={t.lab} icon="📊" />
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSelectKey}
            className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg transition-all border border-slate-200"
            title={t.switchKey}
          >
            <span className="text-sm">🔑</span>
            <span className="text-[10px] font-black uppercase tracking-tight">{t.switchKey}</span>
          </button>

          <select 
            value={subject} 
            onChange={(e) => setSubject(e.target.value as Subject)}
            className="bg-slate-100 border-none rounded-lg px-2 py-1 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.keys(SUBJECT_CONFIG).map(sk => <option key={sk} value={sk}>{SUBJECT_CONFIG[sk as Subject].name}</option>)}
          </select>
          <div className="flex items-center bg-slate-100/50 rounded-full p-1 border border-slate-200">
            {(['en', 'id', 'ar'] as Language[]).map((l) => (
              <button key={l} onClick={() => setLanguage(l)} className={`px-2 py-1 text-[10px] font-black rounded-full transition-all ${language === l ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {isDemo && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-medium flex items-center gap-3 animate-pulse">
            <span>⚠️</span>
            <span>Anda sedang dalam <strong>Mode Demo</strong>. Aktifkan API Key untuk fitur AI yang lebih cerdas dan respons real-time.</span>
          </div>
        )}
        {(() => {
          switch (currentView) {
            case View.HOME: return <Home onNavigate={setCurrentView} lang={language} subject={subject} />;
            case View.LEARN: return <Learn lang={language} subject={subject} />;
            case View.QUIZ: return <Quiz lang={language} subject={subject} />;
            case View.CASES: return <CaseStudies lang={language} subject={subject} />;
            case View.LAB: return <DataLab lang={language} subject={subject} />;
            default: return <Home onNavigate={setCurrentView} lang={language} subject={subject} />;
          }
        })()}
      </main>
    </div>
  );
};

export default App;
