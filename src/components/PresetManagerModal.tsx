import React, { useState } from 'react';
import {
  Sliders,
  X,
  CheckCircle2,
  Sparkles,
  BookmarkCheck,
  Plus
} from 'lucide-react';
import { PRESET_STANDARDS } from '../utils/engineeringMath';
import { PresetStandard, DemandCategory } from '../types/engineering';

interface PresetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePresetId: string;
  onSelectPreset: (preset: PresetStandard) => void;
  onSaveCustomPreset: (name: string) => void;
  currentCategories: DemandCategory[];
}

export const PresetManagerModal: React.FC<PresetManagerModalProps> = ({
  isOpen,
  onClose,
  activePresetId,
  onSelectPreset,
  onSaveCustomPreset,
  currentCategories
}) => {
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSaveCustomPreset(customName.trim());
    setCustomName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Engineering Standard Presets
              </h3>
              <p className="text-[11px] text-slate-400">
                Switch baseline consumption rates or save custom project standard
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

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Official Baseline Standards
            </label>
            {PRESET_STANDARDS.map(preset => {
              const isActive = activePresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {preset.name}
                        </h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500 text-white flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 block mt-0.5">
                        {preset.authority}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {preset.description}
                      </p>
                    </div>
                  </div>

                  {/* Rates Preview Grid */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-400 block">Residential:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{preset.rates.residential || 0} L/c/d</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-400 block">Commercial:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{preset.rates.commercial || 0} L/p/d</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <span className="text-slate-400 block">Hospitals:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{preset.rates.hospitals || 0} L/b/d</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Create Custom Standard */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Plus className="w-3.5 h-3.5 text-sky-500" />
              <span>Save Current Rates as Custom Preset</span>
            </h4>
            <form onSubmit={handleCustomSubmit} className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Peshawar Phase II Custom Standard"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
