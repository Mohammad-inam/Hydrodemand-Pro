import React, { useState } from 'react';
import {
  Zap,
  Gauge,
  Activity,
  ArrowUpRight,
  HelpCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { PumpAssumptions, PumpResults } from '../types/engineering';

interface PumpModuleProps {
  pumpAssumptions: PumpAssumptions;
  onUpdatePumpAssumptions: (newAssumptions: PumpAssumptions) => void;
  pumpResults: PumpResults;
  totalDailyM3: number;
}

export const PumpModule: React.FC<PumpModuleProps> = ({
  pumpAssumptions,
  onUpdatePumpAssumptions,
  pumpResults,
  totalDailyM3
}) => {
  const [electricityTariff, setElectricityTariff] = useState<number>(0.15); // $ or PKR per kWh

  const updateField = (field: keyof PumpAssumptions, value: number) => {
    onUpdatePumpAssumptions({
      ...pumpAssumptions,
      [field]: value
    });
  };

  // Daily energy consumption: kW * hours
  const dailyKwh = pumpResults.motorRatingKw * pumpAssumptions.pumpHours;
  const dailyCost = dailyKwh * electricityTariff;
  const annualCost = dailyCost * 365;

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-sky-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500/30 text-sky-300 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-sky-300 uppercase px-2 py-0.5 rounded-full bg-sky-500/20">
              Module 03
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Pump Duty & Hydraulic Power Sizing
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl">
          Determines required delivery pump discharge (<strong>{pumpResults.flowLs.toFixed(2)} L/s</strong>), static & friction head lift (TDH), brake shaft power, and motor rating with standard 15% safety overload factor.
        </p>
      </div>

      {/* Grid: Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Input Assumptions */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Pump Station Assumptions
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pumping shift cycle, total head & wire-to-water efficiency
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pumping Hours / day
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pumpAssumptions.pumpHours}
                    min="1"
                    max="24"
                    step="0.5"
                    onChange={e => updateField('pumpHours', parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white pr-8 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="absolute right-2.5 top-2 sm:top-2.5 text-xs font-semibold text-slate-400">h</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Flow Margin (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pumpAssumptions.flowAllowancePercent}
                    min="0"
                    max="50"
                    onChange={e => updateField('flowAllowancePercent', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white pr-8 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="absolute right-2.5 top-2 sm:top-2.5 text-xs font-semibold text-slate-400">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Total Dynamic Head (TDH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pumpAssumptions.tdh}
                    min="1"
                    max="500"
                    step="1"
                    onChange={e => updateField('tdh', parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white pr-8 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="absolute right-2.5 top-2 sm:top-2.5 text-xs font-semibold text-slate-400">m</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pump Efficiency (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pumpAssumptions.efficiencyPercent}
                    min="20"
                    max="95"
                    step="1"
                    onChange={e => updateField('efficiencyPercent', parseFloat(e.target.value) || 70)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white pr-8 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="absolute right-2.5 top-2 sm:top-2.5 text-xs font-semibold text-slate-400">%</span>
                </div>
              </div>
            </div>

            {/* Visual Head & Efficiency bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <span>Efficiency Rating:</span>
                <span className={`font-bold ${pumpAssumptions.efficiencyPercent >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {pumpAssumptions.efficiencyPercent >= 75 ? 'High Efficiency Motor' : 'Standard Commercial Pump'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-teal-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, pumpAssumptions.efficiencyPercent)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Pump Duty Specification
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold">
                Hydraulics Ready
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Design Pumping Discharge Flow
                  </span>
                  <span className="text-[10px] text-slate-400">Total daily volume delivered in {pumpAssumptions.pumpHours} hours</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-slate-900 dark:text-white text-base block">
                    {pumpResults.designFlowM3h.toFixed(1)} m³/h
                  </span>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono">
                    {pumpResults.flowLs.toFixed(2)} L/s
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Total Dynamic Head (TDH)
                  </span>
                  <span className="text-[10px] text-slate-400">Static elevation lift + delivery pipe friction</span>
                </div>
                <span className="font-mono font-black text-slate-900 dark:text-white text-base">
                  {pumpAssumptions.tdh} meters
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Estimated Shaft Hydraulic Power
                  </span>
                  <span className="text-[10px] text-slate-400">Net work done on fluid at {pumpAssumptions.efficiencyPercent}% pump efficiency</span>
                </div>
                <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-lg">
                  {pumpResults.hydraulicPowerKw.toFixed(2)} kW
                </span>
              </div>

              {/* Motor Rating Highlight Box */}
              <div className="flex justify-between items-center py-3.5 px-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50">
                <div>
                  <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 block">
                    Standard Motor Rating (15% Safety Margin)
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Continuous operational motor rating
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-emerald-950 dark:text-emerald-100 text-xl sm:text-2xl block">
                    {pumpResults.motorRatingKw.toFixed(1)} kW
                  </span>
                  <span className="text-xs font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                    {pumpResults.motorRatingHp.toFixed(1)} HP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Electricity OPEX Estimator */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-600 dark:text-slate-400">
                Energy Cost: <strong>{dailyKwh.toFixed(0)} kWh/day</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Unit rate:</span>
              <input
                type="number"
                value={electricityTariff}
                step="0.01"
                min="0.01"
                onChange={e => setElectricityTariff(parseFloat(e.target.value) || 0.15)}
                className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-bold"
              />
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                ≈ ${dailyCost.toFixed(1)}/day (${(annualCost / 1000).toFixed(1)}k/yr)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hydraulic Power Formula Guide */}
      <div className="bg-slate-950 text-slate-300 rounded-2xl p-4 sm:p-5 text-xs font-mono space-y-2 shadow-inner border border-slate-800">
        <p className="text-sky-400 font-sans font-bold text-xs uppercase tracking-wider flex items-center space-x-1">
          <HelpCircle className="w-3.5 h-3.5 mr-1" />
          <span>Hydraulic Shaft Power Governing Formula</span>
        </p>
        <div className="space-y-1.5 text-slate-400 pt-1">
          <p><span className="text-white">Hydraulic Power (kW)</span> = [ρ × g × Q (m³/s) × TDH (m)] ÷ (Efficiency ÷ 100) ÷ 1000</p>
          <p><span className="text-white">Motor Rating (kW)</span> = Shaft Power × 1.15 [Safety Factor: 15% allowance]</p>
          <p><span className="text-slate-500">Constants: ρ = 1000 kg/m³ (water density), g = 9.81 m/s² (gravitational acceleration)</span></p>
        </div>
      </div>
    </div>
  );
};
