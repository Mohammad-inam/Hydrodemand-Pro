import {
  DemandCategory,
  PlantAssumptions,
  PlantResults,
  PumpAssumptions,
  PumpResults,
  PipeAssumptions,
  PipeResults,
  PresetStandard
} from '../types/engineering';

export const DEFAULT_CATEGORIES: DemandCategory[] = [
  { id: 'residential', name: 'Residential (Urban, Full Plumbing)', unit: 'CAPITA', defaultRate: 225, qty: 5000, rate: 1200, icon: 'Home', color: '#0284c7' },
  { id: 'highrises', name: 'High Rises', unit: 'CAPITA', defaultRate: 200, qty: 5200, rate: 1000, icon: 'Building2', color: '#0369a1' },
  { id: 'offices', name: 'Offices & Commercial Staff', unit: 'STAFF', defaultRate: 67.5, qty: 1200, rate: 100, icon: 'Briefcase', color: '#64748b' },
  { id: 'commercial', name: 'Commercial Facilities', unit: 'PERSONS', defaultRate: 150, qty: 902.5, rate: 150, icon: 'Store', color: '#0d9488' },
  { id: 'education', name: 'Educational Institutions', unit: 'PUPILS', defaultRate: 100, qty: 1600, rate: 100, icon: 'GraduationCap', color: '#0ea5e9' },
  { id: 'hospitals', name: 'Hospitals & Healthcare', unit: 'BEDS', defaultRate: 250, qty: 890, rate: 250, icon: 'Building', color: '#38bdf8' },
  { id: 'mosques', name: 'Mosques & Religious Places', unit: 'PERSONS', defaultRate: 50, qty: 30000, rate: 50, icon: 'Landmark', color: '#0f766e' },
  { id: 'parks', name: 'Parks & Public Gardens', unit: 'HA', defaultRate: 230, qty: 1, rate: 230, icon: 'Trees', color: '#6366f1' },
  { id: 'industrial', name: 'Industrial Zones', unit: 'HA', defaultRate: 300, qty: 1000, rate: 300, icon: 'Factory', color: '#14b8a6' }
];

export const PRESET_STANDARDS: PresetStandard[] = [
  {
    id: 'kp_urban',
    name: 'KP Urban Standard 2026',
    description: 'Khyber Pakhtunkhwa Urban & Metropolitan master plan baseline standard',
    authority: 'Government of KP / Peshawar Development Authority',
    rates: {
      residential: 1200,
      highrises: 1000,
      offices: 100,
      commercial: 150,
      education: 100,
      hospitals: 250,
      mosques: 50,
      parks: 230,
      industrial: 300
    }
  },
  {
    id: 'who_standard',
    name: 'WHO International Minimum Standard',
    description: 'World Health Organization humanitarian & basic urban benchmark',
    authority: 'WHO / UNICEF Joint Monitoring Programme',
    rates: {
      residential: 150,
      highrises: 150,
      offices: 45,
      commercial: 50,
      education: 45,
      hospitals: 200,
      mosques: 25,
      parks: 100,
      industrial: 150
    }
  },
  {
    id: 'asce_awwa',
    name: 'ASCE / AWWA High Demand Benchmark',
    description: 'American Water Works Association standard suburban municipal distribution',
    authority: 'AWWA M32 Manual of Water Supply Practices',
    rates: {
      residential: 350,
      highrises: 300,
      offices: 80,
      commercial: 180,
      education: 120,
      hospitals: 380,
      mosques: 40,
      parks: 350,
      industrial: 450
    }
  }
];

export const STANDARD_PIPE_DIAMETERS = [
  50, 75, 90, 110, 160, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000
];

export const PIPE_MATERIAL_C_VALUES = [
  { name: 'PVC / HDPE (New Smooth)', c: 150 },
  { name: 'Ductile Iron (Cement Mortar Lined)', c: 130 },
  { name: 'Steel (Welded & Smooth)', c: 120 },
  { name: 'Cast Iron (Old / Moderate Age)', c: 100 },
  { name: 'Concrete Pipe', c: 110 }
];

// Calculation Functions
export function calculateDemandTotals(categories: DemandCategory[], lossPercent: number) {
  let baseLiters = 0;
  const detailedCategories = categories.map(cat => {
    const subtotal = (cat.qty || 0) * (cat.rate || 0);
    baseLiters += subtotal;
    return {
      ...cat,
      subtotalLiters: subtotal,
      subtotalM3: subtotal / 1000
    };
  });

  const lossLiters = baseLiters * (lossPercent / 100);
  const totalDailyLiters = baseLiters + lossLiters;
  const totalDailyM3 = totalDailyLiters / 1000;
  const totalDailyMGD = totalDailyM3 * 0.000264172; // US MGD

  return {
    categories: detailedCategories,
    baseLiters,
    lossLiters,
    totalDailyLiters,
    totalDailyM3,
    totalDailyMGD
  };
}

