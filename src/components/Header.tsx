
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Activity, Cog, Clock, User, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isAuthenticated) return null;

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/agents', label: 'Agents', icon: <Activity className="w-5 h-5" /> },
    { path: '/services-llm', label: 'Services and LLM', icon: <Cog className="w-5 h-5" /> },
    { path: '/admin', label: 'Admin panel', icon: <Cog className="w-5 h-5" /> },
    { path: '/session-logs', label: 'Session Logs', icon: <Clock className="w-5 h-5" /> },
  ];

  const renderNavItems = (onItemClick?: () => void) => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
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
    </>
  );

  // Mobile navigation
  if (isMobile) {
    return (
      <header className="flex justify-between items-center py-3 bg-[#e3eaf8] w-full px-4">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/a2223f4d-ac62-4db3-b61f-6c61a7f3beab.png" 
            alt="BlueSky Agent AI Logo" 
            className="h-12"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            to="/profile" 
            className="p-2 h-10 w-10 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center"
          >
            <User className="w-5 h-5 text-indigo-900" />
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 h-10 w-10 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center">
                <Menu className="w-5 h-5 text-indigo-900" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 max-w-[80vw]">
              <div className="bg-[#e3eaf8] flex flex-col h-full pt-6">
                <div className="flex flex-col items-start px-4 space-y-2">
                  {renderNavItems()}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  // Desktop navigation
  return (
    <header className="flex justify-center items-center py-4 bg-[#e3eaf8] w-full">
      <div className="container flex items-center justify-between px-6 max-w-6xl">
        <div className="flex items-center lg:-ml-16 md:ml-0">
          <img 
            src="/lovable-uploads/a2223f4d-ac62-4db3-b61f-6c61a7f3beab.png" 
            alt="BlueSky Agent AI Logo" 
            className="h-16 md:h-20"
          />
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="bg-white rounded-full px-2 md:px-6 py-1.5 shadow-md flex flex-wrap justify-center max-w-4xl w-full mt-2">
            {renderNavItems()}
          </nav>
        </div>
        
        <div className="pr-0">
          <Link 
            to="/profile" 
            className="p-2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center"
          >
            <User className="w-5 h-5 md:w-6 md:h-6 text-indigo-900" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
