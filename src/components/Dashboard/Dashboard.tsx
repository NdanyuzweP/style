import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/wallets';
import { taskService } from '../../services/tasks';
import type { Wallet, Task } from '../../types';
import { DollarSign, TrendingUp, CheckSquare, Star, ArrowRight, Zap, Gift, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [walletsData, tasksData] = await Promise.all([
          walletService.getWallets(),
          taskService.getTasks(),
        ]);
        setWallets(walletsData.wallets);
        setTasks(tasksData.tasks.filter(task => task.isActive).slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const activeTasks = tasks.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 gradient-primary rounded-2xl pulse-glow flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Welcome Section */}
      <div className="text-center space-mobile-4">
        <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-mobile-lg float-animation">
          <span className="text-white font-bold text-2xl">👋</span>
        </div>
        <h1 className="text-mobile-2xl font-bold gradient-text mb-2">Welcome Back!</h1>
        <p className="text-slate-600 text-mobile-sm">
          Hello <span className="font-bold text-indigo-600">{user?.username}</span>, ready to trade today?
        </p>
      </div>

      {/* Main Balance Card */}
      <div className="glass-card rounded-3xl p-6 card-mobile shadow-mobile-lg">
        <div className="text-center">
          <p className="text-slate-600 text-mobile-sm mb-2">Total Portfolio Value</p>
          <h2 className="text-mobile-3xl font-bold text-slate-900 mb-4">${user?.walletBalance || '0.00'}</h2>
          <div className="flex justify-center space-x-4 text-mobile-xs">
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              +2.5% Today
            </div>
            <div className="flex items-center text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              +15.3% Month
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-mobile-2 gap-4">
        <div className="glass-card rounded-2xl p-4 card-mobile shadow-mobile">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-mobile-xs font-medium text-slate-600 mb-1">Total Earned</p>
              <p className="text-mobile-lg font-bold text-slate-900">${totalBalance.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 gradient-success rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 card-mobile shadow-mobile">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-mobile-xs font-medium text-slate-600 mb-1">Active Tasks</p>
              <p className="text-mobile-lg font-bold text-slate-900">{activeTasks}</p>
            </div>
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-3xl p-6 shadow-mobile-lg">
        <h3 className="text-mobile-lg font-bold text-slate-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 text-yellow-500 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-mobile-2 gap-3">
          {[
            { label: 'Deposit', color: 'gradient-success', icon: '💰' },
            { label: 'Trade', color: 'gradient-primary', icon: '📈' },
            { label: 'Tasks', color: 'gradient-purple', icon: '✅' },
            { label: 'Invite', color: 'gradient-orange', icon: '👥' },
          ].map((action, index) => (
            <button
              key={index}
              className={`p-4 ${action.color} rounded-2xl text-white font-medium btn-mobile ripple shadow-mobile`}
            >
              <div className="text-mobile-lg mb-1">{action.icon}</div>
              <div className="text-mobile-xs">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Tasks */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-mobile-lg">
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <h3 className="text-mobile-lg font-bold text-slate-900 flex items-center">
              <Target className="h-5 w-5 text-indigo-500 mr-2" />
              Available Tasks
            </h3>
            <button className="text-indigo-600 hover:text-indigo-700 font-medium text-mobile-xs flex items-center ripple">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200/50 card-mobile">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-mobile-sm mb-1">{task.title}</h4>
                      <p className="text-mobile-xs text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-mobile-xs font-medium bg-indigo-100 text-indigo-800 rounded-lg">
                          {task.taskType}
                        </span>
                        <span className="text-mobile-xs font-bold text-green-600 flex items-center">
                          <Gift className="h-3 w-3 mr-1" />
                          +{task.rewardAmount} {task.rewardCurrency?.symbol}
                        </span>
                      </div>
                    </div>
                    <button className="ml-3 px-4 py-2 gradient-primary text-white rounded-xl font-medium text-mobile-xs btn-mobile ripple">
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-slate-500 text-mobile-base font-medium">No active tasks</p>
              <p className="text-slate-400 text-mobile-xs mt-1">Check back later for new opportunities</p>
            </div>
          )}
        </div>
      </div>

      {/* Wallets Overview */}
      {wallets.length > 0 && (
        <div className="glass-card rounded-3xl overflow-hidden shadow-mobile-lg">
          <div className="p-6 border-b border-slate-200/50">
            <h3 className="text-mobile-lg font-bold text-slate-900 flex items-center">
              <Wallet className="h-5 w-5 text-green-500 mr-2" />
              My Wallets
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="p-4 bg-gradient-to-r from-white to-slate-50 rounded-2xl border border-slate-200/50 card-mobile">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-mobile-xs">
                          {wallet.currency?.symbol?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-mobile-sm">{wallet.currency?.name}</h4>
                        <p className="text-mobile-xs text-slate-600">{wallet.currency?.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-mobile-sm">{wallet.balance}</p>
                      {wallet.frozenBalance > 0 && (
                        <p className="text-mobile-xs text-orange-600">
                          Frozen: {wallet.frozenBalance}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;