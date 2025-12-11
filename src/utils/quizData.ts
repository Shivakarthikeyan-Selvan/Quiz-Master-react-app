// src/data/quizData.ts
import { Question } from "@/types/quiz";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ---------------------------------------------
// NORMALIZE FUNCTION – FIXED
// ---------------------------------------------
const normalize = (q: any): Question => {
  return {
    id: q._id || q.id, // backend uses _id, frontend uses id
    category: q.category ?? "",
    question: q.question ?? "",
    options: Array.isArray(q.options) ? q.options : [],
    correctAnswer: Number(q.correctAnswer) || 0, // force number always
    difficulty: q.difficulty || "medium",
  };
};

// ---------------------------------------------
// UPDATE QUESTION
// ---------------------------------------------
export const updateQuestion = async (id: string, question: Question): Promise<boolean> => {
  try {
    const response = await fetch(`${API}/api/questions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...question,
        correctAnswer: Number(question.correctAnswer),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating question:", error);
    return false;
  }
};

// ---------------------------------------------
// GET ALL QUESTIONS
// ---------------------------------------------

export const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch(`${API}/api/questions`);
    const data = await response.json();

    if (!Array.isArray(data)) return [];

    return data.map(normalize); // normalize here completely
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

// ---------------------------------------------
// GET QUESTIONS BY CATEGORY
// ---------------------------------------------
export const getQuestionsByCategory = async (
  category: string
): Promise<Question[]> => {
  try {
    const response = await fetch(`${API}/api/questions/${category}`);
    const data = await response.json();

    if (!Array.isArray(data)) return [];

    return data.map(normalize);
  } catch (error) {
    console.error(`Error fetching ${category} questions:`, error);
    return [];
  }
};

// ---------------------------------------------
// ADD NEW QUESTION
// ---------------------------------------------
export const addQuestion = async (question: Question): Promise<boolean> => {
  try {
    const response = await fetch(`${API}/api/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...question,
        correctAnswer: Number(question.correctAnswer), // force number
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error adding question:", error);
    return false;
  }
};

// ---------------------------------------------
// DELETE A QUESTION
// ---------------------------------------------
export const deleteQuestion = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API}/api/questions/${id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting question:", error);
    return false;
  }
};

export const QUIZ_CATEGORIES = [
  { id: "physics", name: "Physics" ,description: 'Test your knowledge of physical laws and phenomena',
 icon: '⚡',questionCount: 10},
  { id: "mathematics", name: "Mathematics",    description: 'Challenge your mathematical problem-solving skills',icon: '🔢',questionCount: 10, },
  { id: "current-affairs", name: "Current Affairs",description: 'Stay updated with recent events and news',icon: '📰',questionCount: 10, },
  { id: "general-knowledge", name: "General Knowledge ",description: 'Test your overall knowledge across various topics',icon: '🧠',questionCount: 10 },
  { id: "science", name: "Science",    description: 'Explore scientific concepts and discoveries',icon: '🔬',questionCount: 10 },
  { id: "history", name: "History",    description: 'Journey through historical events and civilizations',icon: '📜',questionCount: 10,}, 
];