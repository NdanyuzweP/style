import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Users, Wallet, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role === 'admin') {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 px-4 py-2 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg transform scale-105'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;