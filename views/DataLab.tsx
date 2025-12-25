
import React, { useState } from 'react';
import { analyzeSocialData } from '../services/gemini';
import { Language } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DataLabProps {
  lang: Language;
}

const UI_STRINGS = {
  en: {
    title: "Social Data Laboratory",
    desc: "Write your social observations and let AI perform theoretical quantitative analysis.",
    placeholder: "Example: I observed young people in a cafe interacting more with their phones than friends...",
    loading: "SocioMind is processing theoretical perspectives...",
    analyzeBtn: "Analyze Observation",
    analyzing: "Analyzing...",
    visualTitle: "Theory Visualization",
    visualNote: "Theory relevance score to your observation.",
    analysisTitle: "Deep Analysis",
    summaryTitle: "Key Conclusion:",
    resetBtn: "Reset and Analyze New Data",
    charCount: "characters"
  },
  id: {
    title: "Laboratorium Data Sosial",
    desc: "Tuliskan observasi sosial Anda dan biarkan AI melakukan analisis kuantitatif berbasis teori.",
    placeholder: "Contoh: Saya mengamati anak muda di kafe lebih banyak berinteraksi dengan layar HP daripada teman...",
    loading: "SocioMind sedang memproses perspektif teoritis...",
    analyzeBtn: "Analisis Observasi",
    analyzing: "Sedang Menganalisis...",
    visualTitle: "Visualisasi Teori",
    visualNote: "Skor relevansi teori terhadap observasi Anda.",
    analysisTitle: "Analisis Mendalam",
    summaryTitle: "Kesimpulan Utama:",
    resetBtn: "Reset dan Analisis Data Baru",
    charCount: "karakter"
  },
  ar: {
    title: "مختبر البيانات الاجتماعية",
    desc: "اكتب ملاحظاتك الاجتماعية ودع الذكاء الاصطناعي يقوم بإجراء تحليل كمي نظري.",
    placeholder: "مثال: لاحظت شباباً في مقهى يتفاعلون مع هواتفهم أكثر من أصدقائهم...",
    loading: "SocioMind يقوم بمعالجة المنظورات النظرية...",
    analyzeBtn: "تحليل الملاحظة",
    analyzing: "جاري التحليل...",
    visualTitle: "تصوير النظرية",
    visualNote: "درجة صلة النظرية بملاحظتك.",
    analysisTitle: "تحليل عميق",
    summaryTitle: "الاستنتاج الرئيسي:",
    resetBtn: "إعادة ضبط وتحليل بيانات جديدة",
    charCount: "حرف"
  }
};

const DataLab: React.FC<DataLabProps> = ({ lang }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const t = UI_STRINGS[lang];
  const isRtl = lang === 'ar';

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeSocialData(input, lang);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div className={`max-w-4xl mx-auto space-y-10 ${isRtl ? 'text-right' : 'text-left'}`}>
      <header className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">{t.desc}</p>
      </header>

      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            dir={isRtl ? 'rtl' : 'ltr'}
            className="w-full h-40 p-6 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-700"
            maxLength={1000}
          />
          <div className={`flex justify-between items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs text-slate-400">{input.length}/1000 {t.charCount}</span>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
              {loading ? t.analyzing : t.analyzeBtn}
            </button>
          </div>
        </form>
      </section>

      {loading && (
        <div className="flex flex-col items-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500">{t.loading}</p>
        </div>
      )}

      {result && (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-800">{t.visualTitle}</h3>
            <p className="text-sm text-slate-500 italic">{t.visualNote}</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.scores} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} reversed={isRtl} />
                  <YAxis hide domain={[0, 100]} orientation={isRtl ? 'right' : 'left'} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                    {result.scores.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={`flex flex-wrap gap-4 justify-center text-xs font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
              {result.scores.map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-600 uppercase tracking-tighter">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-800">{t.analysisTitle}</h3>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <div className={`p-4 bg-indigo-50 rounded-r-xl ${isRtl ? 'border-r-4 border-l-0 border-indigo-500' : 'border-l-4 border-indigo-500'}`}>
                <p className="font-semibold text-indigo-900 mb-1">{t.summaryTitle}</p>
                {result.summary}
              </div>
              <p className="whitespace-pre-wrap">{result.detailedAnalysis}</p>
            </div>
            <button 
              onClick={() => { setInput(''); setResult(null); }}
              className="w-full py-3 text-slate-400 font-bold hover:text-indigo-600 transition-colors border-2 border-dashed border-slate-200 rounded-xl mt-4"
            >
              {t.resetBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataLab;
