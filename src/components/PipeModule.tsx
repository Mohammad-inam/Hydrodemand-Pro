import React from 'react';
import {
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';
import { PipeAssumptions, PipeResults, PipeFlowBasis } from '../types/engineering';
import { STANDARD_PIPE_DIAMETERS, PIPE_MATERIAL_C_VALUES } from '../utils/engineeringMath';

interface PipeModuleProps {
  pipeAssumptions: PipeAssumptions;
  onUpdatePipeAssumptions: (newAssumptions: PipeAssumptions) => void;
  pipeResults: PipeResults;
  totalDailyM3: number;
}

export const PipeModule: React.FC<PipeModuleProps> = ({
  pipeAssumptions,
  onUpdatePipeAssumptions,
  pipeResults,
  totalDailyM3
}) => {
  const updateField = <K extends keyof PipeAssumptions>(field: K, value: PipeAssumptions[K]) => {
    onUpdatePipeAssumptions({
      ...pipeAssumptions,
      [field]: value
    });
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/30 text-purple-300 flex items-center justify-center font-bold">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-purple-300 uppercase px-2 py-0.5 rounded-full bg-purple-500/20">
              Module 04
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Pipe Reach Hydraulics & Friction Loss
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl">
          Verifies conveyance diameter, actual flow velocities, Hazen-Williams head loss, and surge pressure risk across transmission mains.
        </p>
      </div>

      {/* Safety Alert Banners */}
      {pipeResults.status === 'warning-high' && (
        <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-2xl p-4 text-rose-900 dark:text-rose-200 flex items-start space-x-3 shadow-md">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-300">
              Severe High Velocity Alert ({pipeResults.actualVelocity.toFixed(2)} m/s)
            </h4>
            <p className="leading-relaxed">
              {pipeResults.warningMessage}
            </p>
          </div>
        </div>
      )}

      {pipeResults.status === 'warning-low' && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 text-amber-900 dark:text-amber-200 flex items-start space-x-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Low Velocity Sedimentation Warning ({pipeResults.actualVelocity.toFixed(2)} m/s)
            </h4>
            <p className="leading-relaxed">
              {pipeResults.warningMessage}
            </p>
          </div>
        </div>
      )}

      {pipeResults.status === 'optimal' && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 text-emerald-900 dark:text-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="font-extrabold block">Hydraulics Within Standard Range</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Velocity {pipeResults.actualVelocity.toFixed(2)} m/s is inside the optimal 0.6 - 2.0 m/s engineering corridor.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 rounded-lg font-bold font-mono">
            Optimal
          </span>
        </div>
      )}

      {/* Grid: Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Input Parameters */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Pipe Reach Assumptions
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Design flow basis, material roughness, and pipe length
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Flow Basis Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Reach Flow Basis
              </label>
              <select
                value={pipeAssumptions.flowBasis}
                onChange={e => updateField('flowBasis', e.target.value as PipeFlowBasis)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="peak">Peak-hour demand (PF = {pipeAssumptions.peakFactor || 1.8})</option>
                <option value="average">Average daily demand (MDD / 86,400s)</option>
                <option value="custom">Custom Direct Flow Input</option>
              </select>
            </div>

            {/* Custom Flow or Peak factor input */}
            {pipeAssumptions.flowBasis === 'custom' ? (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Custom Direct Flow (L/s)
                </label>
                <input
                  type="number"
                  value={pipeAssumptions.customFlowLs}
                  min="0.1"
                  step="0.1"
                  onChange={e => updateField('customFlowLs', parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ) : pipeAssumptions.flowBasis === 'peak' ? (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Peak Hour Factor (PF)
                  </label>
                  <span className="text-[11px] text-slate-400">1.5 to 2.5</span>
                </div>
                <input
                  type="number"
                  value={pipeAssumptions.peakFactor}
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  onChange={e => updateField('peakFactor', parseFloat(e.target.value) || 1.8)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ) : null}

            {/* Velocity & Length */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Velocity (m/s)
                </label>
                <input
                  type="number"
                  value={pipeAssumptions.targetVelocity}
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  onChange={e => updateField('targetVelocity', parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pipe Length (m)
                </label>
                <input
                  type="number"
                  value={pipeAssumptions.pipeLengthM}
                  min="1"
                  step="10"
                  onChange={e => updateField('pipeLengthM', parseFloat(e.target.value) || 1000)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Roughness C & Diameter */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Hazen-Williams C
                </label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={pipeAssumptions.hazenWilliamsC}
                    min="50"
                    max="160"
                    onChange={e => updateField('hazenWilliamsC', parseFloat(e.target.value) || 130)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                  <select
                    onChange={e => updateField('hazenWilliamsC', parseInt(e.target.value))}
                    className="w-full text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-1 text-slate-600 dark:text-slate-300"
                  >
                    <option value="">Select Material Preset...</option>
                    {PIPE_MATERIAL_C_VALUES.map(item => (
                      <option key={item.name} value={item.c}>
                        {item.name} (C={item.c})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Selected Int. Dia (mm)
                </label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={pipeAssumptions.selectedDiameterMm}
                    min="10"
                    step="5"
                    onChange={e => updateField('selectedDiameterMm', parseFloat(e.target.value) || 200)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                  <select
                    value={pipeAssumptions.selectedDiameterMm}
                    onChange={e => updateField('selectedDiameterMm', parseInt(e.target.value))}
                    className="w-full text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-1 text-slate-600 dark:text-slate-300"
                  >
                    {STANDARD_PIPE_DIAMETERS.map(dia => (
                      <option key={dia} value={dia}>
                        DN {dia} mm
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Conveyance & Velocity Results
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                Hydraulic Verification
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Design Conveyance Flow
                  </span>
                  <span className="text-[10px] text-slate-400">Peak / average transmission flow</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-slate-900 dark:text-white text-base block">
                    {pipeResults.designFlowM3s.toFixed(5)} m³/s
                  </span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                    {pipeResults.flowLs.toFixed(2)} L/s
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Theoretical Diameter at Target V ({pipeAssumptions.targetVelocity} m/s)
                  </span>
                  <span className="text-[10px] text-slate-400">D = √[(4×Q)/(π×v)]</span>
                </div>
                <span className="font-mono font-black text-teal-600 dark:text-teal-400 text-base">
                  {Math.round(pipeResults.reqDiameterMm)} mm
                </span>
              </div>

              {/* Velocity Highlight Box */}
              <div
                className={`flex justify-between items-center py-3.5 px-4 rounded-2xl border ${
                  pipeResults.status === 'warning-high'
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : pipeResults.status === 'warning-low'
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                <div>
                  <span className="text-xs font-black block">
                    Actual Fluid Velocity in DN {pipeAssumptions.selectedDiameterMm}mm
                  </span>
                  <span className="text-[10px] opacity-80 font-medium">
                    Recommended: 0.6 to 2.0 m/s
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-xl sm:text-2xl block">
                    {pipeResults.actualVelocity.toFixed(3)} m/s
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {pipeResults.status === 'optimal' ? 'Acceptable' : pipeResults.status}
                  </span>
                </div>
              </div>

              {/* Friction Head Loss */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Frictional Head Loss (Hazen-Williams hf)
                  </span>
                  <span className="text-[10px] text-slate-400">Total reach length {pipeAssumptions.pipeLengthM} meters</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-slate-900 dark:text-white text-base block">
                    {pipeResults.headLossM.toFixed(2)} meters
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                    {pipeResults.headLossBar.toFixed(2)} bar
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 text-xs text-slate-500 dark:text-slate-400">
                <span>Hydraulic Gradient (Head Loss per km):</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {pipeResults.hydraulicGradient.toFixed(2)} m/km
                </span>
              </div>
            </div>
          </div>

          {/* Sizing Recommendation Guidance */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Suggested standard commercial pipe diameter: <strong className="text-purple-600 dark:text-purple-400">
              DN {STANDARD_PIPE_DIAMETERS.find(d => d >= pipeResults.reqDiameterMm) || Math.ceil(pipeResults.reqDiameterMm)} mm
            </strong>
          </div>
        </div>
      </div>

      {/* Hydraulic Formula Reference */}
      <div className="bg-slate-950 text-slate-300 rounded-2xl p-4 sm:p-5 text-xs font-mono space-y-2 shadow-inner border border-slate-800">
        <p className="text-purple-400 font-sans font-bold text-xs uppercase tracking-wider flex items-center space-x-1">
          <HelpCircle className="w-3.5 h-3.5 mr-1" />
          <span>Hazen-Williams Friction & Pipe Sizing Mechanics</span>
        </p>
        <div className="space-y-1.5 text-slate-400 pt-1">
          <p><span className="text-white">Required Diameter (m)</span> = √[(4 × Q) ÷ (π × v)]</p>
          <p><span className="text-white">Head Loss hf (m)</span> = 10.67 × L × Q^1.852 ÷ (C^1.852 × D^4.87)</p>
          <p><span className="text-slate-500">Q in m³/s, L and D in meters, C is Hazen-Williams roughness coefficient.</span></p>
        </div>
      </div>
    </div>
  );
};
