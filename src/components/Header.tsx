
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Activity, Cog, Clock, User } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/agents', label: 'Agents', icon: <Activity className="w-5 h-5" /> },
    { path: '/services-llm', label: 'Services and LLM', icon: <Cog className="w-5 h-5" /> },
    { path: '/admin', label: 'Admin panel', icon: <Cog className="w-5 h-5" /> },
    { path: '/session-logs', label: 'Session Logs', icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <header className="flex justify-center items-center py-4 bg-[#e3eaf8] w-full">
      <div className="container flex items-center justify-between max-w-6xl">
        <nav className="flex-1 flex justify-center">
          <div className="bg-white rounded-full p-1.5 shadow-sm">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-indigo-700'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="ml-4">
          <Link 
            to="/profile" 
            className="p-3 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center"
          >
            <User className="w-5 h-5 text-indigo-900" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
