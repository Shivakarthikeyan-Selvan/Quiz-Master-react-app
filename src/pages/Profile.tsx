import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { QuizAttempt } from '@/types/quiz';
import { Trophy, Target, Clock, TrendingUp, Calendar, Award } from 'lucide-react';
import { QUIZ_CATEGORIES } from '@/utils/quizData';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const allAttempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    const userAttempts = allAttempts
      .filter((a: QuizAttempt) => a.userId === user.id)
      .sort((a: QuizAttempt, b: QuizAttempt) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    setAttempts(userAttempts);
  }, [user, navigate]);

  if (!user) return null;

  const categoryStats = QUIZ_CATEGORIES.map(cat => {
    const catAttempts = attempts.filter(a => a.category === cat.id);
    const totalScore = catAttempts.reduce((sum, a) => sum + a.score, 0);
    const avgScore = catAttempts.length > 0 ? Math.round((totalScore / catAttempts.length)) : 0;
    
    return {
      ...cat,
      attempts: catAttempts.length,
      avgScore,
    };
  }).filter(stat => stat.attempts > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Profile Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow mx-auto">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-elevated transition-all animate-scale-in">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{user.totalQuizzes || 0}</p>
              <p className="text-sm text-muted-foreground">Total Quizzes</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elevated transition-all animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <Target className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-3xl font-bold">{user.bestScore || 0}</p>
              <p className="text-sm text-muted-foreground">Best Score</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elevated transition-all animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-3xl font-bold">{user.averageScore || 0}</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elevated transition-all animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <Award className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-3xl font-bold">
                {attempts.length > 0 ? Math.round((attempts.reduce((sum, a) => sum + a.score, 0) / attempts.reduce((sum, a) => sum + a.totalQuestions, 0)) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Overall Accuracy</p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Category Performance */}
            <Card className="p-6 shadow-elevated">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Category Performance
              </h2>

              {categoryStats.length > 0 ? (
                <div className="space-y-4">
                  {categoryStats.map(stat => (
                    <div key={stat.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{stat.icon}</span>
                          <span className="font-semibold">{stat.name}</span>
                        </div>
                        <span className="text-lg font-bold">{stat.avgScore}/10</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{stat.attempts} attempts</span>
                        <span>{Math.round((stat.avgScore / 10) * 100)}% accuracy</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No quiz attempts yet</p>
                  <Button onClick={() => navigate('/categories')} className="bg-gradient-primary">
                    Start Your First Quiz
                  </Button>
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 shadow-elevated">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Recent Activity
              </h2>

              {attempts.length > 0 ? (
                <div className="space-y-4">
                  {attempts.slice(0, 5).map((attempt) => {
                    const category = QUIZ_CATEGORIES.find(c => c.id === attempt.category);
                    const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                    
                    return (
                      <div key={attempt.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{category?.icon}</span>
                            <span className="font-semibold">{category?.name}</span>
                          </div>
                          <span className="text-lg font-bold text-primary">{percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(attempt.date).toLocaleDateString()}</span>
                          </div>
                          <span>{attempt.score}/{attempt.totalQuestions} correct</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </Card>
          </div>

          {/* Action Button */}
          <div className="mt-12 text-center">
            <Button
              onClick={() => navigate('/categories')}
              size="lg"
              className="bg-gradient-primary shadow-glow"
            >
              Take Another Quiz
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