export function calculatePlant(totalDailyM3: number, assumptions: PlantAssumptions): PlantResults {
  const hours = Math.max(0.1, assumptions.operatingHours || 10);
  const allowance = Math.max(0, assumptions.allowancePercent || 0);
  const recovery = Math.max(1, assumptions.recoveryPercent || 95);

  const netProdM3h = totalDailyM3 / hours;
  const designCapM3h = netProdM3h * (1 + (allowance / 100));
  const rawIntakeM3h = designCapM3h / (recovery / 100);
  const dailyProdM3d = designCapM3h * hours;

  return {
    netProdM3h,
    designCapM3h,
    rawIntakeM3h,
    dailyProdM3d
  };
}

export function calculatePump(totalDailyM3: number, assumptions: PumpAssumptions): PumpResults {
  const hours = Math.max(0.1, assumptions.pumpHours || 16);
  const allowance = Math.max(0, assumptions.flowAllowancePercent || 0);
  const tdh = Math.max(0.1, assumptions.tdh || 30);
  const eff = Math.min(100, Math.max(1, assumptions.efficiencyPercent || 70));

  const designFlowM3h = (totalDailyM3 / hours) * (1 + (allowance / 100));
  const flowLs = (designFlowM3h * 1000) / 3600;
  const flowM3s = designFlowM3h / 3600;

  // Hydraulic Shaft Power (kW) = (rho * g * Q * TDH) / (eff/100) / 1000
  // rho = 1000 kg/m^3, g = 9.81 m/s^2
  const hydraulicPowerKw = (1000 * 9.81 * flowM3s * tdh) / (eff / 100) / 1000;
  const motorRatingKw = hydraulicPowerKw * 1.15; // 15% safety factor
  const motorRatingHp = motorRatingKw * 1.34102;

  return {
    designFlowM3h,
    flowLs,
    flowM3s,
    tdh,
    hydraulicPowerKw,
    motorRatingKw,
    motorRatingHp
  };
}

export function calculatePipe(totalDailyM3: number, assumptions: PipeAssumptions): PipeResults {
  let flowM3s = 0;
  const peakFactor = assumptions.peakFactor || 1.8;

  if (assumptions.flowBasis === 'custom') {
    flowM3s = (assumptions.customFlowLs || 155.53) / 1000;
  } else if (assumptions.flowBasis === 'peak') {
    flowM3s = (totalDailyM3 * peakFactor) / 86400;
  } else {
    // average daily
    flowM3s = totalDailyM3 / 86400;
  }

  const flowLs = flowM3s * 1000;
  const targetV = Math.max(0.05, assumptions.targetVelocity || 1.0);
  const selectedDiameterMm = Math.max(1, assumptions.selectedDiameterMm || 200);
  const selectedDiameterM = selectedDiameterMm / 1000;
  const lengthM = Math.max(1, assumptions.pipeLengthM || 1000);
  const c = Math.max(10, assumptions.hazenWilliamsC || 130);

  // Required Diameter: D = sqrt( (4 * Q) / (pi * v) )
  const reqDiaM = Math.sqrt((4 * flowM3s) / (Math.PI * targetV));
  const reqDiameterMm = reqDiaM * 1000;

  // Actual Velocity: v = Q / Area
  const areaM2 = (Math.PI * Math.pow(selectedDiameterM, 2)) / 4;
  const actualVelocity = flowM3s / areaM2;

  // Hazen-Williams Head Loss (hf in meters):
  // hf = 10.67 * L * (Q^1.852) / (C^1.852 * D^4.87)
  const headLossM = (10.67 * lengthM * Math.pow(flowM3s, 1.852)) / (Math.pow(c, 1.852) * Math.pow(selectedDiameterM, 4.87));
  const headLossBar = headLossM * 0.0980665;
  const hydraulicGradient = (headLossM / lengthM) * 1000; // m per 1000m (m/km)

  let status: 'optimal' | 'warning-high' | 'warning-low' = 'optimal';
  let warningMessage: string | undefined;

  if (actualVelocity > 2.0) {
    status = 'warning-high';
    warningMessage = `High Velocity Alert (${actualVelocity.toFixed(2)} m/s): Pipe diameter ${selectedDiameterMm}mm is undersized. Recommended size is at least ${Math.ceil(reqDiameterMm)}mm to prevent excessive friction loss (>2.0 m/s) and water hammer shock.`;
  } else if (actualVelocity < 0.6 && flowM3s > 0) {
    status = 'warning-low';
    warningMessage = `Low Velocity Warning (${actualVelocity.toFixed(2)} m/s): Flow velocity is below the self-cleansing threshold (0.6 m/s), which can lead to sediment deposition and biofilm accumulation.`;
  }

  return {
    designFlowM3s: flowM3s,
    flowLs,
    reqDiameterMm,
    selectedDiameterMm,
    actualVelocity,
    headLossM,
    headLossBar,
    hydraulicGradient,
    status,
    warningMessage
  };
}
