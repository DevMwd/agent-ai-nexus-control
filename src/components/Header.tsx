
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
      <div className="container flex items-center justify-between px-6 max-w-6xl">
        <div className="flex items-center -ml-16">
          <img 
            src="/lovable-uploads/a2223f4d-ac62-4db3-b61f-6c61a7f3beab.png" 
            alt="BlueSky Agent AI Logo" 
            className="h-16" // Increased from h-10 to h-16
          />
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="bg-white rounded-full px-8 py-1.5 shadow-md flex justify-center max-w-4xl w-full mt-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors mx-1
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
        
        <div className="pr-0">
          <Link 
            to="/profile" 
            className="p-4 h-16 w-16 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center"
          >
            <User className="w-8 h-8 text-indigo-900" /> {/* Increased icon size from w-6 h-6 to w-8 h-8 */}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

