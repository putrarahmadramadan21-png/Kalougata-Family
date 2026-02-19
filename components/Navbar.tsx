
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Users, Home, UserPlus, ShieldCheck, LogIn, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('klg_session');
    if (session) {
      const user = JSON.parse(session);
      setIsLoggedIn(true);
      setMemberId(user.id);
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/leaderboard', label: 'Rank', icon: Trophy },
    { path: '/members', label: 'Keluarga', icon: Users },
    { path: '/scan', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="hidden md:flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg">
              <Users className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-sport text-2xl tracking-wider text-amber-400">KALOUGATA <span className="text-white">FAMILY</span></span>
          </Link>

          <div className="flex flex-1 md:flex-initial justify-around items-center h-full gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1 rounded-lg transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] md:text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
            
            {isLoggedIn ? (
              <Link
                to={`/profile/${memberId}`}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1 rounded-lg transition-colors ${
                  location.pathname.includes('/profile') ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] md:text-sm font-semibold">Profil</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1 rounded-lg transition-colors ${
                  location.pathname === '/login' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-5 h-5" />
                <span className="text-[10px] md:text-sm font-semibold">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
