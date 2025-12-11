import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { LogIn, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [hostPassword, setHostPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

// inside Login.tsx
const handleUserLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!userEmail || !userPassword) { toast.error('Please fill in all fields'); return; }

  const ok = await login(userEmail, userPassword, 'user');
  if (ok) {
    toast.success('Login successful!');
    navigate('/categories');
  } else {
    toast.error('Invalid email or password');
  }
};

const handleHostLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!hostEmail || !hostPassword) { toast.error('Please fill in all fields'); return; }

  const ok = await login(hostEmail, hostPassword, 'host');
  if (ok) {
    toast.success('Host login successful!');
    navigate('/manage-questions');
  } else {
    toast.error('Invalid host credentials');
  }
};


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mx-auto">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground">Login to continue your quiz journey</p>
          </div>

          <Card className="p-6 shadow-elevated animate-scale-in">
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user" className="gap-2">
                  <User className="w-4 h-4" />
                  User
                </TabsTrigger>
                <TabsTrigger value="host" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Host
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="john@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      placeholder="••••••••"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary">
                    Login as User
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="host">
                <form onSubmit={handleHostLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="host-email">Host Email</Label>
                    <Input
                      id="host-email"
                      type="email"
                      placeholder="host@example.com"
                      value={hostEmail}
                      onChange={(e) => setHostEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="host-password">Host Password</Label>
                    <Input
                      id="host-password"
                      type="password"
                      placeholder="••••••••"
                      value={hostPassword}
                      onChange={(e) => setHostPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-secondary">
                    Login as Host
                  </Button>

                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Demo Host Credentials:</strong><br />
                      Email: host@quiz.com<br />
                      Password: host123
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;