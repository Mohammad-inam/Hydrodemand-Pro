import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Bookmark,
  Percent,
  Plus,
  Trash2,
  FileDown,
  Save,
  RotateCcw,
  Sparkles,
  PieChart as PieIcon,
  BarChart2,
  Search,
  CheckCircle2,
  Home,
  Building2,
  Briefcase,
  Store,
  GraduationCap,
  Building,
  Landmark,
  Trees,
  Factory
} from 'lucide-react';
import { DemandCategory } from '../types/engineering';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface DemandModuleProps {
  categories: DemandCategory[];
  lossPercentage: number;
  onUpdateCategoryQty: (index: number, val: number) => void;
  onUpdateCategoryRate: (index: number, val: number) => void;
  onUpdateLossPercentage: (val: number) => void;
  onAddCategory: (category: DemandCategory) => void;
  onDeleteCategory: (id: string) => void;
  onOpenPresets: () => void;
  onExportReport: () => void;
  onSaveProject: () => void;
  onResetDefaults: () => void;
  activePresetName: string;
  totalDailyLiters: number;
  totalDailyM3: number;
  totalDailyMGD: number;
  lossLiters: number;
  isDarkMode: boolean;
}

// Icon mapping helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Home': return <Home className="w-4 h-4" />;
    case 'Building2': return <Building2 className="w-4 h-4" />;
    case 'Briefcase': return <Briefcase className="w-4 h-4" />;
    case 'Store': return <Store className="w-4 h-4" />;
    case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
    case 'Building': return <Building className="w-4 h-4" />;
    case 'Landmark': return <Landmark className="w-4 h-4" />;
    case 'Trees': return <Trees className="w-4 h-4" />;
    case 'Factory': return <Factory className="w-4 h-4" />;
    default: return <Building className="w-4 h-4" />;
  }
};

