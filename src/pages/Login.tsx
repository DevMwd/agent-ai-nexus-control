
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
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
        description: 'Welcome back!',
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

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send a password reset link
    setResetEmailSent(true);
    toast({
      title: 'Reset Link Sent',
      description: `Password reset instructions have been sent to ${resetEmail}`,
    });
    
    // Reset the form after 3 seconds
    setTimeout(() => {
      setResetEmailSent(false);
      setForgotPasswordOpen(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#e3eaf8]">
      <div className="mb-10 text-center">
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/lovable-uploads/695db59c-0b86-4a3f-afbe-6cf313ac93e5.png" 
            alt="BlueSky Logo" 
            className="h-28 mb-4" 
          />
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
              <button 
                type="button" 
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
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

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          
          {!resetEmailSent ? (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4 mt-4">
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  We'll send you a link to reset your password.
                </p>
              </div>
              
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Check your inbox</h3>
              <p className="text-gray-500 text-center">
                We've sent a password reset link to <span className="font-medium">{resetEmail}</span>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
