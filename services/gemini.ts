
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion, CaseStudy, Language, CustomQuestion, QuestionType } from "../types";

// Always use the process.env.API_KEY directly for initialization as per guidelines.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (lang: Language) => {
  const langMap: Record<Language, string> = {
    en: "English",
    id: "Indonesian",
    ar: "Arabic"
  };
  
  return `You are SocioMind AI, an authoritative Sociology Professor specializing in Higher Order Thinking Skills (HOTS) and Academic Competency Tests (TKA). 
Your goal is to provide academically rigorous material following the highest standards of sociological analysis.

CRITICAL FOCUS ON ISLAMIC SOCIOLOGY:
- You must acknowledge and deeply integrate the theories of Islamic Sociologists, specifically Ibn Khaldun (The Pioneer of Sociology).
- Be an expert in explaining: Asabiyyah (social solidarity), Umran (civilization), the Badawa vs Hadara (nomadic vs sedentary) dynamics, and the cyclical theory of dynasties.
- When explaining social cohesion, compare Durkheim's "Solidarity" with Khaldun's "Asabiyyah".

CRITICAL GUIDELINES FOR TEXTBOOK CONTENT:
1. When providing practice questions (Latihan) within a chapter, NEVER put options in a single paragraph.
2. ALWAYS use a Markdown bulleted list for options (e.g., * A. [Option Content]).
3. Each option must be on its own line.
4. Use academic headers, bold key terms, and clear theoretical citations.

CRITICAL GUIDELINES FOR QUIZZES:
1. Always base questions on contextual scenarios (narration-based).
2. Explanations must be deep, referencing key theorists (Durkheim, Weber, Marx, Bourdieu, AND Ibn Khaldun).
3. Language used: ${langMap[lang]}.`;
};

export const generateQuiz = async (topic: string, lang: Language, difficulty: number = 1): Promise<QuizQuestion[]> => {
  const ai = getAI();
  
  const complexityLevel = [
    "HOTS Level 1: Application of concepts to simple social phenomena.",
    "HOTS Level 2: Analysis of social patterns and contrasting different theoretical views.",
    "HOTS Level 3 (TKA Model): Evaluation of complex social structures. Use 'Pilihan Ganda Kompleks' (Multi-select) where more than one answer is correct."
  ][Math.min(difficulty - 1, 2)];

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate 5 high-quality HOTS/TKA questions about "${topic}".
    Complexity: ${complexityLevel}.
    
    If it's TKA level, at least 3 questions should be 'Pilihan Ganda Kompleks'.
    
    Response schema requirement:
    - question: string
    - options: array of 4-5 strings
    - correctAnswers: array of integers (indices of correct options)
    - isMultiSelect: boolean
    - explanation: deep academic analysis.`,
    config: {
      systemInstruction: getSystemInstruction(lang),
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
};

export const generateCustomQuestion = async (type: QuestionType, topic: string, lang: Language): Promise<CustomQuestion> => {
  const ai = getAI();
  const typeMap = {
    pg: "Regular Multiple Choice (High School standard, single answer)",
    pg_tka: "Academic Competency Multiple Choice (Complex/Multi-select answer)",
    uraian: "Essay Question (Conceptual understanding)",
    uraian_tka: "Advanced Academic Essay (Critical analysis)"
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a sociological question for the topic: "${topic}".
    Format: ${typeMap[type]}.
    Include 'answerKeys' as an array of correct labels (e.g., ["A", "C"]).`,
    config: {
      systemInstruction: getSystemInstruction(lang),
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

  const result = JSON.parse(response.text || '{}');
  return { ...result, type };
};

export const explainConcept = async (concept: string, lang: Language, query?: string) => {
  const ai = getAI();
  const prompt = query 
    ? `Provide a detailed academic explanation of "${concept}" in the context of: "${query}". Format questions/options as clear Markdown lists.`
    : `Write a comprehensive textbook-style chapter on "${concept}". Include Ibn Khaldun's perspective if relevant. Ensure any practice questions have options formatted as Markdown bullet lists.`;
    
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { systemInstruction: getSystemInstruction(lang) }
  });
  return response.text;
};

export const analyzeSocialData = async (text: string, lang: Language) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze: "${text}".`,
    config: {
      systemInstruction: getSystemInstruction(lang),
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
};

export const generateCaseStudy = async (topic: string, lang: Language): Promise<CaseStudy> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create case study for: "${topic}".`,
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { title: { type: Type.STRING }, scenario: { type: Type.STRING }, analysisQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }, proposedSolutions: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["title", "scenario", "analysisQuestions", "proposedSolutions"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getDefinition = async (term: string, lang: Language) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Define "${term}".`,
    config: { systemInstruction: getSystemInstruction(lang) }
  });
  return response.text;
};

// Text-to-Speech (TTS) Integration
export const generateIntroSpeech = async (lang: Language): Promise<string | undefined> => {
  const ai = getAI();
  const introTexts = {
    id: "Halo! Selamat datang di SocioMind AI. Saya adalah asisten akademik sosiologi Anda. Mari jelajahi dunia sosial, mulai dari teori asabiyah Ibnu Khaldun hingga fenomena masyarakat digital modern. Pilih jenjang materi Anda dan mari mulai belajar bersama.",
    en: "Hello! Welcome to SocioMind AI, your premier academic sociology assistant. Let's explore the social world, from Ibn Khaldun's foundational theories to the complexities of modern digital societies. Select your pathway and let's begin our inquiry.",
    ar: "أهلاً بكم في SocioMind AI. أنا مساعدكم الأكاديمي لعلم الاجتماع. لنستكشف معاً العالم الاجتماعي، من نظريات ابن خلدون التأسيسية إلى تعقيدات المجتمعات الرقمية الحديثة. اختر مسارك ولنبدأ رحلة التعلم."
  };

  const voices = {
    id: "Kore",
    en: "Zephyr",
    ar: "Charon"
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: introTexts[lang] }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voices[lang] },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS generation failed:", error);
    return undefined;
  }
};
