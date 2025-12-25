
import React, { useState } from 'react';
import { generateCustomQuestion } from '../services/gemini';
import { Language, CustomQuestion, QuestionType } from '../types';

interface CreatorProps {
  lang: Language;
}

const UI_STRINGS = {
  en: {
    title: "Sociology Question Lab",
    desc: "Generate high-quality academic questions for practice or exams using AI.",
    topicLabel: "Subject / Topic",
    typeLabel: "Question Format",
    generateBtn: "Synthesize Question",
    loading: "Synthesizing professional content...",
    placeholder: "e.g., Deviant Behavior, Globalization, Social Stratification...",
    types: {
      pg: "Standard Multiple Choice (Single)",
      pg_tka: "PG TKA (Multi-select / Complex)",
      uraian: "Conceptual Essay",
      uraian_tka: "Advanced Critical Essay"
    },
    results: {
      question: "Question Content",
      key: "Answer Key",
      analysis: "Academic Analysis / Scoring Rubric",
      copy: "Copy to Clipboard",
      copied: "Copied!"
    }
  },
  id: {
    title: "Lab Pembuat Soal",
    desc: "Hasilkan soal akademik berkualitas tinggi untuk latihan atau ujian menggunakan AI.",
    topicLabel: "Subjek / Topik",
    typeLabel: "Format Soal",
    generateBtn: "Sintesis Soal",
    loading: "Menyusun konten profesional...",
    placeholder: "Misal: Perilaku Menyimpang, Globalisasi, Stratifikasi Sosial...",
    types: {
      pg: "Pilihan Ganda (Satu Jawaban)",
      pg_tka: "PG TKA (Pilihan Ganda Kompleks)",
      uraian: "Uraian Konseptual",
      uraian_tka: "Uraian Analisis TKA"
    },
    results: {
      question: "Konten Soal",
      key: "Kunci Jawaban",
      analysis: "Analisis Akademik / Rubrik Penilaian",
      copy: "Salin ke Papan Klip",
      copied: "Tersalin!"
    }
  },
  ar: {
    title: "مختبر إنشاء الأسئلة",
    desc: "أنشئ أسئلة أكاديمية عالية الجودة للممارسة أو الامتحانات باستخدام الذكاء الاصطناعي.",
    topicLabel: "الموضوع / العنوان",
    typeLabel: "تنسيق السؤال",
    generateBtn: "توليد السؤال",
    loading: "تجميع المحتوى الاحترافي...",
    placeholder: "مثال: السلوك المنحرف، العولمة، الطبقية الاجتماعية...",
    types: {
      pg: "خيار من متعدد (إجابة واحدة)",
      pg_tka: "خيار من متعدد (إجابات متعددة)",
      uraian: "سؤال مقالي مفاهيمي",
      uraian_tka: "سؤال مقالي تحليلي متقدم"
    },
    results: {
      question: "محتوى السؤال",
      key: "مفتاح الإجابة",
      analysis: "التحليل الأكاديمي / دليل التصحيح",
      copy: "نسخ إلى الحافظة",
      copied: "تم النسخ!"
    }
  }
};

const Creator: React.FC<CreatorProps> = ({ lang }) => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<QuestionType>('pg_tka');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<CustomQuestion | null>(null);
  const [copied, setCopied] = useState(false);

  const t = UI_STRINGS[lang];
  const isRtl = lang === 'ar';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setQuestion(null);
    try {
      const result = await generateCustomQuestion(type, topic, lang);
      setQuestion(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const copyToClipboard = () => {
    if (!question) return;
    const keys = question.answerKeys ? (Array.isArray(question.answerKeys) ? question.answerKeys.join(', ') : question.answerKeys) : 'N/A';
    const text = `
TOPIK: ${topic}
TIPE: ${t.types[question.type]}
---
SOAL:
${question.content}
${question.options ? '\nOPSI:\n' + question.options.map((o, i) => `${String.fromCharCode(65+i)}. ${o}`).join('\n') : ''}
---
KUNCI JAWABAN: ${keys}
ANALISIS:
${question.deepExplanation}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-10 animate-in fade-in duration-500 ${isRtl ? 'text-right' : 'text-left'}`}>
      <header className="space-y-4">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t.title}</h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl">{t.desc}</p>
      </header>

      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">{t.topicLabel}</label>
             <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.placeholder} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none transition-all font-medium text-slate-800" />
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">{t.typeLabel}</label>
             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {(['pg', 'pg_tka', 'uraian', 'uraian_tka'] as QuestionType[]).map((qt) => (
                  <button key={qt} type="button" onClick={() => setType(qt)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap border-2 ${type === qt ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>{t.types[qt]}</button>
                ))}
             </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading || !topic.trim()} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black disabled:opacity-30 transition-all flex items-center gap-3 active:scale-95 shadow-xl">
              {loading ? t.loading : t.generateBtn}
            </button>
          </div>
        </form>
      </section>

      {question && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
           <div className="bg-white border border-slate-200 rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-slate-100">
              <div className="bg-slate-50 px-10 py-6 border-b border-slate-100 flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">{t.types[question.type]}</span>
                 <button onClick={copyToClipboard} className={`flex items-center gap-2 text-[10px] font-black uppercase transition-colors ${copied ? 'text-emerald-600' : 'text-slate-400'}`}>{copied ? t.results.copied : t.results.copy}</button>
              </div>
              <div className="p-10 space-y-10">
                 <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.results.question}</h4>
                    <div className="textbook-content text-slate-800 text-xl leading-relaxed bg-slate-50/50 p-8 rounded-3xl border border-slate-100 italic">{question.content}</div>
                 </section>
                 {question.options && (
                   <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                           <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">{String.fromCharCode(65 + i)}</span>
                           <span className="font-bold text-slate-700">{opt}</span>
                        </div>
                      ))}
                   </section>
                 )}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                    <div className="lg:col-span-1 space-y-3">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.results.key}</h4>
                       <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl font-black text-xl flex items-center justify-center border border-emerald-100 text-center">
                          {Array.isArray(question.answerKeys) ? question.answerKeys.join(', ') : question.answerKeys || 'URAIAN'}
                       </div>
                    </div>
                    <div className="lg:col-span-2 space-y-3">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.results.analysis}</h4>
                       <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl font-medium text-sm leading-relaxed border border-slate-800 shadow-xl"><p className="whitespace-pre-wrap">{question.deepExplanation}</p></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Creator;
