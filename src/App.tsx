import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Home from "./pages/Home";
import Footer from "@/components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Categories from "./pages/Categories";
import Rules from "./pages/Rules";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import ManageQuestions from "./pages/ManageQuestions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const InitializeApp = () => {
  useEffect(() => {
    ;
    
    // Create demo host account if it doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hostExists = users.some((u: any) => u.email === 'host@quiz.com');
    
    if (!hostExists) {
      users.push({
        id: 'host-demo',
        name: 'Quiz Host',
        email: 'host@quiz.com',
        password: 'host123',
        role: 'Main host',
        totalQuizzes: 0,
        bestScore: 0,
        averageScore: 0,
      });
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InitializeApp />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manage-questions" element={<ManageQuestions />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);


export default App;
