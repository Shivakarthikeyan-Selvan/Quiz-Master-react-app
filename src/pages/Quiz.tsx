import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import Timer from '@/components/Timer';
import { getQuestionsByCategory } from '@/utils/quizData';
import { Question, QuizAnswer, QuizAttempt } from '@/types/quiz';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState(true);

  const selectedCategory = localStorage.getItem('selectedCategory');

  // Load quiz questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      if (!selectedCategory) {
        navigate('/categories');
        return;
      }

      setLoading(true);
      const categoryQuestions = await getQuestionsByCategory(selectedCategory);
      const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);

      setQuestions(shuffled.slice(0, 10)); // Pick 10 random
      setLoading(false);
    };

    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedCategory]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // --------------------------
  // SELECT ANSWER
  // --------------------------
  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const answer: QuizAnswer = {
      questionId: currentQuestion.id!,
      selectedAnswer: answerIndex,
      isCorrect,
      timeTaken,
    };

    setAnswers(prev => [...prev, answer]);
  };

  // --------------------------
  // NEXT QUESTION
  // --------------------------
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setStartTime(Date.now());
    } else {
      handleFinishQuiz();
    }
  };

  // --------------------------
  // TIME UP
  // --------------------------
  const handleTimeUp = () => {
    if (!isAnswered) {
      const answer: QuizAnswer = {
        questionId: currentQuestion.id!,
        selectedAnswer: -1,
        isCorrect: false,
        timeTaken: 30,
      };

      setAnswers(prev => [...prev, answer]);
      setIsAnswered(true);

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setIsAnswered(false);
          setStartTime(Date.now());
        } else {
          handleFinishQuiz();
        }
      }, 1000);
    }
  };

  // --------------------------
  // FINISH QUIZ
  // --------------------------
  const handleFinishQuiz = async () => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalTime = answers.reduce((sum, a) => sum + a.timeTaken, 0);
    const averageTime = answers.length
      ? Math.floor(totalTime / answers.length)
      : 0;

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      userId: user!.id,
      category: selectedCategory!,
      score: correctAnswers,
      totalQuestions: questions.length,
      correctAnswers,
      averageTime,
      date: new Date(),
      answers,
    };

    // Save attempt to backend
    try {
      await fetch('http://localhost:5000/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
      });
    } catch (err) {
      console.error("Failed to save attempt to backend:", err);
    }

    navigate('/result', { state: { attempt } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 max-w-3xl mx-auto px-4 space-y-6">
        <Progress value={progress} className="h-2" />

        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>

          <p className="text-lg font-medium mb-6">
            {currentQuestion.question}
          </p>

          <div className="grid gap-3">
            {currentQuestion.options.map((opt, index) => {
              const isCorrect = index === currentQuestion.correctAnswer;
              const isSelected = selectedAnswer === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={cn(
                    'border p-3 rounded-lg text-left transition-all',
                    'hover:bg-accent hover:shadow',
                    isAnswered && isCorrect && 'bg-green-200 border-green-600',
                    isAnswered &&
                      isSelected &&
                      !isCorrect &&
                      'bg-red-200 border-red-600'
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Timer 
            key={currentQuestionIndex}
            isActive={!isAnswered}   // Timer runs until an answer is submitted//
            onTimeUp={handleTimeUp}
/>

            {isAnswered && (
              <Button onClick={handleNext} className="ml-auto">
                {currentQuestionIndex === questions.length - 1
                  ? 'Finish'
                  : 'Next'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
