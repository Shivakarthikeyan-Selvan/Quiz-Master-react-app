import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { QuizAttempt } from '@/types/quiz';
import { Trophy, Clock, Target, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { useEffect } from 'react';

const Result = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = location.state?.attempt as QuizAttempt;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!attempt) {
      navigate('/categories');
    }
  }, [user, attempt, navigate]);

  if (!attempt) {
    return null;
  }

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const incorrectAnswers = attempt.totalQuestions - attempt.correctAnswers;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Score Card */}
          <Card className="p-8 mb-8 text-center shadow-elevated animate-bounce-in">
            <div className="inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-success flex items-center justify-center shadow-glow mx-auto">
                <Trophy className="w-12 h-12 text-success-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground mb-6">Great job on finishing the quiz</p>
            
            <div className="text-7xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              {percentage}%
            </div>
            
            <p className="text-2xl font-semibold mb-8">
              You scored {attempt.score} out of {attempt.totalQuestions}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-muted p-4 rounded-xl">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold">{attempt.correctAnswers}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              
              <div className="bg-muted p-4 rounded-xl">
                <XCircle className="w-8 h-8 text-error mx-auto mb-2" />
                <p className="text-2xl font-bold">{incorrectAnswers}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              
              <div className="bg-muted p-4 rounded-xl">
                <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">{attempt.averageTime}s</p>
                <p className="text-sm text-muted-foreground">Avg Time</p>
              </div>
            </div>
          </Card>

          {/* Performance Analysis */}
          <Card className="p-8 mb-8 shadow-elevated animate-scale-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Performance Analysis
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Accuracy</span>
                <span className="text-2xl font-bold">{percentage}%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Total Time</span>
                <span className="text-2xl font-bold">
                  {Math.floor(attempt.answers.reduce((sum, a) => sum + a.timeTaken, 0) / 60)}m{' '}
                  {attempt.answers.reduce((sum, a) => sum + a.timeTaken, 0) % 60}s
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Fastest Answer</span>
                <span className="text-2xl font-bold">
                  {Math.min(...attempt.answers.map(a => a.timeTaken))}s
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Slowest Answer</span>
                <span className="text-2xl font-bold">
                  {Math.max(...attempt.answers.map(a => a.timeTaken))}s
                </span>
              </div>
            </div>
          </Card>

          {/* Performance Message */}
          <Card className="p-6 mb-8 bg-gradient-hero text-white animate-fade-in">
            <p className="text-xl font-semibold text-center">
              {percentage >= 90 ? '🌟 Outstanding! You\'re a quiz master!' :
               percentage >= 70 ? '🎉 Great job! Keep up the good work!' :
               percentage >= 50 ? '👍 Good effort! Practice makes perfect!' :
               '💪 Keep learning! You\'ll do better next time!'}
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Button>
            
            <Button
              onClick={() => navigate('/categories')}
              size="lg"
              className="gap-2 bg-gradient-primary"
            >
              <RotateCcw className="w-5 h-5" />
              Try Another Quiz
            </Button>
            
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              size="lg"
            >
              View Profile
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;
