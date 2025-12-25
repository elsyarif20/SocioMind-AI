
import React, { useState } from 'react';
import { explainConcept } from '../services/gemini';
import { Language } from '../types';
import ReactMarkdown from 'react-markdown';

interface SubTopic {
  id: string;
  title: Record<Language, string>;
}

interface Category {
  id: string;
  title: Record<Language, string>;
  topics: SubTopic[];
}

interface LearnProps {
  lang: Language;
}

const CURRICULUM: Category[] = [
  {
    id: 'sosiologi_islam',
    title: { id: 'Perspektif Klasik & Sosiologi Islam', en: 'Classical Perspectives & Islamic Sociology', ar: 'الآفاق الكلاسيكية وعلم الاجتماع الإسلامي' },
    topics: [
      { id: 'ibnu_khaldun_asabiyah', title: { id: 'Ibnu Khaldun: Teori Asabiyah & Integrasi Sosial', en: 'Ibn Khaldun: Asabiyyah Theory & Social Integration', ar: 'ابن خلدون: نظرية العصبية والاندماج الاجتماعي' } },
      { id: 'khaldun_civilization', title: { id: 'Ibnu Khaldun: Siklus Peradaban & Umran', en: 'Ibn Khaldun: Cycle of Civilization & Umran', ar: 'ابن خلدون: دورة الحضارة والعمران' } },
      { id: 'badawah_hadharah', title: { id: 'Masyarakat Badawah vs Hadharah (Nomaden vs Menetap)', en: 'Badawah vs Hadharah Societies (Nomadic vs Sedentary)', ar: 'المجتمع البدوي مقابل المجتمع الحضري' } },
      { id: 'islamic_social_justice', title: { id: 'Konsep Keadilan Sosial dalam Sosiologi Islam', en: 'Social Justice Concepts in Islamic Sociology', ar: 'مفاهيم العدالة الاجتماعية في علم الاجتماع الإسلامي' } }
    ]
  },
  {
    id: 'kelas10_sem1',
    title: { id: 'Kelas 10 - Semester 1', en: 'Grade 10 - Semester 1', ar: 'الصف العاشر - الفصل الأول' },
    topics: [
      { id: 'pengantar', title: { id: 'Pengantar Sosiologi: Sejarah & Fungsi', en: 'Intro to Sociology: History & Functions', ar: 'مقدمة في علم الاجتماع' } },
      { id: 'nilai_norma', title: { id: 'Nilai dan Norma Sosial', en: 'Social Values and Norms', ar: 'القيم والمعايير الاجتماعية' } },
      { id: 'tindakan_interaksi', title: { id: 'Tindakan dan Interaksi Sosial', en: 'Social Action and Interaction', ar: 'الفعل والتفاعل الاجتماعي' } }
    ]
  },
  {
    id: 'kelas10_sem2',
    title: { id: 'Kelas 10 - Semester 2', en: 'Grade 10 - Semester 2', ar: 'الصف العاشر - الفصل الثاني' },
    topics: [
      { id: 'sosialisasi', title: { id: 'Sosialisasi dan Pembentukan Kepribadian', en: 'Socialization and Personality Formation', ar: 'التنشئة الاجتماعية وتكوين الشخصية' } },
      { id: 'penyimpangan', title: { id: 'Perilaku Menyimpang dan Antisosial', en: 'Deviant and Antisocial Behavior', ar: 'السلوك المنحرف والمضاد للمجتمع' } },
      { id: 'pengendalian', title: { id: 'Sistem Pengendalian Sosial', en: 'Social Control Systems', ar: 'نظم الضبط الاجتماعي' } }
    ]
  },
  {
    id: 'kelas11_sem1',
    title: { id: 'Kelas 11 - Semester 1', en: 'Grade 11 - Semester 1', ar: 'الصف الحادي عشر - الفصل الأول' },
    topics: [
      { id: 'struktur_sosial', title: { id: 'Struktur Sosial: Kelas, Status & Peran', en: 'Social Structure: Class, Status & Role', ar: 'البنية الاجتماعية' } },
      { id: 'konflik_integrasi', title: { id: 'Konflik dan Integrasi Sosial', en: 'Social Conflict and Integration', ar: 'الصراع والاندماج الاجتماعي' } },
      { id: 'mobilitas', title: { id: 'Mobilitas Sosial', en: 'Social Mobility', ar: 'الحراك الاجتماعي' } }
    ]
  },
  {
    id: 'kelas11_sem2',
    title: { id: 'Kelas 11 - Semester 2', en: 'Grade 11 - Semester 2', ar: 'الصف الحادي عشر - الفصل الثاني' },
    topics: [
      { id: 'perubahan_sosial', title: { id: 'Teori dan Faktor Perubahan Sosial', en: 'Theories and Factors of Social Change', ar: 'نظريات التغير الاجتماعي' } },
      { id: 'modernisasi_globalisasi', title: { id: 'Modernisasi dan Globalisasi', en: 'Modernization and Globalization', ar: 'التحديث والعولمة' } },
      { id: 'identitas_multikultural', title: { id: 'Identitas Sosial dan Multikulturalisme', en: 'Social Identity and Multiculturalism', ar: 'الهوية الاجتماعية والتعددية الثقافية' } }
    ]
  },
  {
    id: 'kelas12_sem1',
    title: { id: 'Kelas 12 - Semester 1', en: 'Grade 12 - Semester 1', ar: 'الصف الثاني عشر - الفصل الأول' },
    topics: [
      { id: 'kasus_perubahan', title: { id: 'Studi Kasus Perubahan Sosial', en: 'Social Change Case Studies', ar: 'دراسات حالة التغير الاجتماعي' } },
      { id: 'lembaga_sosial', title: { id: 'Lembaga Sosial: Jenis & Fungsi', en: 'Social Institutions: Types & Functions', ar: 'المؤسسات الاجتماعية' } },
      { id: 'metode_penelitian', title: { id: 'Rancangan Metode Penelitian Sosial', en: 'Social Research Methodology', ar: 'مناهج البحث الاجتماعي' } }
    ]
  },
  {
    id: 'kelas12_sem2',
    title: { id: 'Kelas 12 - Semester 2', en: 'Grade 12 - Semester 2', ar: 'الصف الثاني عشر - الفصل الثاني' },
    topics: [
      { id: 'data_penelitian', title: { id: 'Pengumpulan & Pengolahan Data', en: 'Data Collection & Processing', ar: 'جمع ومعالجة البيانات' } },
      { id: 'laporan_penelitian', title: { id: 'Penulisan Laporan Penelitian', en: 'Research Report Writing', ar: 'كتابة تقارير البحوث' } },
      { id: 'isu_kontemporer', title: { id: 'Isu Sosial Kontemporer (Kemiskinan, Kesenjangan)', en: 'Contemporary Social Issues', ar: 'القضايا الاجتماعية المعاصرة' } }
    ]
  }
];

