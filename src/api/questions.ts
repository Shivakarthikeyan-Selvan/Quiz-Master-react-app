import { apiRequest } from "./api";

export const addQuestion = (category: string, question: string, options: string[], answer: string) =>
  apiRequest("/api/questions/add", "POST", { category, question, options, answer });

export const getQuestions = () =>
  apiRequest("/api/questions/all", "GET");
