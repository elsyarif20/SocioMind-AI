
import React, { useState, useMemo } from 'react';
import { getDefinition } from '../services/gemini';
import { Language, GlossaryTerm } from '../types';

interface GlossaryProps {
  lang: Language;
}

const STATIC_TERMS: GlossaryTerm[] = [
  { term: 'Akomodasi', category: 'phenomenon', definition: { id: 'Proses penyesuaian diri antara individu atau kelompok yang semula bertikai untuk meredakan ketegangan.', en: 'The process of adjustment between individuals or groups that were previously at odds to relieve tension.', ar: 'عملية التكيف بين الأفراد أو الجماعات التي كانت على خلاف سابقاً لتخفيف حدة التوتر.' } },
  { term: 'Asimilasi', category: 'phenomenon', definition: { id: 'Peleburan dua kebudayaan menjadi satu kebudayaan baru yang menghilangkan ciri khas budaya asli.', en: 'The merging of two cultures into one new culture that eliminates the distinctive characteristics of the original cultures.', ar: 'اندماج ثقافتين في ثقافة جديدة واحدة تقضي على الخصائص المميزة للثقافات الأصلية.' } },
  { term: 'Diferensiasi Sosial', category: 'structure', definition: { id: 'Pembedaan masyarakat secara horizontal berdasarkan ciri-ciri fisik, sosial, atau budaya tanpa tingkatan hierarki.', en: 'Horizontal differentiation of society based on physical, social, or cultural characteristics without hierarchical levels.', ar: 'التمايز الأفقي للمجتمع بناءً على الخصائص الجسدية أو الاجتماعية أو الثقافية دون مستويات هرمية.' } },
  { term: 'Disintegrasi', category: 'phenomenon', definition: { id: 'Proses pudarnya norma-norma dan nilai-nilai dalam masyarakat karena adanya perubahan.', en: 'The process of fading norms and values in society due to changes.', ar: 'عملية تلاشي المعايير والقيم في المجتمع بسبب التغيرات.' } },
  { term: 'Fakta Sosial', category: 'theory', definition: { id: 'Cara bertindak, berpikir, dan merasa yang berada di luar individu dan memiliki kekuatan memaksa (Emile Durkheim).', en: 'Ways of acting, thinking, and feeling that exist outside the individual and have coercive power (Emile Durkheim).', ar: 'طرق التصرف والتفكير والشعور التي توجد خارج الفرد ولها قوة قسرية (إميل دوركايم).' } },
  { term: 'Fungsionalisme', category: 'theory', definition: { id: 'Teori yang melihat masyarakat sebagai sistem yang terdiri dari bagian-bagian yang saling bergantung dan bekerja sama untuk mencapai stabilitas.', en: 'A theory that sees society as a system consisting of interdependent parts that work together to achieve stability.', ar: 'نظرية ترى المجتمع كالنظام يتكون من أجزاء مترابطة تعمل معاً لتحقيق الاستقرار.' } },
  { term: 'Interaksi Sosial', category: 'phenomenon', definition: { id: 'Hubungan timbal balik berupa aksi dan reaksi antar individu, individu dengan kelompok, atau antar kelompok.', en: 'Reciprocal relationships in the form of action and reaction between individuals, individuals and groups, or between groups.', ar: 'علاقات متبادلة في شكل فعل ورد فعل بين الأفراد، أو الأفراد والجماعات، أو بين الجماعات.' } },
  { term: 'Konflik Sosial', category: 'phenomenon', definition: { id: 'Pertentangan antar anggota masyarakat yang bersifat menyeluruh dalam kehidupan.', en: 'Comprehensive opposition between members of society in life.', ar: 'معارضة شاملة بين أفراد المجتمع في الحياة.' } },
  { term: 'Mobilitas Sosial', category: 'structure', definition: { id: 'Perpindahan status sosial individu atau kelompok dari satu lapisan ke lapisan lain.', en: 'The movement of individual or group social status from one layer to another.', ar: 'انتقال الوضع الاجتماعي للفرد أو الجماعة من طبقة إلى أخرى.' } },
  { term: 'Masyarakat Multikultural', category: 'structure', definition: { id: 'Masyarakat yang terdiri atas beragam kelompok budaya yang hidup bersama dengan pengakuan kesederajatan.', en: 'A society consisting of diverse cultural groups living together with recognition of equality.', ar: 'مجتمع يتكون من مجموعات ثقافية متنوعة تعيش معاً مع الاعتراف بالمساواة.' } },
  { term: 'Norma Sosial', category: 'structure', definition: { id: 'Aturan atau ketentuan yang mengikat warga kelompok dalam masyarakat.', en: 'Rules or provisions that bind group members within a society.', ar: 'القواعد أو الأحكام التي تربط أعضاء المجموعة داخل المجتمع.' } },
  { term: 'Stratifikasi Sosial', category: 'structure', definition: { id: 'Pembedaan penduduk atau masyarakat ke dalam kelas-kelas secara bertingkat (hierarki).', en: 'The differentiation of the population or society into classes in a tiered (hierarchical) manner.', ar: 'تمايز السكان أو المجتمع إلى طبقات بشكل متدرج (هرمي).' } },
];

