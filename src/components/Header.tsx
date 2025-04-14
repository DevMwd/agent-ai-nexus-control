
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Activity, Cog, Clock, Database, User } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/agents', label: 'Agents', icon: <Activity className="w-5 h-5" /> },
    { path: '/services-llm', label: 'Services & LLM', icon: <Database className="w-5 h-5" /> },
    { path: '/admin', label: 'Admin Panel', icon: <Cog className="w-5 h-5" /> },
    { path: '/session-logs', label: 'Session Logs', icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-white py-4 px-6 w-full flex justify-between items-center shadow-sm rounded-full mx-auto my-4 max-w-[95%]">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-action-primary font-bold text-2xl">ACTION</div>
          <div className="text-gray-500 text-sm">Powered by <span className="text-action-primary">BlueSky</span></div>
        </Link>
      </div>
      
      <nav className="flex justify-center flex-1 overflow-x-auto">
        <div className="flex items-center bg-action-light rounded-full p-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                location.pathname === item.path 
                  ? 'bg-white shadow-sm text-action-primary'
                  : 'text-gray-600 hover:text-action-primary'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      
      <div>
        <Link to="/profile" className="p-2 rounded-full bg-white">
          <User className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
