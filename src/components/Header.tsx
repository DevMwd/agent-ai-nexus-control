
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
    <header className="flex justify-center items-center py-6 bg-[#e3eaf8] w-full">
      <div className="container flex items-center justify-between max-w-6xl px-4">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/5ad87de6-d908-46b1-8423-928baae021c6.png" 
            alt="Action Logo" 
            className="h-10 mr-2" 
          />
          <span className="text-xs text-gray-600">Powered by BlueSky</span>
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="bg-white rounded-full px-4 py-2 shadow-md flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors mx-1
                    ${isActive 
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div>
          <Link 
            to="/profile" 
            className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center"
          >
            <User className="w-5 h-5 text-indigo-900" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
