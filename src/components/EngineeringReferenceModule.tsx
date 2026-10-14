import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRightLeft,
  Table,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { PIPE_MATERIAL_C_VALUES, PRESET_STANDARDS } from '../utils/engineeringMath';

export const EngineeringReferenceModule: React.FC = () => {
  // Unit conversion state
  const [m3dVal, setM3dVal] = useState<number>(10000);
  const [headMVal, setHeadMVal] = useState<number>(50);
  const [kwVal, setKwVal] = useState<number>(75);

  // Derived conversions
  const flowLs = (m3dVal * 1000) / 86400;
  const flowMgd = m3dVal * 0.000264172;
  const flowGpm = flowLs * 15.8503;

  const pressBar = headMVal * 0.0980665;
  const pressPsi = headMVal * 1.42233;
  const pressKpa = headMVal * 9.80665;

  const powerHp = kwVal * 1.34102;
  const powerBtu = kwVal * 3412.14;

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-slate-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500/30 text-sky-300 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-sky-300 uppercase px-2 py-0.5 rounded-full bg-sky-500/20">
              Module 05
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Hydraulic Reference & Engineering Unit Converters
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl">
          Quick-access hydraulic converters, international design codes, and pipe roughness Hazen-Williams coefficients.
        </p>
      </div>

      {/* Interactive Quick Converters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Converter 1: Flow */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Volumetric Flow Converter</span>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Input: m³ / day
            </label>
            <input
              type="number"
              value={m3dVal}
              onChange={e => setM3dVal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Liters / second:</span>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{flowLs.toFixed(2)} L/s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">US MGD:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{flowMgd.toFixed(3)} MGD</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Gallons / min:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{Math.round(flowGpm).toLocaleString()} gpm</span>
            </div>
          </div>
        </div>

        {/* Converter 2: Pressure & Head */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Pressure & Head Converter</span>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Input: Head in Meters (m)
            </label>
            <input
              type="number"
              value={headMVal}
              onChange={e => setHeadMVal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Bar:</span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{pressBar.toFixed(3)} bar</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Pound / sq inch:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{pressPsi.toFixed(2)} psi</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Kilopascal:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{pressKpa.toFixed(1)} kPa</span>
            </div>
          </div>
        </div>

        {/* Converter 3: Power */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Pump Motor Power</span>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Input: Kilowatts (kW)
            </label>
            <input
              type="number"
              value={kwVal}
              onChange={e => setKwVal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Horsepower (HP):</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{powerHp.toFixed(2)} HP</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">BTU / hour:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{Math.round(powerBtu).toLocaleString()} BTU/h</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Safety margin (+15%):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{(kwVal * 1.15).toFixed(2)} kW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hazen-Williams Roughness C Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-sky-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Standard Pipe Roughness (Hazen-Williams C Coefficient)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">ASCE / AWWA Standard Reference</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3 font-bold">Pipe Material Specification</th>
                <th className="py-2.5 px-3 font-bold">Design C Value</th>
                <th className="py-2.5 px-3 font-bold">Friction Characteristics</th>
                <th className="py-2.5 px-3 font-bold">Primary Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PIPE_MATERIAL_C_VALUES.map((mat, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{mat.name}</td>
                  <td className="py-2.5 px-3 font-mono font-extrabold text-sky-600 dark:text-sky-400">{mat.c}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                    {mat.c >= 140 ? 'Extremely Smooth (Low Loss)' : mat.c >= 120 ? 'Moderate Smooth' : 'High Friction Loss'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                    {mat.c >= 140 ? 'Modern Water Mains / Force Mains' : 'Urban Distribution Networks'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standards Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRESET_STANDARDS.map(std => (
          <div
            key={std.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center space-x-1.5 text-sky-600 dark:text-sky-400 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{std.authority}</span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{std.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {std.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
