
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Activity, Cog, Clock, User, Menu, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin, isOwner } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  // Only show nav items based on user role
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" />, roles: ['base', 'admin', 'owner'] },
    { path: '/agents', label: 'Agents', icon: <Activity className="w-5 h-5" />, roles: ['base', 'admin', 'owner'] },
    // Only show Services and LLM to admin and owner
    { path: '/services-llm', label: 'Services and LLM', icon: <Cog className="w-5 h-5" />, roles: ['admin', 'owner'] },
    // Only show Admin panel to admin and owner
    { path: '/admin', label: 'Admin panel', icon: <Cog className="w-5 h-5" />, roles: ['admin', 'owner'] },
    { path: '/session-logs', label: 'Session Logs', icon: <Clock className="w-5 h-5" />, roles: ['base', 'admin', 'owner'] },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  // Get first letter of user's name for avatar fallback
  const getInitials = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : user?.username.charAt(0).toUpperCase() || 'U';
  };

  const renderNavItems = (onItemClick?: () => void) => (
    <>
      {filteredNavItems.map((item) => {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 h-10 w-10 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage} alt={user?.name || user?.username} />
                  <AvatarFallback className="bg-indigo-200 text-indigo-900">{getInitials()}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center">
                <Avatar className="h-9 w-9 md:h-10 md:w-10">
                  <AvatarImage src={user?.profileImage} alt={user?.name || user?.username} />
                  <AvatarFallback className="bg-indigo-200 text-indigo-900">{getInitials()}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
