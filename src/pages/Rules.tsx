import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { QUIZ_CATEGORIES } from '@/utils/quizData';
import { CheckCircle, Clock, Trophy, Target } from 'lucide-react';
import { useEffect } from 'react';

const Rules = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const selectedCategory = localStorage.getItem('selectedCategory');
  const category = QUIZ_CATEGORIES.find(c => c.id === selectedCategory);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedCategory) {
      navigate('/categories');
    }
  }, [user, selectedCategory, navigate]);

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12 animate-fade-in">
            {category && (
              <>
                <div className="text-6xl mb-4">{category.icon}</div>
                <h1 className="text-4xl font-bold mb-4">{category.name} Quiz</h1>
                <p className="text-xl text-muted-foreground">{category.description}</p>
              </>
            )}
          </div>

          <Card className="p-8 mb-8 shadow-elevated animate-scale-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Quiz Rules & Instructions
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Total Questions</h3>
                  <p className="text-muted-foreground">
                    This quiz contains <strong>10 questions</strong> from the {category?.name} category
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Time Limit</h3>
                  <p className="text-muted-foreground">
                    You have <strong>10 seconds timer</strong> to answer each question. The timer will countdown visually.
                  </p>
                  <p className="text-sm text-warning mt-1">
                    ⚠️ Timer will flash red in the last 5 seconds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Scoring System</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong className="text-success">+1 point</strong> for each correct answer</li>
                    <li>• <strong className="text-error">0 points</strong> for incorrect answers</li>
                    <li>• No negative marking</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📋 Additional Guidelines:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ One question displayed at a time</li>
                  <li>✓ Four multiple choice options per question</li>
                  <li>✓ Instant feedback after selecting an answer</li>
                  <li>✓ Auto-advance when time runs out</li>
                  <li>✓ Progress tracker shows current question number</li>
                  <li>✓ Detailed results and analytics at the end</li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/categories')}
            >
              Back to Categories
            </Button>
            <Button
              size="lg"
              className="bg-gradient-primary shadow-glow"
              onClick={handleStartQuiz}
            >
              Start Quiz Now!
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rules;
