import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { QUIZ_CATEGORIES } from '@/utils/quizData';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const Categories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCategorySelect = (categoryId: string) => {
    localStorage.setItem('selectedCategory', categoryId);
    navigate('/rules');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Page Heading */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Category
            </h1>
            <p className="text-xl text-muted-foreground">
              Select a quiz category to test your knowledge
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUIZ_CATEGORIES.map((category, index) => (
              <Card
                key={category.id}
                className="p-6 hover:shadow-elevated transition-all cursor-pointer group animate-scale-in border-2 hover:border-primary"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCategorySelect(category.id)}
              >
                
                {/* Icon */}
                <div className="text-6xl mb-4">{category.icon}</div>

                {/* Category Title */}
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.questionCount} questions
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    Start
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
