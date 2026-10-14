import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  PieChart,
  Factory,
  Zap,
  GitBranch,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { DemandCategory } from '../types/engineering';
import { PRESET_STANDARDS } from '../utils/engineeringMath';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  tab: ActiveTab;
  category: 'Demand' | 'Treatment' | 'Pump' | 'Pipe' | 'Reference' | 'Standard';
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  categories: DemandCategory[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  categories
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build searchable catalog
  const catalog: SearchItem[] = [
    // Categories
    ...categories.map(c => ({
      id: `cat_${c.id}`,
      title: `${c.name} (${c.unit})`,
      description: `Demand category: Qty ${c.qty}, Rate ${c.rate} L/${c.unit.toLowerCase()}/d`,
      tab: 'demand' as ActiveTab,
      category: 'Demand' as const
    })),
    // Demand items
    {
      id: 'item_total_demand',
      title: 'Total Daily Water Consumption (m³/d & L/d)',
      description: 'Summed daily water consumption including Non-Revenue Water loss',
      tab: 'demand',
      category: 'Demand'
    },
    {
      id: 'item_loss_allowance',
      title: 'System Loss Allowance (%)',
      description: 'Distribution network leakage and Non-Revenue Water percentage buffer',
      tab: 'demand',
      category: 'Demand'
    },
    // Plant items
    {
      id: 'item_plant_operating_hours',
      title: 'Treatment Plant Operating Hours (h/day)',
      description: 'Daily operational shift hours for rapid sand filters & clarifiers',
      tab: 'plant',
      category: 'Treatment'
    },
    {
      id: 'item_design_capacity',
      title: 'Design Treatment Plant Capacity (m³/h)',
      description: 'Net hourly treated water capacity required with allowance cushion',
      tab: 'plant',
      category: 'Treatment'
    },
    {
      id: 'item_raw_water_intake',
      title: 'Raw-Water Intake Volume (m³/h)',
      description: 'Gross intake from river or borewell with filter backwash recovery factor',
      tab: 'plant',
      category: 'Treatment'
    },
    // Pump items
    {
      id: 'item_pump_hours',
      title: 'Pumping Hours / Shift Cycle',
      description: 'Daily delivery pump operating schedule and delivery flow duty',
      tab: 'pump',
      category: 'Pump'
    },
    {
      id: 'item_pump_tdh',
      title: 'Total Dynamic Head (TDH meters)',
      description: 'Static vertical lift elevation + friction head loss in rising main',
      tab: 'pump',
      category: 'Pump'
    },
    {
      id: 'item_shaft_power',
      title: 'Hydraulic Shaft Power (kW)',
      description: 'Hydraulic fluid power calculation: (ρ × g × Q × TDH) / Efficiency',
      tab: 'pump',
      category: 'Pump'
    },
    {
      id: 'item_motor_rating',
      title: 'Indicative Motor Rating (kW & HP)',
      description: 'Standard electric motor rating with 15% safety factor',
      tab: 'pump',
      category: 'Pump'
    },
    // Pipe items
    {
      id: 'item_pipe_velocity',
      title: 'Pipe Flow Velocity (m/s)',
      description: 'Actual fluid flow velocity vs 0.6 - 2.0 m/s recommended range',
      tab: 'pipe',
      category: 'Pipe'
    },
    {
      id: 'item_hazen_williams',
      title: 'Hazen-Williams Friction Head Loss (hf)',
      description: 'Frictional head loss formula: 10.67 × L × Q^1.852 / (C^1.852 × D^4.87)',
      tab: 'pipe',
      category: 'Pipe'
    },
    {
      id: 'item_pipe_diameter',
      title: 'Pipe Internal Diameter Sizing (mm)',
      description: 'Selected internal diameter vs theoretical diameter at target velocity',
      tab: 'pipe',
      category: 'Pipe'
    },
    // Standards
    ...PRESET_STANDARDS.map(s => ({
      id: `std_${s.id}`,
      title: s.name,
      description: `${s.authority}: ${s.description}`,
      tab: 'demand' as ActiveTab,
      category: 'Standard' as const
    })),
    // Reference items
    {
      id: 'item_flow_converter',
      title: 'Flow Rate Unit Converter (m³/d ⇄ L/s ⇄ MGD)',
      description: 'Instant conversion between metric m³/d, liters/sec, and US MGD',
      tab: 'ref',
      category: 'Reference'
    },
    {
      id: 'item_c_table',
      title: 'Pipe Roughness C-Value Table',
      description: 'PVC (150), Ductile Iron (130), Steel (120), Cast Iron (100)',
      tab: 'ref',
      category: 'Reference'
    }
  ];

  const filtered = query.trim()
    ? catalog.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : catalog.slice(0, 8);

  const getTabIcon = (tab: ActiveTab) => {
    switch (tab) {
      case 'demand': return <PieChart className="w-4 h-4 text-sky-500" />;
      case 'plant': return <Factory className="w-4 h-4 text-teal-500" />;
      case 'pump': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'pipe': return <GitBranch className="w-4 h-4 text-purple-500" />;
      case 'ref': return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-sky-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search categories, formulas, standards, parameters (e.g. TDH, velocity, hospital)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching calculation parameters or categories found for "{query}".
            </div>
          ) : (
            filtered.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.tab);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition group cursor-pointer"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    {getTabIcon(item.tab)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition text-xs font-semibold flex-shrink-0">
                  <span className="hidden sm:inline">Go to {item.tab}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <strong>ESC</strong> to dismiss or click any item to jump</span>
          <span className="font-mono">Hydrodemand Pro v2.6</span>
        </div>
      </div>
    </div>
  );
};