export const DemandModule: React.FC<DemandModuleProps> = ({
  categories,
  lossPercentage,
  onUpdateCategoryQty,
  onUpdateCategoryRate,
  onUpdateLossPercentage,
  onAddCategory,
  onDeleteCategory,
  onOpenPresets,
  onExportReport,
  onSaveProject,
  onResetDefaults,
  activePresetName,
  totalDailyLiters,
  totalDailyM3,
  totalDailyMGD,
  lossLiters,
  isDarkMode
}) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatUnit, setNewCatUnit] = useState('UNITS');
  const [newCatQty, setNewCatQty] = useState(100);
  const [newCatRate, setNewCatRate] = useState(150);

  // Filtered categories
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(categoryFilter.toLowerCase()) ||
    c.unit.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  // Prepare chart data
  const chartLabels = [...categories.map(c => c.name), 'System Loss Allowance'];
  const chartDataValues = [...categories.map(c => c.subtotalLiters || 0), lossLiters];
  const chartColors = [...categories.map(c => c.color), isDarkMode ? '#64748b' : '#475569'];

  const doughnutData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataValues,
        backgroundColor: chartColors,
        borderColor: isDarkMode ? '#0f172a' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const barData = {
    labels: ['Water Consumption Breakdown'],
    datasets: chartLabels.map((label, idx) => ({
      label,
      data: [chartDataValues[idx]],
      backgroundColor: chartColors[idx]
    }))
  };

  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newCat: DemandCategory = {
      id: `custom_${Date.now()}`,
      name: newCatName.trim(),
      unit: newCatUnit.trim().toUpperCase() || 'PERSONS',
      defaultRate: Number(newCatRate) || 100,
      qty: Number(newCatQty) || 1,
      rate: Number(newCatRate) || 100,
      icon: 'Building',
      color: randomColor
    };
    onAddCategory(newCat);
    setNewCatName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Active Preset Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden border border-sky-900/40">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-sky-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wider mb-1.5">
              <Bookmark className="w-3 h-3 mr-1 text-sky-400" /> Active Engineering Standard
            </span>
            <h2 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
              <span>{activePresetName}</span>
              <span className="text-xs px-2 py-0.5 bg-sky-400/20 text-sky-200 rounded-md font-mono">
                {categories.length} Categories
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Standardized baseline consumption rates for municipal design, water treatment capacity, and transmission main hydraulics.
            </p>
          </div>
          <div className="flex items-center space-x-2 self-stretch sm:self-auto">
            <button
              onClick={onOpenPresets}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition shadow-md shadow-sky-500/25 cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Change Preset</span>
            </button>
            <button
              onClick={onResetDefaults}
              className="px-2.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-medium transition cursor-pointer"
              title="Reset Rates to Standard Default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Volumetric Metrics Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Total Daily Water Demand
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Summed base consumption plus distribution loss factor
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-Calculated</span>
            </span>
          </div>
        </div>

        {/* 3 Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50/50 dark:from-slate-800/80 dark:to-sky-950/30 border border-sky-100 dark:border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider block mb-1">
              Daily Consumption (Liters)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-sky-950 dark:text-sky-100 tracking-tight">
              {Math.round(totalDailyLiters).toLocaleString()}
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              Liters / day (L/d)
            </span>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-slate-800/80 dark:to-teal-950/30 border border-teal-100 dark:border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block mb-1">
              Volumetric Equivalent (m³)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-teal-900 dark:text-teal-100 tracking-tight">
              {totalDailyM3.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              m³ / day
            </span>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-purple-950/30 border border-purple-100 dark:border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider block mb-1">
              US Municipal Equivalent
            </span>
            <div className="text-2xl sm:text-3xl font-black text-purple-900 dark:text-purple-100 tracking-tight">
              {totalDailyMGD.toFixed(3)}
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              Million Gallons / day (MGD)
            </span>
          </div>
        </div>

        {/* System Loss Factor Control */}
        <div className="bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/25 dark:border-amber-800/50 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-200 block">
                Non-Revenue Water & System Loss Allowance
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Accounts for pipe leakages, illegal tappings, meter inaccuracies, and firefighting buffer.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Rate:</span>
            <div className="relative">
              <input
                type="number"
                value={lossPercentage}
                min="0"
                max="50"
                step="1"
                onChange={e => onUpdateLossPercentage(parseFloat(e.target.value) || 0)}
                className="w-16 text-center font-extrabold bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg px-2 py-1 text-amber-900 dark:text-amber-300 text-xs shadow-xs"
              />
              <span className="absolute right-1.5 top-1 text-[10px] font-bold text-amber-600">%</span>
            </div>
            <span className="font-extrabold text-amber-700 dark:text-amber-400 px-2 py-1 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              +{Math.round(lossLiters).toLocaleString()} L/d
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Consumption Breakdown
            </h3>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setChartType('donut')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1 ${
                  chartType === 'donut'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>Donut</span>
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1 ${
                  chartType === 'bar'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Stacked</span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[240px] max-h-[280px] flex items-center justify-center py-2">
            {chartType === 'donut' ? (
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            ) : (
              <Bar
                data={barData}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { stacked: true, display: false },
                    y: { stacked: true, display: false }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            )}
          </div>

          {/* Quick Stats Pill */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Top Share: <strong className="text-sky-600 dark:text-sky-400 font-extrabold">
                {categories.length > 0 ? categories[0].name : 'N/A'}
              </strong>
            </span>
          </div>
        </div>

        {/* Breakdown List Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Distribution Shares
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Total: {(totalDailyM3).toFixed(2)} m³/d
            </span>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {categories.map(cat => {
              const subM3 = (cat.subtotalM3 || 0);
              const pct = totalDailyLiters > 0 ? (((cat.subtotalLiters || 0) / totalDailyLiters) * 100).toFixed(1) : '0';
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {subM3.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m³/d
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold w-12 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* System Loss row */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 text-xs border border-amber-200/50 dark:border-amber-900/40 font-bold">
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <span className="w-3 h-3 rounded-full bg-slate-500 flex-shrink-0"></span>
                <span className="text-amber-900 dark:text-amber-300 truncate">
                  System Loss Allowance ({lossPercentage}%)
                </span>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <span className="font-mono font-bold text-amber-950 dark:text-amber-200">
                  {(lossLiters / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m³/d
                </span>
                <span className="text-amber-700 dark:text-amber-400 w-12 text-right">
                  {totalDailyLiters > 0 ? ((lossLiters / totalDailyLiters) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demand Categories Editor Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center space-x-2">
              <span>Demand Categories & Quantity Rates</span>
              <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md font-mono">
                {categories.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust demographic counts and per-capita daily water allocations
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Category Search Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter categories..."
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-40 sm:w-48 pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Add Custom Category Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom</span>
            </button>
          </div>
        </div>

        {/* Dynamic Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCategories.map((cat) => {
            const originalIndex = categories.findIndex(c => c.id === cat.id);
            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition duration-200 space-y-3 relative group"
              >
                {/* Header of category card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Unit: <span className="font-semibold text-slate-600 dark:text-slate-300">{cat.unit}</span>
                      </p>
                    </div>
                  </div>

                  {/* Volume Pill & Delete custom */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-[11px] font-black text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-lg border border-sky-100 dark:border-sky-900/40">
                      {(cat.subtotalM3 || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })} m³/d
                    </span>
                    {cat.id.startsWith('custom_') && (
                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                        title="Delete custom category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Numeric Inputs Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                      Quantity ({cat.unit})
                    </label>
                    <input
                      type="number"
                      value={cat.qty}
                      min="0"
                      onChange={e => onUpdateCategoryQty(originalIndex, parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                      Rate (L/{cat.unit.toLowerCase()}/d)
                    </label>
                    <input
                      type="number"
                      value={cat.rate}
                      min="0"
                      onChange={e => onUpdateCategoryRate(originalIndex, parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Subtotal line */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400">
                  <span>Subtotal consumption:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                    {(cat.subtotalLiters || 0).toLocaleString()} L/day
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-3">
        <button
          onClick={onExportReport}
          className="flex-1 py-3.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-600/25 flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Export Official Engineering PDF Report</span>
        </button>
        <button
          onClick={onSaveProject}
          className="flex-1 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save & Sync Project State</span>
        </button>
      </div>

      {/* Add Custom Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Add Custom Demand Category
            </h3>
            <form onSubmit={handleAddNewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sports Stadium, Airport, Resort"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newCatUnit}
                    onChange={e => setNewCatUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCatQty}
                    onChange={e => setNewCatQty(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rate (L/d)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCatRate}
                    onChange={e => setNewCatRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
