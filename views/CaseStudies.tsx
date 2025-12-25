
import React, { useState } from 'react';
import { generateCaseStudy } from '../services/gemini';
import { CaseStudy, Language, Subject } from '../types';

interface CaseStudiesProps {
  lang: Language;
  subject: Subject;
}

interface CaseCategory {
  id: string;
  name: Record<Language, string>;
  topics: string[];
}

const CASE_DIRECTORY: CaseCategory[] = [
  {
    id: 'pendidikan',
    name: { id: 'Pendidikan & Sekolah', en: 'Education & Schools', ar: 'التعليم والمدارس' },
    topics: [
      'Kenakalan pelajar SMA Negeri 1 Girimarto', 'Kekerasan fisik SDN Pati', 'Kekerasan seksual oleh kakak kelas',
      'Kekerasan psikis penghinaan intimidasi sekolah', 'Pemerasan SMA Negeri 70 Bulungan', 'Kekerasan senioritas SMU Pangudi Luhur',
      'Kekerasan geng SMA 34 Pondok Labu', 'Pelecehan seksual SMAN 26 Jakarta', 'Perselisihan SMAN 5 & SMAN 4 Makassar',
      'Kekerasan SMK Pelayaran Semarang', 'Kekerasan SD Islam Sudirman (Siswa dilakban)', 'Kekerasan SMP 282 Jakarta (Hukuman PR)',
      'Fenomena Bullying di Sekolah', 'Kasus bunuh diri pelajar tekanan sekolah', 'Penyalahgunaan kekuasaan lembaga pendidikan',
      'Fenomena pergaulan bebas di sekolah', 'Fenomena tawuran pelajar'
    ]
  },
  {
    id: 'hukum',
    name: { id: 'Hukum & Keadilan', en: 'Law & Justice', ar: 'القانون والعدالة' },
    topics: [
      'Kasus Nenek Asyani (Pencurian kayu)', 'Vonis hukum tidak adil kaya vs miskin', 'Kasus korupsi institusi pendidikan',
      'Kasus kolusi nepotisme instansi pemerintah', 'Kasus mafia hukum lembaga penegak hukum', 'Penggelapan pajak oleh pejabat',
      'Praktik jual beli kasus di pengadilan', 'Kasus penggusuran lahan oleh pemerintah', 'Ketidakadilan hukum bagi rakyat kecil'
    ]
  },
  {
    id: 'ekonomi',
    name: { id: 'Ekonomi & Kemiskinan', en: 'Economy & Poverty', ar: 'الاقتصاد الفقر' },
    topics: [
      'Kemiskinan di perkotaan', 'Pengangguran di pedesaan', 'Fenomena urbanisasi Jakarta', 'Migrasi internasional TKI',
      'Pengangguran sarjana', 'Kemiskinan struktural', 'Anak jalanan di Jakarta', 'Tunawisma di Surabaya',
      'Gelandangan di Bandung', 'Pengemis di tempat umum', 'Ketimpangan ekonomi antar daerah'
    ]
  },
  {
    id: 'keluarga',
    name: { id: 'Keluarga & Pernikahan', en: 'Family & Personal', ar: 'الأسرة والحياة الشخصية' },
    topics: [
      'Kasus anak terlantar', 'Pernikahan dini di pedesaan', 'Poligami di masyarakat', 'Perceraian di perkotaan',
      'Single parent di kota besar', 'Kekerasan Dalam Rumah Tangga (KDRT)', 'Kekerasan seksual dalam rumah tangga',
      'Kekerasan terhadap anak', 'Kekerasan terhadap lansia'
    ]
  },
  {
    id: 'pekerja',
    name: { id: 'Pekerja & Profesi', en: 'Workers & Professions', ar: 'العمال والمهن' },
    topics: [
      'Diskriminasi etnis di tempat kerja', 'Ketidaksetaraan gender di tempat kerja', 'Kekerasan terhadap pekerja migran',
      'Kekerasan terhadap PRT (Pekerja Rumah Tangga)', 'Kekerasan terhadap buruh pabrik', 'Kekerasan terhadap nelayan',
      'Kekerasan terhadap pedagang kaki lima', 'Kekerasan terhadap pekerja sektor kreatif', 'Kekerasan terhadap pekerja olahraga'
    ]
  },
  {
    id: 'khusus',
    name: { id: 'Fenomena Khusus', en: 'Specific Phenomena', ar: 'ظواهر خاصة' },
    topics: [
      'Fenomena bunuh diri Desa Ulapato A', 'Konflik mahasiswa Timur di Malang', 'Pelecehan seksual media sosial',
      'Gerakan kampung literasi NTT', 'Reintegrasi sosial mantan narapidana', 'Kekerasan terhadap minoritas',
      'Kekerasan terhadap LGBT', 'Kekerasan terhadap penyandang disabilitas'
    ]
  }
];

