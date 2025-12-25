
import React, { useState } from 'react';
import { View, Language, Subject } from '../types';
import { translations } from '../App';
import { generateIntroSpeech } from '../services/gemini';

interface HomeProps {
  onNavigate: (view: View) => void;
  lang: Language;
  subject: Subject;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const Home: React.FC<HomeProps> = ({ onNavigate, lang, subject }) => {
  const t = translations[lang];
  const [isSpeaking, setIsSpeaking] = useState(false);

  const playIntro = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64Audio = await generateIntroSpeech(lang, subject);
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else { setIsSpeaking(false); }
    } catch (e) { setIsSpeaking(false); }
  };

  const metaPromptText = `Buatkan aplikasi AI premium untuk pelajaran ${subject} dengan fitur Akademi, Kuis HOTS, dan Lab Analisis Data...`;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-20 md:py-32 text-center text-white shadow-2xl">
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">{t.tagline}</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            {subject.toUpperCase()} <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">AI ACADEMY</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <button onClick={() => onNavigate(View.LEARN)} className="rounded-2xl bg-white px-10 py-5 font-black text-slate-900 shadow-xl">{t.start}</button>
            <button onClick={playIntro} disabled={isSpeaking} className="border-2 border-white/20 bg-white/5 px-8 py-5 rounded-2xl font-black uppercase text-xs">
              {isSpeaking ? '🔊 Playing...' : '✨ Listen Intro'}
            </button>
          </div>
        </div>
      </section>

      {/* Meta Prompt Section */}
      <section className="bg-indigo-50 border-2 border-indigo-100 p-10 rounded-[3rem] space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Meta-Prompt Pelajaran Lain</h3>
        </div>
        <p className="text-slate-600 text-sm font-medium">Gunakan prompt di bawah ini untuk membuat aplikasi AI pelajaran apa pun dengan kualitas yang sama:</p>
        <div className="bg-white p-6 rounded-2xl border border-indigo-200 font-mono text-xs text-indigo-900 leading-relaxed shadow-inner select-all">
          "{metaPromptText}"
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => onNavigate(View.LEARN)} className="glass p-10 rounded-[2.5rem] border-b-8 border-indigo-600 cursor-pointer hover:scale-105 transition-transform">
          <h3 className="text-2xl font-black">📚 Akademi</h3>
          <p className="text-slate-500 text-sm mt-2">Pelajari materi lengkap kurikulum merdeka.</p>
        </div>
        <div onClick={() => onNavigate(View.QUIZ)} className="glass p-10 rounded-[2.5rem] border-b-8 border-emerald-500 cursor-pointer hover:scale-105 transition-transform">
          <h3 className="text-2xl font-black">⚡ Kuis HOTS</h3>
          <p className="text-slate-500 text-sm mt-2">Uji kecerdasan analitis Anda.</p>
        </div>
        <div onClick={() => onNavigate(View.LAB)} className="glass p-10 rounded-[2.5rem] border-b-8 border-rose-500 cursor-pointer hover:scale-105 transition-transform">
          <h3 className="text-2xl font-black">📊 Lab Data</h3>
          <p className="text-slate-500 text-sm mt-2">Lakukan analisis data subjek real-time.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
