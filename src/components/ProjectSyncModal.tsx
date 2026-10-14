import React, { useState, useRef } from 'react';
import {
  FolderOpen,
  Cloud,
  CloudOff,
  RefreshCw,
  X,
  FileDown,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { ProjectState, SyncStatus } from '../types/engineering';
import {
  getSavedProjectsList,
  exportProjectAsJSON,
  parseProjectFromJSON
} from '../utils/storageSync';

interface ProjectSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: ProjectState;
  onLoadProject: (project: ProjectState) => void;
  onSaveCurrentProject: () => void;
  syncStatus: SyncStatus;
  triggerSync: () => void;
}

export const ProjectSyncModal: React.FC<ProjectSyncModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onLoadProject,
  onSaveCurrentProject,
  syncStatus,
  triggerSync
}) => {
  const [projectsList, setProjectsList] = useState<ProjectState[]>(getSavedProjectsList());
  const [newProjectName, setNewProjectName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj: ProjectState = {
      ...currentProject,
      id: `proj_${Date.now()}`,
      name: newProjectName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onLoadProject(newProj);
    setProjectsList(getSavedProjectsList());
    setNewProjectName('');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const loaded = parseProjectFromJSON(content);
        onLoadProject(loaded);
        setProjectsList(getSavedProjectsList());
        setImportError(null);
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid JSON file';
        setImportError(msg);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Projects & Cloud Synchronization
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage local and cloud project slots with offline resilience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Real-time Cloud Sync Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white flex items-center justify-between border border-sky-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-400">
                {syncStatus.isSyncing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : syncStatus.isOnline ? (
                  <Cloud className="w-5 h-5 text-emerald-400" />
                ) : (
                  <CloudOff className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm">
                    {syncStatus.isOnline ? 'Real-Time Cloud Sync Active' : 'Offline Mode (Local Storage)'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-xs text-slate-300">
                  {syncStatus.lastSyncedAt
                    ? `Last synced at ${new Date(syncStatus.lastSyncedAt).toLocaleTimeString()}`
                    : 'Changes auto-saved in local cache'}
                </p>
              </div>
            </div>
            <button
              onClick={triggerSync}
              disabled={syncStatus.isSyncing}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>

          {/* Active Project details */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Currently Active Project
            </span>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {currentProject.name}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                  <span>Lead: <strong>{currentProject.engineerName || 'Mohammad Inam'}</strong></span>
                </div>
              </div>
              <button
                onClick={() => exportProjectAsJSON(currentProject)}
                className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5 text-sky-500" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Import / Export JSON */}
          <div className="flex items-center justify-between border-t border-b border-slate-100 dark:border-slate-800 py-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Import Existing Project JSON
              </span>
              <span className="text-[11px] text-slate-400">
                Load .json project file created by another team member
              </span>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          {importError && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold">
              {importError}
            </div>
          )}

          {/* Saved Project Slots */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Saved Project Slots
            </label>
            <div className="space-y-2">
              {projectsList.map(proj => {
                const isSelected = proj.id === currentProject.id;
                return (
                  <div
                    key={proj.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {proj.name}
                        </h5>
                        {isSelected && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-sky-500 text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Updated {new Date(proj.updatedAt).toLocaleDateString()} at {new Date(proj.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {!isSelected && (
                      <button
                        onClick={() => {
                          onLoadProject(proj);
                          onClose();
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Load
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create New Project Slot */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Create New Project
            </h5>
            <form onSubmit={handleCreateNewProject} className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Swat Valley Water Supply Project"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
