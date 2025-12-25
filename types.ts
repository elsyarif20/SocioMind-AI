
export type Language = 'en' | 'id' | 'ar';
export type Subject = 'sociology' | 'history' | 'economics' | 'biology';

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
  correctAnswers: number[];
  explanation: string;
  isMultiSelect?: boolean;
}

export type QuestionType = 'pg' | 'pg_tka' | 'uraian' | 'uraian_tka';

export interface CustomQuestion {
  type: QuestionType;
  content: string;
  options?: string[];
  answerKeys?: string[] | number[];
  deepExplanation: string;
}

export interface CaseStudy {
  title: string;
  scenario: string;
  analysisQuestions: string[];
  proposedSolutions?: string[];
}

export interface GlossaryTerm {
  term: string;
  category: 'theory' | 'method' | 'phenomenon' | 'structure';
  definition: Record<Language, string>;
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