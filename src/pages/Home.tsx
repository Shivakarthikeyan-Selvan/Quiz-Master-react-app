import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { Trophy, Brain, Clock, Target, Users, Award } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow mx-auto animate-bounce-in">
                <Trophy className="w-14 h-14 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Welcome to QuizMaster
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Test your knowledge across multiple categories and compete with others!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/categories">
                    <Button size="lg" className="bg-gradient-primary shadow-glow hover:shadow-elevated transition-all">
                      Start Quiz
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button size="lg" variant="outline">
                      View Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="bg-gradient-primary shadow-glow hover:shadow-elevated transition-all">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="lg" variant="outline">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-elevated transition-all animate-scale-in border-2 hover:border-primary">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create your account and choose your quiz categories to get started.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-elevated transition-all animate-scale-in border-2 hover:border-primary" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Take Quiz</h3>
                <p className="text-muted-foreground">
                  Answer timed questions from various categories and test your knowledge.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-elevated transition-all animate-scale-in border-2 hover:border-primary" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-success-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Get Results</h3>
                <p className="text-muted-foreground">
                  View detailed analytics and track your performance over time.
                </p>
              </Card>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Timed Questions</h3>
                  <p className="text-sm text-muted-foreground">10 seconds per question with visual countdown</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary transition-all">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Multiple Categories</h3>
                  <p className="text-sm text-muted-foreground">Physics, Math, Science, History & more</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary transition-all">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">Compete with other players worldwide</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary transition-all">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instant Feedback</h3>
                  <p className="text-sm text-muted-foreground">See correct answers immediately</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary transition-all">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Performance Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track your progress and improvement</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary transition-all">
                <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-error" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Host Mode</h3>
                  <p className="text-sm text-muted-foreground">Manage and create quiz questions</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          {!user && (
            <section className="text-center bg-gradient-hero rounded-2xl p-12 shadow-glow animate-pulse-glow">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Test Your Knowledge?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of quiz enthusiasts and start your learning journey today!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