const UI_STRINGS = {
  en: {
    title: "Academy Library",
    desc: "A refined repository of sociological knowledge following Kurikulum Merdeka and Classical Perspectives.",
    loading: "Synthesizing academic material...",
    placeholder: "Deepen your inquiry: Theorists, comparative analysis, or modern application...",
    btnAsk: "Annotate",
    error: "Academic server error.",
    prompt: "Consult the archives by Grade to begin.",
    chapter: "Chapter",
    footnoteTitle: "Academic References & Methodology",
    page: "Page",
    toc: "Table of Contents",
    viewMaterial: "Open Chapter",
    backToToc: "Return to Archives"
  },
  id: {
    title: "Akademi Sosiologi",
    desc: "Eksplorasi materi akademik sosiologi Kurikulum Merdeka & Perspektif Islam dengan AI.",
    loading: "Menyusun materi akademik...",
    placeholder: "Perdalam pertanyaan Anda: Teori, analisis komparatif, atau studi kasus...",
    btnAsk: "Anotasi",
    error: "Gagal memuat materi akademik.",
    prompt: "Pilih materi berdasarkan jenjang untuk memulai.",
    chapter: "Bab",
    footnoteTitle: "Referensi Akademik & Metodologi",
    page: "Halaman",
    toc: "Daftar Isi Akademi",
    viewMaterial: "Buka Bab",
    backToToc: "Kembali ke Daftar Isi"
  },
  ar: {
    title: "مكتبة الأكاديمية",
    desc: "مستودع شامل للمعرفة الاجتماعية، يتبع المنهج المستقل والآفاق الكلاسيكية.",
    loading: "تجميع المادة الأكاديمية...",
    placeholder: "تعمق في استفسارك: نظريات، تحليل مقارن...",
    btnAsk: "تعليق",
    error: "خطأ في الخادم الأكاديمي.",
    prompt: "راجع جدول المحتويات حسب الصف لبدء جلستك.",
    chapter: "الفصل",
    footnoteTitle: "المراجع الأكاديمية",
    page: "صفحة",
    toc: "جدول المحتويات",
    viewMaterial: "افتح الفصل",
    backToToc: "العودة إلى الأرشيف"
  }
};

// Custom component for Interactive List Items
const InteractiveLi = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState(false);
  
  // Detect if this is likely a multiple choice option (e.g., starts with A., B., C.)
  const content = React.Children.toArray(children).join('');
  const isOption = /^[A-E]\./i.test(content.trim());

  if (isOption) {
    return (
      <li 
        onClick={() => setSelected(!selected)}
        className={`interactive-option ${selected ? 'selected' : ''}`}
      >
        {children}
      </li>
    );
  }

  // Fallback to regular list item if not an option
  return <li className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-2">{children}</li>;
};

