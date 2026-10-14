import React from 'react';
import { PieChart, Factory, Zap, GitBranch, BookOpen } from 'lucide-react';

export type ActiveTab = 'demand' | 'plant' | 'pump' | 'pipe' | 'ref';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pipeAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pipeAlertCount
}) => {
  const tabs = [
    { id: 'demand' as ActiveTab, label: 'Demand', icon: PieChart, subtitle: 'Consumption' },
    { id: 'plant' as ActiveTab, label: 'Treatment', icon: Factory, subtitle: 'Plant Sizing' },
    { id: 'pump' as ActiveTab, label: 'Pump Duty', icon: Zap, subtitle: 'Hydraulics' },
    { id: 'pipe' as ActiveTab, label: 'Pipe Reach', icon: GitBranch, subtitle: 'Sizing & Loss', badge: pipeAlertCount > 0 ? pipeAlertCount : null },
    { id: 'ref' as ActiveTab, label: 'Reference', icon: BookOpen, subtitle: 'Conversions' }
  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 py-2 sticky top-[69px] z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[105px] sm:min-w-[130px] py-2 px-2.5 sm:px-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold shadow-md shadow-sky-500/20 scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <div className="text-left min-w-0">
                <span className="text-xs sm:text-sm leading-tight block truncate font-semibold">
                  {tab.label}
                </span>
              </div>
              {tab.badge && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-xs">
                  !
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
