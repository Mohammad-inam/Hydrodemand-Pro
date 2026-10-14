import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  Droplets,
  Building,
  UserCheck
} from 'lucide-react';
import {
  DemandCategory,
  PlantResults,
  PumpResults,
  PipeResults,
  ProjectState
} from '../types/engineering';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  categories: DemandCategory[];
  totalDailyLiters: number;
  totalDailyM3: number;
  totalDailyMGD: number;
  lossLiters: number;
  lossPercentage: number;
  plantResults: PlantResults;
  pumpResults: PumpResults;
  pipeResults: PipeResults;
  activePresetName: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  project,
  categories,
  totalDailyLiters,
  totalDailyM3,
  totalDailyMGD,
  lossLiters,
  lossPercentage,
  plantResults,
  pumpResults,
  pipeResults,
  activePresetName
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `HYDRODEMAND PRO - WATER DEMAND & ENGINEERING ASSESSMENT REPORT
============================================================
Prepared by Lead Engineer: Mohammad Inam
Project: ${project.name}
Active Standard: ${activePresetName}
Assessment Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

1. TOTAL DAILY WATER CONSUMPTION
------------------------------------------------------------
- Base Daily Demand: ${(totalDailyLiters - lossLiters).toLocaleString()} L/d
- Non-Revenue Water System Loss (${lossPercentage}%): ${Math.round(lossLiters).toLocaleString()} L/d
- TOTAL DAILY DEMAND: ${Math.round(totalDailyLiters).toLocaleString()} Liters/day
- Volumetric Equivalent: ${totalDailyM3.toFixed(2)} m³/day (${totalDailyMGD.toFixed(3)} MGD)

2. WATER TREATMENT PLANT (WTP) SIZING
------------------------------------------------------------
- Operating Hours: ${project.plantAssumptions.operatingHours} hours/day
- Required Net Production: ${plantResults.netProdM3h.toFixed(1)} m³/h
- Design Treatment Capacity (+${project.plantAssumptions.allowancePercent}%): ${plantResults.designCapM3h.toFixed(1)} m³/h
- Raw-Water Intake (Recovery ${project.plantAssumptions.recoveryPercent}%): ${plantResults.rawIntakeM3h.toFixed(1)} m³/h
- Daily Production: ${Math.round(plantResults.dailyProdM3d).toLocaleString()} m³/day

3. PUMP DUTY & HYDRAULIC POWER SIZING
------------------------------------------------------------
- Daily Pumping Hours: ${project.pumpAssumptions.pumpHours} hours/day
- Design Flow: ${pumpResults.designFlowM3h.toFixed(1)} m³/h (${pumpResults.flowLs.toFixed(2)} L/s)
- Total Dynamic Head (TDH): ${pumpResults.tdh} meters
- Hydraulic Shaft Power: ${pumpResults.hydraulicPowerKw.toFixed(2)} kW
- Indicative Motor Rating (15% SF): ${pumpResults.motorRatingKw.toFixed(1)} kW (${pumpResults.motorRatingHp.toFixed(1)} HP)

4. TRANSMISSION PIPE REACH HYDRAULICS
------------------------------------------------------------
- Flow Basis: ${project.pipeAssumptions.flowBasis.toUpperCase()}
- Conveyance Flow: ${pipeResults.flowLs.toFixed(2)} L/s (${pipeResults.designFlowM3s.toFixed(5)} m³/s)
- Selected Internal Diameter: DN ${pipeResults.selectedDiameterMm} mm
- Actual Flow Velocity: ${pipeResults.actualVelocity.toFixed(3)} m/s (${pipeResults.status === 'optimal' ? 'Optimal Range 0.6-2.0 m/s' : pipeResults.status.toUpperCase()})
- Hazen-Williams Head Loss: ${pipeResults.headLossM.toFixed(2)} m (${pipeResults.headLossBar.toFixed(2)} bar over ${project.pipeAssumptions.pipeLengthM}m)
- Hydraulic Slope: ${pipeResults.hydraulicGradient.toFixed(2)} m/km

Sign-off:
Verified by: Mohammad Inam
Hydraulic Engineering Division
============================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Engineering Assessment Report
              </h3>
              <p className="text-[11px] text-slate-400">
                Official documentation & print-ready hydraulic sign-off
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 flex items-center space-x-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Printable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 print:text-black">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Droplets className="w-6 h-6 text-sky-600" />
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Hydrodemand Pro
                </h1>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Comprehensive Water Assessment & Hydraulic Calculation Report
              </p>
            </div>
            <div className="text-left sm:text-right text-xs space-y-0.5">
              <p className="font-extrabold text-sky-700 dark:text-sky-400">
                Lead Engineer: Mohammad Inam
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Project: {project.name}
              </p>
              <p className="text-slate-400">
                Standard: {activePresetName} • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Section 1: Total Demand */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-lg">
              1. Total Daily Water Consumption Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Daily Demand</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {Math.round(totalDailyLiters).toLocaleString()} L/d
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Volumetric Volume</span>
                <span className="text-base font-black text-teal-600 dark:text-teal-400">
                  {totalDailyM3.toFixed(2)} m³/d
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">System Loss ({lossPercentage}%)</span>
                <span className="text-base font-black text-amber-600 dark:text-amber-400">
                  +{Math.round(lossLiters).toLocaleString()} L/d
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Treatment Sizing */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-lg">
              2. Water Treatment Plant (WTP) Sizing
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Operating Hours</span>
                <strong className="text-slate-900 dark:text-white">{project.plantAssumptions.operatingHours} h/day</strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Required Net Prod</span>
                <strong className="text-slate-900 dark:text-white">{plantResults.netProdM3h.toFixed(1)} m³/h</strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Design Capacity</span>
                <strong className="text-sky-600 dark:text-sky-400">{plantResults.designCapM3h.toFixed(1)} m³/h</strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Raw Water Intake</span>
                <strong className="text-teal-600 dark:text-teal-400">{plantResults.rawIntakeM3h.toFixed(1)} m³/h</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Pump Duty */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-lg">
              3. Delivery Pump Duty & Hydraulic Power
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Pumping Schedule</span>
                <strong className="text-slate-900 dark:text-white">{project.pumpAssumptions.pumpHours} h/day</strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Delivery Flow Rate</span>
                <strong className="text-slate-900 dark:text-white">{pumpResults.flowLs.toFixed(2)} L/s</strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Total Dynamic Head</span>
                <strong className="text-slate-900 dark:text-white">{pumpResults.tdh} meters</strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Motor Rating (+15%)</span>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {pumpResults.motorRatingKw.toFixed(1)} kW ({pumpResults.motorRatingHp.toFixed(1)} HP)
                </strong>
              </div>
            </div>
          </div>

          {/* Section 4: Pipe Reach */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-lg">
              4. Transmission Pipe Hydraulics & Friction Loss
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Selected Diameter</span>
                <strong className="text-slate-900 dark:text-white">DN {pipeResults.selectedDiameterMm} mm</strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Actual Velocity</span>
                <strong className={pipeResults.actualVelocity > 2.0 ? 'text-rose-600' : 'text-emerald-600'}>
                  {pipeResults.actualVelocity.toFixed(3)} m/s
                </strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Head Loss hf</span>
                <strong className="text-slate-900 dark:text-white">{pipeResults.headLossM.toFixed(2)} m ({pipeResults.headLossBar.toFixed(2)} bar)</strong>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Hydraulic Slope</span>
                <strong className="text-slate-900 dark:text-white">{pipeResults.hydraulicGradient.toFixed(2)} m/km</strong>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
            <div className="text-[11px] text-slate-400">
              <p>Generated by Hydrodemand Pro Engineering Suite</p>
              <p>Authentic Calculations Grounded in Hydraulic Principles</p>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-base text-slate-800 dark:text-slate-200 underline decoration-sky-500">
                Mohammad Inam
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                Principal Hydraulic Engineer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
