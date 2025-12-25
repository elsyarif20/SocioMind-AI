
export type Language = 'en' | 'id' | 'ar';

export interface Concept {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswers: number[]; // Berubah menjadi array untuk mendukung multi-jawaban
  explanation: string;
  isMultiSelect?: boolean; // Flag untuk UI
}

export type QuestionType = 'pg' | 'pg_tka' | 'uraian' | 'uraian_tka';

export interface CustomQuestion {
  type: QuestionType;
  content: string; // Narasi/Pertanyaan
  options?: string[]; // Untuk PG
  answerKeys?: string[] | number[]; // Berubah menjadi plural untuk mendukung multi-jawaban
  deepExplanation: string; // Analisis sosiologis mendalam
}

export interface CaseStudy {
  title: string;
  scenario: string;
  analysisQuestions: string[];
  proposedSolutions?: string[];
}

export interface AnalysisResult {
  category: string;
  value: number;
  label: string;
}

export interface GlossaryTerm {
  term: string;
  definition: Record<Language, string>;
  category: 'theory' | 'method' | 'phenomenon' | 'structure';
}

export enum View {
  HOME = 'home',
  LEARN = 'learn',
  QUIZ = 'quiz',
  CASES = 'cases',
  LAB = 'lab',
  GLOSSARY = 'glossary',
  CREATOR = 'creator'
}
