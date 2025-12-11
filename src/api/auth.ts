import { apiRequest } from "./api";

export const signupUser = (name: string, email: string, password: string) =>
  apiRequest("/api/auth/signup", "POST", { name, email, password });

export const loginUser = (email: string, password: string) =>
  apiRequest("/api/auth/login", "POST", { email, password });
