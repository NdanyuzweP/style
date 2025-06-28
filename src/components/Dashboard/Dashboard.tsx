import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/wallets';
import { taskService } from '../../services/tasks';
import { Wallet, Task } from '../../types';
import { DollarSign, TrendingUp, CheckSquare, Star, ArrowRight } from 'lucide-react';

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
        setTasks(tasksData.tasks.filter(task => task.isActive).slice(0, 5));
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
        <div className="w-12 h-12 gradient-primary rounded-full pulse-glow flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back!</h1>
        <p className="text-slate-600 text-lg">
          Hello <span className="font-semibold text-indigo-600">{user?.username}</span>, ready to trade today?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-slate-900">${user?.walletBalance || '0.00'}</p>
              <p className="text-xs text-green-600 mt-1">+2.5% from last week</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-slate-900">${totalBalance.toFixed(2)}</p>
              <p className="text-xs text-blue-600 mt-1">+15.3% this month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Active Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{activeTasks}</p>
              <p className="text-xs text-purple-600 mt-1">3 new today</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
          <Star className="h-5 w-5 text-yellow-500 mr-2" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Deposit Funds', color: 'from-green-400 to-emerald-500', icon: '💰' },
            { label: 'Start Trading', color: 'from-blue-400 to-indigo-500', icon: '📈' },
            { label: 'Complete Tasks', color: 'from-purple-400 to-pink-500', icon: '✅' },
            { label: 'Invite Friends', color: 'from-orange-400 to-red-500', icon: '👥' },
          ].map((action, index) => (
            <button
              key={index}
              className={`p-4 bg-gradient-to-r ${action.color} rounded-xl text-white font-medium btn-hover-scale`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Available Tasks</h2>
            <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200/50 hover:shadow-md transition-all duration-300">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                        {task.taskType}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +{task.rewardAmount} {task.rewardCurrency?.symbol}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium btn-hover-scale">
                    Start
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-slate-500 text-lg font-medium">No active tasks available</p>
              <p className="text-slate-400 text-sm mt-1">Check back later for new opportunities</p>
            </div>
          )}
        </div>
      </div>

      {/* Wallets Overview */}
      {wallets.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50">
            <h2 className="text-xl font-bold text-slate-900">Wallet Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-200/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-slate-900">{wallet.currency?.name}</h3>
                      <p className="text-sm text-slate-600">{wallet.currency?.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-lg">{wallet.balance}</p>
                      {wallet.frozenBalance > 0 && (
                        <p className="text-sm text-orange-600">
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