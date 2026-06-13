import React, { useState, useEffect } from 'react';
import { Search, Bell, Wallet } from 'lucide-react';
import api from '../../utils/api';

const Navbar = () => {
  const [fullName, setFullName] = useState('Investor');
  const [walletBalance, setWalletBalance] = useState(0);

  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const storedName = localStorage.getItem('fullName');
    if (storedName) {
      setFullName(storedName);
    }

    // 2. Fetch the live wallet balance from the backend
    const fetchBalance = async () => {
      try {
        const res = await api.get('/dashboard');
        setWalletBalance(res.data.walletBalance);
      } catch (error) {
        console.error("Failed to fetch wallet balance for Navbar");
      }
    };

    fetchBalance();
  }, []);

  // Helper function to extract initials for the avatar
  const getInitials = (name) => {
    if (!name) return "NX";
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-navbar bg-white border-b border-borderTint ml-sidebar fixed top-0 right-0 left-0 z-40 px-6 flex items-center justify-between">
      
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-mutedText" size={18} />
          <input 
            type="text" 
            placeholder="Search investments, users, transactions..." 
            className="w-full bg-canvas border border-borderTint rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all"
          />
        </div>
      </div>

      {/* Right: Metrics & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Date Display */}
        <div className="hidden md:block text-sm font-medium text-secondaryText">
          {today}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-borderTint"></div>

        {/* LIVE Wallet Balance Tag */}
        <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-lg border border-success/20">
          <Wallet size={16} />
          <span className="text-sm font-bold">₹{walletBalance}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer p-2 hover:bg-canvas rounded-full transition-colors">
          <Bell size={20} className="text-secondaryText" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
        </div>

        {/* DYNAMIC Profile Grouping */}
        <div className="flex items-center gap-3 cursor-pointer pl-2 border-l border-borderTint">
          <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm">
            {getInitials(fullName)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-primaryText leading-tight">{fullName}</p>
            <p className="text-xs text-secondaryText">Network Investor</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Navbar;