const UI_STRINGS = {
  en: {
    title: "Case Analysis Lab",
    desc: "Examine real-world cases and generate academic solutions.",
    loading: "Consulting archives...",
    topicLabel: "Case Subject",
    scenarioLabel: "Analytical Scenario",
    discussionLabel: "Inquiry Questions",
    solutionsLabel: "Proposed Academic Solutions",
    resetBtn: "Select Different Case",
    footerNote: "Analysis and interventions synthesized by AI.",
    selectCategory: "Select Category",
    selectTopic: "Choose a Case Study"
  },
  id: {
    title: "Lab Analisis Kasus",
    desc: "Pelajari studi kasus dunia nyata dan susun solusi akademiknya.",
    loading: "Mengkonsultasikan arsip...",
    topicLabel: "Subjek Kasus",
    scenarioLabel: "Skenario Analitis",
    discussionLabel: "Pertanyaan Diskusi",
    solutionsLabel: "Solusi Akademik yang Diusulkan",
    resetBtn: "Pilih Kasus Lain",
    footerNote: "Analisis dan intervensi disusun secara otomatis oleh AI.",
    selectCategory: "Pilih Kategori",
    selectTopic: "Pilih Studi Kasus"
  },
  ar: {
    title: "مختبر تحليل الحالات",
    desc: "افحص حالات واقعية واستخلص الحلول الأكاديمية.",
    loading: "البحث في الأرشيف...",
    topicLabel: "موضوع الحالة",
    scenarioLabel: "سيناريو التحليل",
    discussionLabel: "أسئلة المناقشة",
    solutionsLabel: "الحلول الأكاديمية المقترحة",
    resetBtn: "اخter حالة أخرى",
    footerNote: "تم تجميع التحليل والحلول بواسطة الذكاء الاصطناعي.",
    selectCategory: "اختر فئة",
    selectTopic: "اختر دراسة حالة"
  }
};

const CaseStudies: React.FC<CaseStudiesProps> = ({ lang, subject }) => {
  const [loading, setLoading] = useState(false);
  const [caseStudy, setCaseStudy] = useState<CaseStudy & { proposedSolutions?: string[] } | null>(null);
  const [topic, setTopic] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const t = UI_STRINGS[lang];
  const isRtl = lang === 'ar';

  const fetchCase = async (selectedTopic: string) => {
    setLoading(true);
    setTopic(selectedTopic);
    try {
      // Fix: Added missing subject argument
      const data = await generateCaseStudy(selectedTopic, lang, subject);
      setCaseStudy(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-10 max-w-5xl mx-auto animate-in fade-in duration-500 ${isRtl ? 'text-right' : 'text-left'}`}>
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t.title}</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">{t.desc}</p>
      </header>

      {!caseStudy && !loading && (
        <div className="space-y-8">
          {/* Category Selector */}
          <div className="flex flex-wrap justify-center gap-3">
            {CASE_DIRECTORY.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                }`}
              >
                {cat.name[lang]}
              </button>
            ))}
          </div>

          {activeCategory ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-300">
              {CASE_DIRECTORY.find(c => c.id === activeCategory)?.topics.map(topicName => (
                <button
                  key={topicName}
                  onClick={() => fetchCase(topicName)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all text-left flex flex-col justify-between group"
                >
                  <span className="text-slate-800 font-bold text-sm leading-snug mb-3 group-hover:text-indigo-700">{topicName}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:translate-x-1 transition-transform">Analisis Kasus →</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center">
              <div className="text-8xl mb-6 grayscale opacity-20">🔎</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest">{t.selectCategory}</p>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl"></div>
          <p className="text-slate-500 font-serif italic text-xl animate-pulse">{t.loading}</p>
        </div>
      )}

      {caseStudy && !loading && (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
          <button 
            onClick={() => { setCaseStudy(null); setTopic(''); }}
            className={`flex items-center gap-2 text-indigo-600 font-bold hover:translate-x-1 transition-transform ${isRtl ? 'flex-row-reverse -translate-x-1' : ''}`}
          >
            <span className={`w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center ${isRtl ? '' : 'rotate-180'}`}>➔</span> {t.resetBtn}
          </button>

          <article className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden ring-1 ring-slate-200">
            <div className="bg-indigo-900 p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <span className="bg-indigo-500/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-400/30">
                 {t.topicLabel}: {topic}
               </span>
               <h3 className="text-4xl font-black mt-6 tracking-tight leading-tight">{caseStudy.title}</h3>
            </div>

            <div className="p-10 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">📄</div>
                   <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{t.scenarioLabel}</h4>
                </div>
                <div className="textbook-content text-slate-700 text-lg leading-relaxed bg-slate-50 p-8 rounded-3xl border border-slate-100 italic shadow-inner">
                  {caseStudy.scenario}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Discussion Questions */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl">❓</div>
                      <h4 className="text-xl font-bold text-slate-800">{t.discussionLabel}</h4>
                   </div>
                   <div className="space-y-3">
                      {caseStudy.analysisQuestions.map((q, i) => (
                        <div key={i} className={`flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                          <span className="text-indigo-600 font-black text-lg">0{i+1}</span>
                          <p className="font-medium text-slate-700">{q}</p>
                        </div>
                      ))}
                   </div>
                </section>

                {/* Proposed Solutions */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">💡</div>
                      <h4 className="text-xl font-bold text-slate-800">{t.solutionsLabel}</h4>
                   </div>
                   <div className="space-y-3">
                      {caseStudy.proposedSolutions?.map((s, i) => (
                        <div key={i} className={`flex gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                          <span className="text-emerald-600 font-black text-lg">✓</span>
                          <p className="font-semibold text-emerald-900 text-sm leading-relaxed">{s}</p>
                        </div>
                      ))}
                   </div>
                </section>
              </div>

              <footer className={`pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs italic ${isRtl ? 'flex-row-reverse' : ''}`}>
                 <span>{t.footerNote}</span>
                 <span className="font-bold opacity-50">Academic Intelligence</span>
              </footer>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default CaseStudies;
