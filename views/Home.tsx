
import React, { useState } from 'react';
import { View, Language } from '../types';
import { translations } from '../App';
import { generateIntroSpeech } from '../services/gemini';

interface HomeProps {
  onNavigate: (view: View) => void;
  lang: Language;
}

// Helper for Audio Decoding
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Home: React.FC<HomeProps> = ({ onNavigate, lang }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const playIntro = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64Audio = await generateIntroSpeech(lang);
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioCtx,
          24000,
          1
        );
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-20 md:py-32 text-center text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-full opacity-20">
          <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-600 blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">{t.tagline}</span>
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            {t.heroTitle} <br/>
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <button 
              onClick={() => onNavigate(View.LEARN)}
              className="group relative overflow-hidden rounded-2xl bg-white px-10 py-5 font-black text-slate-900 transition-all hover:bg-indigo-50 active:scale-95 shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t.start} <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
            <button 
              onClick={playIntro}
              disabled={isSpeaking}
              className={`group flex items-center gap-3 rounded-2xl border-2 px-8 py-5 font-black transition-all active:scale-95 backdrop-blur-md ${isSpeaking ? 'bg-indigo-600/20 border-indigo-400 text-indigo-300 animate-pulse' : 'border-white/20 bg-white/5 text-white hover:bg-white/10'}`}
            >
              <span className="text-2xl">{isSpeaking ? '🔊' : '✨'}</span>
              <span className="text-xs uppercase tracking-widest">
                {lang === 'id' ? 'Dengarkan Pengenalan' : lang === 'ar' ? 'استمع إلى المقدمة' : 'Listen to Introduction'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
        <div onClick={() => onNavigate(View.LEARN)} className="md:col-span-2 md:row-span-2 bento-card glass p-10 rounded-[2.5rem] flex flex-col justify-end cursor-pointer group relative overflow-hidden border-b-8 border-indigo-600">
           <div className="absolute top-10 right-10 text-8xl grayscale opacity-10 group-hover:opacity-40 transition-all group-hover:scale-110 group-hover:rotate-6">📚</div>
           <div className="relative z-10 space-y-4">
              <span className="text-indigo-600 font-black text-xs tracking-widest uppercase">Akademi Sosiologi</span>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Kurikulum Merdeka 2024</h3>
              <p className="text-slate-500 font-medium max-w-xs">Eksplorasi materi lengkap dari Kelas 10 hingga 12 dengan asisten akademik bertenaga AI.</p>
           </div>
        </div>

        <div onClick={() => onNavigate(View.QUIZ)} className="md:col-span-2 glass bento-card p-10 rounded-[2.5rem] flex items-center justify-between cursor-pointer group border-b-8 border-emerald-500">
           <div className="space-y-4">
              <span className="text-emerald-600 font-black text-xs tracking-widest uppercase">Uji Kompetensi</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">HOTS & TKA Labs</h3>
              <p className="text-slate-500 font-medium text-sm">Uji penalaran sosiologis Anda dengan soal tingkat tinggi.</p>
           </div>
           <div className="text-6xl group-hover:scale-125 transition-transform">⚡</div>
        </div>

        <div onClick={() => onNavigate(View.CASES)} className="glass bento-card p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center cursor-pointer group border-b-8 border-rose-500">
           <div className="text-5xl mb-4 group-hover:-rotate-12 transition-transform">🔍</div>
           <h4 className="text-xl font-black text-slate-900">Studi Kasus</h4>
        </div>

        <div onClick={() => onNavigate(View.CREATOR)} className="glass bento-card p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center cursor-pointer group border-b-8 border-slate-900">
           <div className="text-5xl mb-4 group-hover:rotate-12 transition-transform">🧪</div>
           <h4 className="text-xl font-black text-slate-900">Lab Soal AI</h4>
        </div>
      </section>

      {/* Pathways / Path Preview */}
      <section className="bg-white/50 border border-slate-200 p-12 rounded-[3rem] space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{t.curriculumTitle}</h3>
             <p className="text-slate-500 font-medium">Jelajahi fondasi pengetahuan sosial yang terstruktur.</p>
           </div>
           <button onClick={() => onNavigate(View.LEARN)} className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">Lihat Semua Materi ↗</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🏛️", title: "Teori Klasik", desc: "Marx, Weber, Durkheim", color: "bg-indigo-50" },
            { icon: "🌐", title: "Masyarakat Digital", desc: "Identitas & Ruang Siber", color: "bg-emerald-50" },
            { icon: "⚔️", title: "Dinamika Konflik", desc: "Resolusi & Perdamaian", color: "bg-rose-50" },
            { icon: "🌳", title: "Kearifan Lokal", desc: "Pemberdayaan & Budaya", color: "bg-amber-50" }
          ].map((path, i) => (
            <div key={i} className={`p-8 rounded-[2rem] ${path.color} border border-white/50 shadow-sm transition-transform hover:scale-105 cursor-pointer`}>
               <div className="text-4xl mb-4">{path.icon}</div>
               <h4 className="font-bold text-slate-900 text-lg mb-1">{path.title}</h4>
               <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">{path.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
