
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';
import Home from './pages/Home';
import Index from './pages/Index';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Agents from './pages/Agents';
import AgentDetails from './pages/AgentDetails';
import AgentEdit from './pages/AgentEdit';
import AgentChat from './pages/AgentChat';
import ServicesLLM from './pages/ServicesLLM';
import SessionLogs from './pages/SessionLogs';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import { AgentProvider } from './contexts/AgentContext';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <Header />
      <main className="container mx-auto">{children}</main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AgentProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/agents" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Agents />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/agents/:id" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AgentDetails />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/agents/:id/edit" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AgentEdit />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/agents/:id/chat" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AgentChat />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/services-llm" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <ServicesLLM />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <AdminPanel />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/session-logs" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <SessionLogs />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <RequireAuth>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </RequireAuth>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AgentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
