
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
    <header className="bg-white py-4 px-6 mx-auto my-4 max-w-[95%] rounded-full shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="text-indigo-900 font-bold text-2xl mr-2">ACTION</div>
            <div className="text-gray-500 text-xs">Powered by <span className="text-indigo-900">BlueSky</span></div>
          </Link>
        </div>
        
        <nav className="flex items-center justify-center">
          <div className="flex items-center bg-gray-100 rounded-full p-1">
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
          <Link to="/profile" className="p-2 rounded-full bg-white border border-gray-200">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
