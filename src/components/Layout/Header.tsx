import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P2P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">P2P Trading</h1>
              {user && (
                <p className="text-sm text-slate-600">
                  Welcome, <span className="font-medium text-indigo-600">{user.username}</span>
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    {user.role.toUpperCase()}
                  </span>
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">${user.walletBalance}</span>
              </div>
            )}
            
            {user?.role === 'admin' && (
              <button className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-white/50 transition-all duration-200">
                <Settings size={20} />
              </button>
            )}
            <button
              onClick={logout}
              className="p-2 text-slate-600 hover:text-red-600 rounded-lg hover:bg-white/50 transition-all duration-200"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;