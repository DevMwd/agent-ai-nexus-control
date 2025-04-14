
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Activity, Cog, Clock, Database, User } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/agents', label: 'Agents', icon: <Activity className="w-5 h-5" /> },
    { path: '/services-llm', label: 'Services and LLM', icon: <Database className="w-5 h-5" /> },
    { path: '/admin', label: 'Admin panel', icon: <Cog className="w-5 h-5" /> },
    { path: '/session-logs', label: 'Session Logs', icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <header className="py-4 px-6 mx-auto my-4 max-w-[95%] rounded-full">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex flex-col items-center mr-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/01831893-d608-4d45-9158-c42712954af4.png" 
                alt="Action Logo" 
                className="h-12" 
              />
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500">Powered by</span>
              <img 
                src="/lovable-uploads/4b76f71e-b416-4608-a612-3a4715b5dde1.png" 
                alt="BlueSky Logo" 
                className="h-4 ml-1" 
              />
            </div>
          </Link>
        </div>
        
        <nav className="flex items-center justify-center">
          <div className="flex items-center rounded-full p-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-white shadow-sm text-indigo-900'
                    : 'text-gray-600 hover:text-indigo-900'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        
        <div>
          <Link to="/profile" className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm">
            <User className="w-6 h-6 text-indigo-900" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
