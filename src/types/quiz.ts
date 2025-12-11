export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  userId: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  averageTime: number;
  date: Date;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'host';
  totalQuizzes: number;
  bestScore: number;
  averageScore: number;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
}
