import React from 'react';
import {
  Factory,
  Clock,
  ShieldAlert,
  Droplet,
  Waves,
  ArrowRight,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { PlantAssumptions, PlantResults } from '../types/engineering';

interface PlantModuleProps {
  plantAssumptions: PlantAssumptions;
  onUpdatePlantAssumptions: (newAssumptions: PlantAssumptions) => void;
  plantResults: PlantResults;
  totalDailyM3: number;
}

export const PlantModule: React.FC<PlantModuleProps> = ({
  plantAssumptions,
  onUpdatePlantAssumptions,
  plantResults,
  totalDailyM3
}) => {
  const updateField = (field: keyof PlantAssumptions, value: number) => {
    onUpdatePlantAssumptions({
      ...plantAssumptions,
      [field]: value
    });
  };

  return (
    <div className="space-y-5">
      {/* Overview banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-teal-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-teal-500/30 text-teal-300 flex items-center justify-center font-bold">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-teal-300 uppercase px-2 py-0.5 rounded-full bg-teal-500/20">
              Module 02
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Water Treatment Plant (WTP) Sizing
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl">
          Sizes rapid sand filtration, clarifiers, and raw-water intake works based on daily municipal demand (<strong>{totalDailyM3.toFixed(1)} m³/d</strong>), peak operational pumping shifts, and process filter backwash recovery.
        </p>
      </div>

      {/* Assumptions & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Input Assumptions */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Treatment Assumptions
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Operational shift constraints and sizing margins
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Plant Operating Hours / day
                </label>
                <span className="text-[11px] font-mono text-slate-400">1 to 24 hrs</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={plantAssumptions.operatingHours}
                  min="1"
                  max="24"
                  step="0.5"
                  onChange={e => updateField('operatingHours', parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white pr-16 focus:ring-2 focus:ring-teal-500"
                />
                <span className="absolute right-3 top-3 text-xs font-semibold text-slate-400">
                  hours/day
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Capacity Margin (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={plantAssumptions.allowancePercent}
                    min="0"
                    max="50"
                    onChange={e => updateField('allowancePercent', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white pr-8 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="absolute right-3 top-3 text-xs font-semibold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Process Recovery (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={plantAssumptions.recoveryPercent}
                    min="50"
                    max="100"
                    onChange={e => updateField('recoveryPercent', parseFloat(e.target.value) || 95)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white pr-8 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="absolute right-3 top-3 text-xs font-semibold text-slate-400">%</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900/40 text-[11px] text-teal-800 dark:text-teal-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                <span>Process Note:</span>
              </div>
              <p>
                A 95% recovery factor automatically accounts for 5% washwater for filter media scouring, sludge bleed, and backwash recycling.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Treatment Capacity Results */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Treatment Capacity Output
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
                Design Verified
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Required Net Production
                  </span>
                  <span className="text-[10px] text-slate-400">Total daily demand ÷ operating hours</span>
                </div>
                <span className="font-mono font-black text-slate-900 dark:text-white text-base">
                  {plantResults.netProdM3h.toFixed(1)} m³/h
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Design Treatment Capacity (+{plantAssumptions.allowancePercent}%)
                  </span>
                  <span className="text-[10px] text-slate-400">Includes emergency peak capacity cushion</span>
                </div>
                <span className="font-mono font-black text-sky-600 dark:text-sky-400 text-lg">
                  {plantResults.designCapM3h.toFixed(1)} m³/h
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Raw-Water Intake Demand
                  </span>
                  <span className="text-[10px] text-slate-400">Gross river/well intake with {plantAssumptions.recoveryPercent}% recovery</span>
                </div>
                <span className="font-mono font-black text-teal-600 dark:text-teal-400 text-lg">
                  {plantResults.rawIntakeM3h.toFixed(1)} m³/h
                </span>
              </div>

              <div className="flex justify-between items-center py-3 px-4 bg-teal-50 dark:bg-teal-950/50 rounded-2xl border border-teal-200/80 dark:border-teal-900/60">
                <div>
                  <span className="text-xs font-extrabold text-teal-900 dark:text-teal-200 block">
                    Total Daily Treated Output ({plantAssumptions.operatingHours} hrs)
                  </span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                    At continuous design hourly rate
                  </span>
                </div>
                <span className="font-mono font-black text-teal-950 dark:text-teal-100 text-xl sm:text-2xl">
                  {Math.round(plantResults.dailyProdM3d).toLocaleString()} m³/d
                </span>
              </div>
            </div>
          </div>

          {/* Quick comparison footnote */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Flow equivalent:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {((plantResults.designCapM3h * 1000) / 3600).toFixed(2)} Liters / second
            </span>
          </div>
        </div>
      </div>

      {/* Visual Treatment Process Flowchart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
          <Waves className="w-4 h-4 text-sky-500" />
          <span>Hydraulic Process Stage Flow Diagram</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Stage 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 relative">
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase">Stage 01</span>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">River / Borewell Intake</h4>
            <div className="text-xs font-mono font-black text-teal-600 dark:text-teal-400">
              {plantResults.rawIntakeM3h.toFixed(1)} m³/h
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">Screens & grit removal</p>
          </div>

          {/* Stage 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 relative">
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase">Stage 02</span>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Clarifier / Flocculation</h4>
            <div className="text-xs font-mono font-black text-sky-600 dark:text-sky-400">
              {plantResults.designCapM3h.toFixed(1)} m³/h
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">Coagulant dosing & settling</p>
          </div>

          {/* Stage 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 relative">
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase">Stage 03</span>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Rapid Sand Filters</h4>
            <div className="text-xs font-mono font-black text-sky-600 dark:text-sky-400">
              {plantResults.netProdM3h.toFixed(1)} m³/h
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">Media depth & backwash cycle</p>
          </div>

          {/* Stage 4 */}
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 space-y-2 relative">
            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase">Stage 04</span>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Clear Water Storage</h4>
            <div className="text-xs font-mono font-black text-teal-700 dark:text-teal-300">
              {Math.round(plantResults.dailyProdM3d).toLocaleString()} m³/d
            </div>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 leading-tight">Chlorination & distribution</p>
          </div>
        </div>
      </div>

      {/* Engineering Formulas Card */}
      <div className="bg-slate-950 text-slate-300 rounded-2xl p-4 sm:p-5 text-xs font-mono space-y-2 shadow-inner border border-slate-800">
        <div className="flex items-center justify-between">
          <p className="text-teal-400 font-sans font-bold text-xs uppercase tracking-wider flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            <span>Water Treatment Mathematical Formulations</span>
          </p>
          <span className="text-[10px] text-slate-500 font-mono">KP Urban Engineering Standard</span>
        </div>
        <div className="space-y-1.5 text-slate-400 pt-1">
          <p><span className="text-white">Required Net Production (m³/h)</span> = MDD (m³/day) ÷ Operating Hours ({plantAssumptions.operatingHours} h)</p>
          <p><span className="text-white">Design Capacity (m³/h)</span> = Required Net Prod × [1 + (Allowance % ÷ 100)]</p>
          <p><span className="text-white">Raw Water Intake (m³/h)</span> = Design Capacity ÷ (Recovery % ÷ 100)</p>
        </div>
      </div>
    </div>
  );
};
