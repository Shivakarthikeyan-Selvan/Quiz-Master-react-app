import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { Question } from '@/types/quiz';
import { getAllQuestions, updateQuestion, deleteQuestion, addQuestion, QUIZ_CATEGORIES } from '@/utils/quizData';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const ManageQuestions = () => {
  const { user, isHost } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    category: 'physics',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'medium',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isHost) {
      toast.error('Access denied. Host privileges required.');
      navigate('/');
      return;
    }

    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isHost]);

  const loadQuestions = async () => {
    const allQuestions = await getAllQuestions();
    setQuestions(allQuestions as any);
  };

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setEditForm({ ...question });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;

    if (!editForm.question || editForm.options.some(opt => !opt)) {
      toast.error('Please fill in all fields');
      return;
    }

    await updateQuestion(editForm.id!, editForm);
    toast.success('Question updated successfully');
    setEditingId(null);
    setEditForm(null);
    await loadQuestions();
  };

  const handleDelete = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await deleteQuestion(questionId);
      toast.success('Question deleted successfully');
      await loadQuestions();
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question || newQuestion.options.some(opt => !opt)) {
      toast.error('Please fill in all fields');
      return;
    }

    await addQuestion(newQuestion);
    toast.success('Question added successfully');
    setIsAdding(false);
    setNewQuestion({
      category: 'physics',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'medium',
    });
    await loadQuestions();
  };

  const groupedQuestions = QUIZ_CATEGORIES.map(cat => ({
    ...cat,
    questions: questions.filter(q => q.category === cat.id),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Questions</h1>
              <p className="text-muted-foreground">Add, edit, or delete quiz questions</p>
            </div>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-gradient-primary gap-2"
            >
              {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAdding ? 'Cancel' : 'Add Question'}
            </Button>
          </div>

          {/* Add New Question Form */}
          {isAdding && (
            <Card className="p-6 mb-8 shadow-elevated animate-scale-in">
              <h2 className="text-2xl font-bold mb-4">Add New Question</h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newQuestion.category}
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUIZ_CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={newQuestion.difficulty}
                      onValueChange={(value: any) => setNewQuestion({ ...newQuestion, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Question</Label>
                  <Input
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    placeholder="Enter your question"
                  />
                </div>

                {newQuestion.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Option {index + 1}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: newOptions });
                        }}
                        placeholder={`Enter option ${index + 1}`}
                      />
                      <Button
                        variant={newQuestion.correctAnswer === index ? 'default' : 'outline'}
                        onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                        className={newQuestion.correctAnswer === index ? 'bg-success' : ''}
                      >
                        {newQuestion.correctAnswer === index ? '✓ Correct' : 'Set Correct'}
                      </Button>
                    </div>
                  </div>
                ))}

                <Button onClick={handleAddQuestion} className="w-full bg-gradient-success">
                  <Save className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </Card>
          )}

          {/* Questions by Category */}
          <div className="space-y-8">
            {groupedQuestions.map(({ name, icon, id, questions: catQuestions }) => (
              catQuestions.length > 0 && (
                <div key={id}>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">{icon}</span>
                    {name} ({catQuestions.length} questions)
                  </h2>

                  <div className="space-y-4">
                    {catQuestions.map((question, index) => (
                      <Card key={question.id} className="p-6 shadow-card">
                        {editingId === question.id && editForm ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Question</Label>
                              <Input
                                value={editForm.question}
                                onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                              />
                            </div>

                            {editForm.options.map((option, optIndex) => (
                              <div key={optIndex} className="space-y-2">
                                <Label>Option {optIndex + 1}</Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...editForm.options];
                                      newOptions[optIndex] = e.target.value;
                                      setEditForm({ ...editForm, options: newOptions });
                                    }}
                                  />
                                  <Button
                                    variant={editForm.correctAnswer === optIndex ? 'default' : 'outline'}
                                    onClick={() => setEditForm({ ...editForm, correctAnswer: optIndex })}
                                    className={editForm.correctAnswer === optIndex ? 'bg-success' : ''}
                                  >
                                    {editForm.correctAnswer === optIndex ? '✓' : 'Set'}
                                  </Button>
                                </div>
                              </div>
                            ))}

                            <div className="flex gap-2">
                              <Button onClick={handleSaveEdit} className="flex-1 bg-gradient-success">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <div className="mb-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">Q{index + 1}. {question.question}</h3>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(question)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(question.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg border-2 ${
                                    optIndex === question.correctAnswer
                                      ? 'border-success bg-success/10'
                                      : 'border-border bg-muted'
                                  }`}
                                >
                                  <span className="font-medium">{String.fromCharCode(65 + optIndex)}. </span>
                                  {option}
                                  {optIndex === question.correctAnswer && (
                                    <span className="ml-2 text-success font-semibold">✓ Correct Answer</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageQuestions;
