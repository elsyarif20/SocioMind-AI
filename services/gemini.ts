
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion, CaseStudy, Language, CustomQuestion, QuestionType, Subject } from "../types";

// Helper untuk mengecek apakah kita harus menggunakan data demo
const isDemoMode = () => !process.env.API_KEY || process.env.API_KEY === 'demo';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MOCK_QUIZ: QuizQuestion[] = [
  {
    question: "Dalam teori Ibnu Khaldun, apa yang menjadi pengikat utama solidaritas kelompok pada masyarakat nomaden?",
    options: ["Asabiyyah (Solidaritas Sosial)", "Kepentingan Ekonomi", "Kekuasaan Militer", "Kesamaan Hobi"],
    correctAnswers: [0],
    explanation: "Asabiyyah adalah konsep kunci Ibnu Khaldun yang merujuk pada ikatan sosial, kesadaran kelompok, dan kohesi sosial yang kuat.",
    isMultiSelect: false
  },
  {
    question: "Menurut Emile Durkheim, masyarakat modern diikat oleh solidaritas jenis apa?",
    options: ["Solidaritas Mekanik", "Solidaritas Organik", "Solidaritas Digital", "Solidaritas Tradisional"],
    correctAnswers: [1],
    explanation: "Solidaritas organik muncul dalam masyarakat kompleks dengan pembagian kerja yang tinggi, di mana individu saling bergantung satu sama lain.",
    isMultiSelect: false
  }
];

const handleApiError = async (error: any) => {
  console.warn("API Error encountered. Switching to Demo Data if available.", error);
  
  const errorObj = error?.error || error;
  const message = error?.message || errorObj?.message || "";

  if (message.includes("Quota exceeded") || message.includes("429") || message.includes("API_KEY_INVALID")) {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  }
  throw error;
};

const getSystemInstruction = (lang: Language, subject: Subject = 'sociology') => {
  const langMap: Record<Language, string> = { en: "English", id: "Indonesian", ar: "Arabic" };
  const subjectFocus: Record<Subject, string> = {
    sociology: "Sociology Professor. Focus on Ibn Khaldun, Durkheim, and Social Structures.",
    history: "History Professor. Focus on Historiography.",
    economics: "Economics Professor.",
    biology: "Biology Professor."
  };
  return `You are an authoritative ${subjectFocus[subject]}. Language: ${langMap[lang]}.`;
};

export const generateQuiz = async (topic: string, lang: Language, subject: Subject, difficulty: number = 1): Promise<QuizQuestion[]> => {
  if (isDemoMode()) return MOCK_QUIZ;
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate 5 HOTS questions for ${subject} on topic: "${topic}".`,
      config: {
        systemInstruction: getSystemInstruction(lang, subject),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
              isMultiSelect: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswers", "isMultiSelect", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    if (isDemoMode()) return MOCK_QUIZ;
    return handleApiError(e);
  }
};

export const explainConcept = async (concept: string, lang: Language, subject: Subject, query?: string) => {
  if (isDemoMode()) return `### ${concept}\n\nIni adalah **Mode Demo**. Penjelasan ini adalah contoh statis karena API Key tidak aktif.\n\nDalam sosiologi, konsep ini merujuk pada bagaimana individu berinteraksi dalam struktur sosial yang lebih luas. Hubungan antara struktur dan agensi adalah inti dari perdebatan sosiologis modern.`;
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query ? `Explain "${concept}" regarding: "${query}".` : `Explain "${concept}".`,
      config: { systemInstruction: getSystemInstruction(lang, subject) }
    });
    return response.text;
  } catch (e) {
    return handleApiError(e);
  }
};

export const generateIntroSpeech = async (lang: Language, subject: Subject): Promise<string | undefined> => {
  if (isDemoMode()) return undefined;
  const ai = getAI();
  const intros: Record<Subject, Record<Language, string>> = {
    sociology: { id: "Selamat datang di Sosiologi AI.", en: "Welcome to Sociology AI.", ar: "مرحباً بكم." },
    history: { id: "Selamat datang di Sejarah AI.", en: "Welcome.", ar: "مرحباً." },
    economics: { id: "Selamat datang.", en: "Welcome.", ar: "مرحباً." },
    biology: { id: "Selamat datang.", en: "Welcome.", ar: "مرحباً." }
  };
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: intros[subject][lang] }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: lang === 'id' ? 'Kore' : 'Zephyr' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch { return undefined; }
};

export const analyzeSocialData = async (text: string, lang: Language, subject: Subject) => {
  if (isDemoMode()) return {
    summary: "Hasil analisis demo: Observasi menunjukkan adanya pergeseran perilaku sosial akibat teknologi.",
    scores: [{ label: "Fungsionalisme", value: 85 }, { label: "Konflik", value: 45 }],
    detailedAnalysis: "Dalam mode demo, kami menyimpulkan bahwa interaksi sosial tetap berjalan namun melalui medium yang berbeda."
  };
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze: "${text}".`,
      config: {
        systemInstruction: getSystemInstruction(lang, subject),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            scores: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, value: { type: Type.NUMBER }, label: { type: Type.STRING } } } },
            detailedAnalysis: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return handleApiError(e); }
};

export const generateCaseStudy = async (topic: string, lang: Language, subject: Subject): Promise<CaseStudy> => {
  if (isDemoMode()) return {
    title: "Studi Kasus Demo: Urbanisasi",
    scenario: "Masyarakat di desa X berpindah ke kota Y demi upah yang lebih tinggi, namun menghadapi gegar budaya.",
    analysisQuestions: ["Bagaimana dampak urbanisasi terhadap kohesi desa?", "Apa solusi integrasi sosial di kota?"],
    proposedSolutions: ["Program pemberdayaan komunitas", "Penyediaan ruang publik inklusif"]
  };
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Case study for ${subject} on: "${topic}".`,
      config: {
        systemInstruction: getSystemInstruction(lang, subject),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { title: { type: Type.STRING }, scenario: { type: Type.STRING }, analysisQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }, proposedSolutions: { type: Type.ARRAY, items: { type: Type.STRING } } },
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return handleApiError(e); }
};

export const getDefinition = async (term: string, lang: Language, subject: Subject = 'sociology'): Promise<string | undefined> => {
  if (isDemoMode()) return `Definisi Demo: "${term}" adalah konsep dasar dalam ${subject} yang sering dibahas dalam Kurikulum Merdeka.`;
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Define "${term}" in ${subject}.`,
      config: { systemInstruction: getSystemInstruction(lang, subject) }
    });
    return response.text;
  } catch (e) { return handleApiError(e); }
};

export const generateCustomQuestion = async (type: QuestionType, topic: string, lang: Language, subject: Subject = 'sociology'): Promise<CustomQuestion> => {
  if (isDemoMode()) return {
    type: 'pg',
    content: `[DEMO] Contoh soal tentang ${topic}: Apa fungsi utama lembaga sosial?`,
    options: ["Menjaga keteraturan", "Menciptakan konflik", "Menghapus norma", "Hanya formalitas"],
    answerKeys: ["A"],
    deepExplanation: "Lembaga sosial berfungsi mengatur pola perilaku masyarakat agar tercipta keteraturan sosial."
  };
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a ${type} question for ${subject} on topic: "${topic}".`,
      config: {
        systemInstruction: getSystemInstruction(lang, subject),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            content: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answerKeys: { type: Type.ARRAY, items: { type: Type.STRING } },
            deepExplanation: { type: Type.STRING }
          },
          required: ["type", "content", "deepExplanation"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return handleApiError(e); }
};
