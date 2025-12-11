import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/quiz';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'host') => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isHost: boolean;
  loading: boolean;   // ⬅ added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// NORMALIZE USER
const normalizeUser = (u: any): User => ({
  id: u.id ?? '',
  name: u.name ?? '',
  email: u.email ?? '',
  password: u.password ?? '',
  role: u.role ?? 'user',
  totalQuizzes: u.totalQuizzes ?? 0,
  bestScore: u.bestScore ?? 0,
  averageScore: u.averageScore ?? 0,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ⬅ added
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // LOAD USER FROM SESSION STORAGE
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // ⬅ after checking sessionStorage
  }, []);

  // LOGIN
  const login = async (email: string, password: string, role: 'user' | 'host'): Promise<boolean> => {
    
    // HOST DEMO LOGIN
    if (role === 'host' && email === 'host@quiz.com' && password === 'host123') {
      const hostUser = normalizeUser({
        id: 'host-001',
        name: 'Quiz Admin',
        email,
        password,
        role: 'host',
      });
      setUser(hostUser);
      sessionStorage.setItem('currentUser', JSON.stringify(hostUser));
      return true;
    }

    // BACKEND LOGIN
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (!data.user) return false;

      const finalUser = normalizeUser(data.user);
      setUser(finalUser);
      sessionStorage.setItem('currentUser', JSON.stringify(finalUser));
      return true;

    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // SIGNUP
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) return false;

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        signup, 
        logout, 
        isHost: user?.role === 'host',
        loading     // ⬅ added
      }}
    >
      {!loading && children}   {/* ⬅ prevent redirect issue */}
    </AuthContext.Provider>
  );
};