const UI_STRINGS = {
  en: {
    title: "Sociological Glossary",
    desc: "A standardized dictionary of essential sociological terms and theoretical definitions.",
    searchPlaceholder: "Search for a term (e.g., Anomie, Hegemony)...",
    categoryLabel: "Filter by Category",
    all: "All Terms",
    theory: "Theory",
    method: "Methodology",
    phenomenon: "Phenomena",
    structure: "Structure",
    noResults: "Term not found in our database.",
    askAi: "Ask SocioMind AI for a definition",
    aiLoading: "Synthesizing definition...",
    aiTitle: "AI Academic Insight",
    reset: "Clear Search"
  },
  id: {
    title: "Glosarium Sosiologi",
    desc: "Kamus standar istilah-istilah sosiologi esensial dan definisi teoritis.",
    searchPlaceholder: "Cari istilah (misal: Anomi, Hegemoni)...",
    categoryLabel: "Filter Kategori",
    all: "Semua Istilah",
    theory: "Teori",
    method: "Metodologi",
    phenomenon: "Fenomena",
    structure: "Struktur",
    noResults: "Istilah tidak ditemukan di database kami.",
    askAi: "Tanya SocioMind AI untuk definisi",
    aiLoading: "Menyusun definisi akademik...",
    aiTitle: "Wawasan Akademik AI",
    reset: "Bersihkan Pencarian"
  },
  ar: {
    title: "قاموس علم الاجتماع",
    desc: "قاموس معتمد للمصطلحات الاجتماعية الأساسية والتعاريف النظرية.",
    searchPlaceholder: "ابحث عن مصطلح (مثل: الأنوميا، الهيمنة)...",
    categoryLabel: "تصفية حسب الفئة",
    all: "جميع المصطلحات",
    theory: "نظرية",
    method: "منهجية",
    phenomenon: "ظواهر",
    structure: "بنية",
    noResults: "لم يتم العثور على المصطلح في قاعدة بياناتنا.",
    askAi: "اطلب تعريفاً من SocioMind AI",
    aiLoading: "جاري صياغة التعريف...",
    aiTitle: "رؤية أكاديمية من الذكاء الاصطناعي",
    reset: "مسح البحث"
  }
};

const Glossary: React.FC<GlossaryProps> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [aiDefinition, setAiDefinition] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const t = UI_STRINGS[lang];
  const isRtl = lang === 'ar';

  const filteredTerms = useMemo(() => {
    return STATIC_TERMS.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedCategory]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleAiSearch = async () => {
    if (!searchTerm) return;
    setAiLoading(true);
    setAiDefinition(null);
    try {
      const def = await getDefinition(searchTerm, lang);
      setAiDefinition(def || null);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className={`space-y-10 animate-in fade-in duration-500 ${isRtl ? 'text-right' : 'text-left'}`}>
      <header className="space-y-4">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t.title}</h2>
        <p className="text-slate-500 text-lg font-medium">{t.desc}</p>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
           <input 
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setAiDefinition(null); }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
           />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['all', 'theory', 'method', 'phenomenon', 'structure'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-400'
              }`}
            >
              {t[cat as keyof typeof t] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, i) => (
            <div key={i} className="group bg-white p-8 rounded-3xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all flex flex-col gap-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="text-6xl font-black text-slate-400">{item.term[0]}</span>
               </div>
               <div className="relative z-10">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   item.category === 'theory' ? 'bg-indigo-100 text-indigo-700' :
                   item.category === 'method' ? 'bg-amber-100 text-amber-700' :
                   item.category === 'phenomenon' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                 }`}>
                   {t[item.category as keyof typeof t]}
                 </span>
                 <h3 className="text-2xl font-black text-slate-800 mt-3">{item.term}</h3>
                 <p className="text-slate-600 mt-4 leading-relaxed font-serif italic text-sm md:text-base">
                   "{item.definition[lang]}"
                 </p>
               </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-6 bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-slate-200">
            <div className="text-6xl grayscale opacity-20">📖</div>
            <div className="space-y-2">
              <p className="text-slate-500 font-bold">{t.noResults}</p>
              {searchTerm && (
                <button 
                  onClick={handleAiSearch}
                  disabled={aiLoading}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {aiLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : '✨'}
                  {t.askAi}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Definition Modal-style display */}
      {aiDefinition && (
        <div className="animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-indigo-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-indigo-400/20">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-400/30">
                  {t.aiTitle}
                </span>
                <button onClick={() => setAiDefinition(null)} className="ml-auto text-indigo-300 hover:text-white transition-colors">✕</button>
              </div>
              <h4 className="text-3xl font-black tracking-tight">{searchTerm}</h4>
              <div className="textbook-content text-indigo-50 text-lg leading-relaxed italic opacity-90 border-l-4 border-indigo-400 pl-6">
                {aiDefinition}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Glossary;
