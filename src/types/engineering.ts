export interface DemandCategory {
  id: string;
  name: string;
  unit: string;
  defaultRate: number;
  qty: number;
  rate: number;
  icon: string;
  color: string;
  subtotalLiters?: number;
  subtotalM3?: number;
}

export interface PresetStandard {
  id: string;
  name: string;
  description: string;
  authority: string;
  rates: Record<string, number>;
}

export interface PlantAssumptions {
  operatingHours: number;
  allowancePercent: number;
  recoveryPercent: number;
}

export interface PlantResults {
  netProdM3h: number;
  designCapM3h: number;
  rawIntakeM3h: number;
  dailyProdM3d: number;
}

export interface PumpAssumptions {
  pumpHours: number;
  flowAllowancePercent: number;
  tdh: number;
  efficiencyPercent: number;
}

export interface PumpResults {
  designFlowM3h: number;
  flowLs: number;
  flowM3s: number;
  tdh: number;
  hydraulicPowerKw: number;
  motorRatingKw: number;
  motorRatingHp: number;
}

export type PipeFlowBasis = 'peak' | 'average' | 'custom';

export interface PipeAssumptions {
  flowBasis: PipeFlowBasis;
  customFlowLs: number;
  targetVelocity: number;
  pipeLengthM: number;
  hazenWilliamsC: number;
  selectedDiameterMm: number;
  peakFactor: number;
}

export interface PipeResults {
  designFlowM3s: number;
  flowLs: number;
  reqDiameterMm: number;
  selectedDiameterMm: number;
  actualVelocity: number;
  headLossM: number;
  headLossBar: number;
  hydraulicGradient: number; // m/km
  status: 'optimal' | 'warning-high' | 'warning-low';
  warningMessage?: string;
}

export interface ProjectState {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  engineerName: string;
  categories: DemandCategory[];
  lossPercentage: number;
  plantAssumptions: PlantAssumptions;
  pumpAssumptions: PumpAssumptions;
  pipeAssumptions: PipeAssumptions;
  activePresetId: string;
  unitPreference: 'metric' | 'us';
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  pendingChanges: number;
  cloudSyncEnabled: boolean;
}
