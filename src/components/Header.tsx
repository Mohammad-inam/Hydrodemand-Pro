import React from 'react';
import {
  Droplets,
  Cloud,
  CloudOff,
  RefreshCw,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  Lock,
  Sliders,
  FolderOpen,
  Smartphone,
  Monitor
} from 'lucide-react';
import { SyncStatus } from '../types/engineering';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  syncStatus: SyncStatus;
  triggerSync: () => void;
  onOpenSearch: () => void;
  onOpenPresets: () => void;
  onOpenProjects: () => void;
  onOpenBiometric: () => void;
  isBiometricLocked: boolean;
  deviceViewMode: 'responsive' | 'mobile';
  toggleDeviceViewMode: () => void;
  activePresetName: string;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleDarkMode,
  syncStatus,
  triggerSync,
  onOpenSearch,
  onOpenPresets,
  onOpenProjects,
  onOpenBiometric,
  isBiometricLocked,
  deviceViewMode,
  toggleDeviceViewMode,
  activePresetName
}) => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo and Engineer Credit */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25 flex-shrink-0">
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-none truncate">
                Hydrodemand
              </h1>
              <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-xs">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 mt-0.5 truncate">
              <span>Made by Mohammad Inam</span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span className="hidden sm:inline-block text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                {activePresetName}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          {/* Quick Search trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
            title="Search parameters, formulas, standards (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden lg:inline text-[9px] px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Cloud Sync Status */}
          <button
            onClick={triggerSync}
            disabled={syncStatus.isSyncing}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              syncStatus.isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            }`}
            title={
              syncStatus.isOnline
                ? `Cloud Synced (${syncStatus.lastSyncedAt ? new Date(syncStatus.lastSyncedAt).toLocaleTimeString() : 'Active'})`
                : 'Offline Mode: Stored locally'
            }
          >
            {syncStatus.isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
            ) : syncStatus.isOnline ? (
              <Cloud className="w-3.5 h-3.5" />
            ) : (
              <CloudOff className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {syncStatus.isSyncing ? 'Syncing...' : syncStatus.isOnline ? 'Synced' : 'Offline'}
            </span>
          </button>

          {/* Device Simulator Toggle (Desktop wide vs Mobile phone viewport) */}
          <button
            onClick={toggleDeviceViewMode}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title={`Toggle layout view: currently ${deviceViewMode}`}
          >
            {deviceViewMode === 'responsive' ? (
              <Monitor className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            )}
          </button>

          {/* Project Management */}
          <button
            onClick={onOpenProjects}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title="Projects & Cloud Storage"
          >
            <FolderOpen className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Preset Standards */}
          <button
            onClick={onOpenPresets}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title="Standard Presets Manager"
          >
            <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Biometric Security Lock */}
          <button
            onClick={onOpenBiometric}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
              isBiometricLocked
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Biometric Security & Passkey"
          >
            {isBiometricLocked ? (
              <Lock className="w-4 h-4 text-rose-600" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
