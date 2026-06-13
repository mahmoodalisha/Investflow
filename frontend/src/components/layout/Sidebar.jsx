import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  WalletCards, 
  TrendingUp, 
  Users, 
  GitBranch, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Investments', path: '/investments', icon: <WalletCards size={20} /> },
    { name: 'ROI History', path: '/roi-history', icon: <TrendingUp size={20} /> },
    { name: 'Referral Income', path: '/referral-income', icon: <Users size={20} /> },
    { name: 'Referral Tree', path: '/referral-tree', icon: <GitBranch size={20} /> },
  ];

  const bottomLinks = [
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    navigate('/login');
  };

  return (
    <div className="w-sidebar h-screen bg-navy text-white fixed left-0 top-0 flex flex-col shadow-xl z-50">
      {/* Brand Section */}
      <div className="h-navbar flex items-center px-6 border-b border-white/10">
        <div className="w-8 h-8 bg-action rounded-lg flex items-center justify-center mr-3 font-bold text-lg">
          N
        </div>
        <span className="font-bold text-xl tracking-wide">NexaChain</span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <p className="text-mutedText text-xs uppercase font-bold tracking-wider mb-2 px-2">Menu</p>
        
        {navLinks.map((link) => {
          const isActive = location.pathname.includes(link.path);
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-white border-l-4 border-action' 
                  : 'text-mutedText hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 flex flex-col gap-2">
        {bottomLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-mutedText hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-danger hover:bg-danger/10 transition-all duration-200 text-left w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;