const Learn: React.FC<LearnProps> = ({ lang }) => {
  const [selectedTopic, setSelectedTopic] = useState<SubTopic | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const t = UI_STRINGS[lang];
  const isRtl = lang === 'ar';

  const handleTopicSelect = async (topic: SubTopic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setExplanation('');
    try {
      const text = await explainConcept(topic.title.id, lang);
      setExplanation(text || t.error);
    } catch (e) {
      setExplanation(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeepDive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !query) return;
    setLoading(true);
    try {
      const text = await explainConcept(selectedTopic.title.id, lang, query);
      setExplanation(text || t.error);
      setQuery('');
    } catch (e) {
      setExplanation(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-12 animate-in slide-in-from-bottom-8 duration-700 ${isRtl ? 'text-right' : 'text-left'}`}>
      <header className={`space-y-4 max-w-4xl mx-auto ${isRtl ? 'text-right' : 'text-center'}`}>
        <div className="flex items-center justify-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-widest">
           <span className="w-8 h-[2px] bg-indigo-600"></span>
           SocioMind Academy
           <span className="w-8 h-[2px] bg-indigo-600"></span>
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{t.title}</h2>
        <p className="text-slate-500 text-xl font-medium">{t.desc}</p>
      </header>

      {!selectedTopic && (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{t.toc}</h3>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {CURRICULUM.map((category) => (
              <section key={category.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col group">
                <div className={`${category.id === 'sosiologi_islam' ? 'bg-indigo-700' : 'bg-slate-900'} px-8 py-6 text-white flex justify-between items-center transition-colors`}>
                  <h4 className="font-black uppercase tracking-tighter text-lg">
                    {category.title[lang]}
                  </h4>
                  <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                    {category.topics.length} Topik
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 gap-2">
                  {category.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className="w-full text-left p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-between group/item"
                    >
                      <span className="text-slate-700 font-bold text-sm md:text-base group-hover/item:text-indigo-900">
                        {topic.title[lang]}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm opacity-0 group-hover/item:opacity-100 transition-all">→</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">{t.loading}</p>
        </div>
      )}

      {!loading && explanation && selectedTopic && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <button 
              onClick={() => { setSelectedTopic(null); setExplanation(''); }}
              className="group flex items-center gap-3 bg-white px-8 py-4 rounded-2xl border border-slate-200 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
            >
              ← {t.backToToc}
            </button>
          </div>

          <div className="relative bg-white border border-slate-200 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col">
            <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <span className="hidden sm:inline">Academic Archive // v5.3</span>
              <span className="text-indigo-600">{t.chapter}: {selectedTopic.title[lang]}</span>
              <span className="hidden sm:inline">{t.page} {Math.floor(Math.random() * 500) + 1}</span>
            </div>

            <div className={`px-8 md:px-20 py-20 textbook-content ${isRtl ? 'rtl text-right' : ''}`}>
               <ReactMarkdown 
                 components={{
                   li: InteractiveLi
                 }}
               >
                 {explanation}
               </ReactMarkdown>
               
               <div className="mt-20 pt-12 border-t-2 border-slate-100">
                  <div className="flex items-center gap-2 mb-8 justify-center">
                     <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                     <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.footnoteTitle}</h5>
                     <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-400 leading-relaxed">
                       [1] Konten disintesis berdasarkan prinsip Kurikulum Merdeka dan merujuk pada pemikiran Ibnu Khaldun (Kitab Al-Muqaddimah) sebagai fondasi sosiologi klasik.
                     </div>
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-400 leading-relaxed">
                       [2] Referensi teori mencakup Asabiyyah, Umran, serta perbandingan sosiologi Timur dan Barat.
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
            <form onSubmit={handleDeepDive} className="flex flex-col gap-8 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <span className="text-indigo-400 text-2xl">✨</span>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Akademik AI Deep-Dive</label>
                </div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.placeholder}
                  rows={4}
                  className="w-full px-8 py-7 rounded-[2.5rem] bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-4 focus:ring-indigo-500/30 outline-none transition-all resize-none leading-relaxed font-medium text-lg"
                />
              </div>
              <div className="flex justify-center">
                <button 
                  type="submit"
                  disabled={!query}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-20 py-6 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-30 transition-all shadow-2xl active:scale-95 flex items-center gap-3"
                >
                   {t.btnAsk} <span className="text-lg">➔</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!selectedTopic && !loading && (
        <div className="text-center py-24 flex flex-col items-center opacity-30 select-none">
          <div className="text-9xl mb-8 animate-bounce">🏛️</div>
          <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">{t.prompt}</h3>
        </div>
      )}
    </div>
  );
};

export default Learn;
