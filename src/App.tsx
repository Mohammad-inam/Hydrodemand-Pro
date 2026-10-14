/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Navbar, ActiveTab } from './components/Navbar';
import { DemandModule } from './components/DemandModule';
import { PlantModule } from './components/PlantModule';
import { PumpModule } from './components/PumpModule';
import { PipeModule } from './components/PipeModule';
import { EngineeringReferenceModule } from './components/EngineeringReferenceModule';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BiometricModal } from './components/BiometricModal';
import { PresetManagerModal } from './components/PresetManagerModal';
import { ProjectSyncModal } from './components/ProjectSyncModal';
import { ExportReportModal } from './components/ExportReportModal';

import {
  ProjectState,
  SyncStatus,
  DemandCategory,
  PresetStandard,
  PlantAssumptions,
  PumpAssumptions,
  PipeAssumptions
} from './types/engineering';
import {
  loadSavedProject,
  saveActiveProject,
  INITIAL_PROJECT
} from './utils/storageSync';
import {
  calculateDemandTotals,
  calculatePlant,
  calculatePump,
  calculatePipe,
  PRESET_STANDARDS,
  DEFAULT_CATEGORIES
} from './utils/engineeringMath';
import { getBiometricSettings } from './utils/webAuthn';

export default function App() {
  // 1. Project State
  const [project, setProject] = useState<ProjectState>(() => loadSavedProject());

  // 2. Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('hydrodemand_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 3. Layout Device View Mode: 'responsive' (full width desktop/tablet/mobile) or 'mobile' (phone frame)
  const [deviceViewMode, setDeviceViewMode] = useState<'responsive' | 'mobile'>('responsive');

  // 4. Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('demand');

  // 5. Cloud Sync Status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    lastSyncedAt: new Date().toISOString(),
    pendingChanges: 0,
    cloudSyncEnabled: true
  });

  // 6. Biometric State
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(() => {
    const settings = getBiometricSettings();
    return settings.isEnabled;
  });

  // 7. Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync dark mode with document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hydrodemand_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hydrodemand_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Network listeners for offline/online synchronization
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      triggerSync();
    };
    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-save project whenever it changes
  useEffect(() => {
    saveActiveProject(project);
    setSyncStatus(prev => ({
      ...prev,
      pendingChanges: prev.pendingChanges + 1
    }));
  }, [project]);

  // Synchronize with simulated cloud service
  const triggerSync = useCallback(() => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    setTimeout(() => {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        pendingChanges: 0,
        lastSyncedAt: new Date().toISOString()
      }));
    }, 900);
  }, []);

  // Calculations derived with memoization
  const demandTotals = useMemo(() => {
    return calculateDemandTotals(project.categories, project.lossPercentage);
  }, [project.categories, project.lossPercentage]);

  const plantResults = useMemo(() => {
    return calculatePlant(demandTotals.totalDailyM3, project.plantAssumptions);
  }, [demandTotals.totalDailyM3, project.plantAssumptions]);

  const pumpResults = useMemo(() => {
    return calculatePump(demandTotals.totalDailyM3, project.pumpAssumptions);
  }, [demandTotals.totalDailyM3, project.pumpAssumptions]);

  const pipeResults = useMemo(() => {
    return calculatePipe(demandTotals.totalDailyM3, project.pipeAssumptions);
  }, [demandTotals.totalDailyM3, project.pipeAssumptions]);

  // Active preset name lookup
  const activePresetName = useMemo(() => {
    const standard = PRESET_STANDARDS.find(s => s.id === project.activePresetId);
    return standard ? standard.name : project.activePresetId;
  }, [project.activePresetId]);

  // Category modification handlers
  const handleUpdateCategoryQty = (index: number, val: number) => {
    setProject(prev => {
      const updated = [...prev.categories];
      if (updated[index]) {
        updated[index] = { ...updated[index], qty: val };
      }
      return { ...prev, categories: updated };
    });
  };

  const handleUpdateCategoryRate = (index: number, val: number) => {
    setProject(prev => {
      const updated = [...prev.categories];
      if (updated[index]) {
        updated[index] = { ...updated[index], rate: val };
      }
      return { ...prev, categories: updated };
    });
  };

  const handleUpdateLossPercentage = (val: number) => {
    setProject(prev => ({ ...prev, lossPercentage: val }));
  };

  const handleAddCategory = (category: DemandCategory) => {
    setProject(prev => ({
      ...prev,
      categories: [...prev.categories, category]
    }));
  };

  const handleDeleteCategory = (id: string) => {
    setProject(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  };

  const handleResetDefaults = () => {
    setProject(prev => ({
      ...prev,
      categories: DEFAULT_CATEGORIES,
      activePresetId: 'kp_urban'
    }));
  };

  const handleSelectPreset = (preset: PresetStandard) => {
    setProject(prev => {
      const updated = prev.categories.map(cat => {
        if (preset.rates[cat.id] !== undefined) {
          return { ...cat, rate: preset.rates[cat.id] };
        }
        return cat;
      });
      return {
        ...prev,
        categories: updated,
        activePresetId: preset.id
      };
    });
  };

  const handleSaveCustomPreset = (name: string) => {
    setProject(prev => ({
      ...prev,
      activePresetId: name
    }));
  };

  const handleSaveProject = () => {
    saveActiveProject(project);
    triggerSync();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleUpdatePlantAssumptions = (newAssumptions: PlantAssumptions) => {
    setProject(prev => ({ ...prev, plantAssumptions: newAssumptions }));
  };

  const handleUpdatePumpAssumptions = (newAssumptions: PumpAssumptions) => {
    setProject(prev => ({ ...prev, pumpAssumptions: newAssumptions }));
  };

  const handleUpdatePipeAssumptions = (newAssumptions: PipeAssumptions) => {
    setProject(prev => ({ ...prev, pipeAssumptions: newAssumptions }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleDeviceViewMode = () => {
    setDeviceViewMode(prev => (prev === 'responsive' ? 'mobile' : 'responsive'));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Container wrapper: switches between responsive fluid view and mobile simulator view */}
      <div
        className={`mx-auto w-full transition-all duration-300 flex flex-col min-h-screen ${
          deviceViewMode === 'mobile'
            ? 'max-w-[480px] my-0 sm:my-6 rounded-none sm:rounded-3xl shadow-2xl sm:border border-slate-300 dark:border-slate-800 bg-[#F4F6FB] dark:bg-slate-950 overflow-hidden'
            : 'max-w-7xl'
        }`}
      >
        {/* Navigation & Header */}
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          syncStatus={syncStatus}
          triggerSync={triggerSync}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenPresets={() => setIsPresetsOpen(true)}
          onOpenProjects={() => setIsProjectsOpen(true)}
          onOpenBiometric={() => setIsBiometricOpen(true)}
          isBiometricLocked={isBiometricLocked}
          deviceViewMode={deviceViewMode}
          toggleDeviceViewMode={toggleDeviceViewMode}
          activePresetName={activePresetName}
        />

        {/* Tab Switcher */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pipeAlertCount={pipeResults.status === 'warning-high' ? 1 : 0}
        />

        {/* Main Application Area */}
        <main className="flex-1 p-3 sm:p-6 space-y-6">
          {activeTab === 'demand' && (
            <DemandModule
              categories={demandTotals.categories}
              lossPercentage={project.lossPercentage}
              onUpdateCategoryQty={handleUpdateCategoryQty}
              onUpdateCategoryRate={handleUpdateCategoryRate}
              onUpdateLossPercentage={handleUpdateLossPercentage}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onOpenPresets={() => setIsPresetsOpen(true)}
              onExportReport={() => setIsExportOpen(true)}
              onSaveProject={handleSaveProject}
              onResetDefaults={handleResetDefaults}
              activePresetName={activePresetName}
              totalDailyLiters={demandTotals.totalDailyLiters}
              totalDailyM3={demandTotals.totalDailyM3}
              totalDailyMGD={demandTotals.totalDailyMGD}
              lossLiters={demandTotals.lossLiters}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'plant' && (
            <PlantModule
              plantAssumptions={project.plantAssumptions}
              onUpdatePlantAssumptions={handleUpdatePlantAssumptions}
              plantResults={plantResults}
              totalDailyM3={demandTotals.totalDailyM3}
            />
          )}

          {activeTab === 'pump' && (
            <PumpModule
              pumpAssumptions={project.pumpAssumptions}
              onUpdatePumpAssumptions={handleUpdatePumpAssumptions}
              pumpResults={pumpResults}
              totalDailyM3={demandTotals.totalDailyM3}
            />
          )}

          {activeTab === 'pipe' && (
            <PipeModule
              pipeAssumptions={project.pipeAssumptions}
              onUpdatePipeAssumptions={handleUpdatePipeAssumptions}
              pipeResults={pipeResults}
              totalDailyM3={demandTotals.totalDailyM3}
            />
          )}

          {activeTab === 'ref' && <EngineeringReferenceModule />}
        </main>

        {/* Footer Credit & Status */}
        <footer className="mt-auto py-4 px-6 border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 text-center text-xs space-y-1">
          <p className="font-extrabold text-slate-900 dark:text-white flex items-center justify-center space-x-1.5">
            <span>Hydrodemand Pro</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono">
              v2.6
            </span>
          </p>
          <p className="text-sky-600 dark:text-sky-400 font-semibold flex items-center justify-center space-x-1">
            <span>Made by Mohammad Inam</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">
              Continuous Offline Resilience & Biometric Protection
            </span>
          </p>
        </footer>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={tab => setActiveTab(tab)}
        categories={project.categories}
      />

      <PresetManagerModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        activePresetId={project.activePresetId}
        onSelectPreset={handleSelectPreset}
        onSaveCustomPreset={handleSaveCustomPreset}
        currentCategories={project.categories}
      />

      <ProjectSyncModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        currentProject={project}
        onLoadProject={proj => setProject(proj)}
        onSaveCurrentProject={handleSaveProject}
        syncStatus={syncStatus}
        triggerSync={triggerSync}
      />

      <BiometricModal
        isOpen={isBiometricOpen}
        onClose={() => setIsBiometricOpen(false)}
        isLocked={isBiometricLocked}
        onUnlockSuccess={() => setIsBiometricLocked(false)}
        onLockApp={() => {
          setIsBiometricLocked(true);
          setIsBiometricOpen(true);
        }}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
        categories={demandTotals.categories}
        totalDailyLiters={demandTotals.totalDailyLiters}
        totalDailyM3={demandTotals.totalDailyM3}
        totalDailyMGD={demandTotals.totalDailyMGD}
        lossLiters={demandTotals.lossLiters}
        lossPercentage={project.lossPercentage}
        plantResults={plantResults}
        pumpResults={pumpResults}
        pipeResults={pipeResults}
        activePresetName={activePresetName}
      />
    </div>
  );
}
