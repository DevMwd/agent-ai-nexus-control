
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
      toast({
        title: 'Login Successful',
        description: 'Welcome to Action AI Agent platform',
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#e3eaf8]">
      <div className="mb-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/lovable-uploads/4b76f71e-b416-4608-a612-3a4715b5dde1.png" 
            alt="BlueSky Logo" 
            className="h-16 mb-4" 
          />
          <h1 className="text-4xl font-bold text-action-primary mb-2">ACTION</h1>
          <p className="text-gray-600">AI Agent Management Platform</p>
          <p className="text-sm text-gray-500 mt-1">Powered by BlueSky</p>
        </div>
      </div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl"
            />
            <div className="mt-1 text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-action-primary hover:bg-opacity-90 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Sign in'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Demo login: <br />
            For base user: user@example.com (any password) <br />
            For admin: admin@example.com (any password) <br />
            For owner: owner@example.com (any password)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
