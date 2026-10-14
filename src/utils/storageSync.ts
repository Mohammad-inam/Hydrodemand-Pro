import { ProjectState } from '../types/engineering';
import { DEFAULT_CATEGORIES } from './engineeringMath';

const STORAGE_KEY = 'hydrodemand_active_project';
const PROJECTS_LIST_KEY = 'hydrodemand_saved_projects';

export const INITIAL_PROJECT: ProjectState = {
  id: 'proj_kp_urban_standard',
  name: 'KP Urban Standard Master Project',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  engineerName: 'Mohammad Inam',
  categories: DEFAULT_CATEGORIES,
  lossPercentage: 20,
  plantAssumptions: {
    operatingHours: 10,
    allowancePercent: 10,
    recoveryPercent: 95
  },
  pumpAssumptions: {
    pumpHours: 16,
    flowAllowancePercent: 10,
    tdh: 30,
    efficiencyPercent: 70
  },
  pipeAssumptions: {
    flowBasis: 'peak',
    customFlowLs: 155.53,
    targetVelocity: 1.0,
    pipeLengthM: 1000,
    hazenWilliamsC: 130,
    selectedDiameterMm: 200,
    peakFactor: 1.8
  },
  activePresetId: 'kp_urban',
  unitPreference: 'metric'
};

export function loadSavedProject(): ProjectState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_PROJECT,
        ...parsed,
        categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES
      };
    }
  } catch (err) {
    console.error('Failed to load project from localStorage:', err);
  }
  return INITIAL_PROJECT;
}

export function saveActiveProject(project: ProjectState): void {
  try {
    const updated = {
      ...project,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Also save in projects list for slot management
    const savedList = getSavedProjectsList();
    const existingIdx = savedList.findIndex(p => p.id === project.id);
    if (existingIdx >= 0) {
      savedList[existingIdx] = updated;
    } else {
      savedList.unshift(updated);
    }
    localStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(savedList.slice(0, 10)));
  } catch (err) {
    console.error('Failed to save project:', err);
  }
}

export function getSavedProjectsList(): ProjectState[] {
  try {
    const raw = localStorage.getItem(PROJECTS_LIST_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read saved projects list:', err);
  }
  return [INITIAL_PROJECT];
}

export function exportProjectAsJSON(project: ProjectState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_hydrodemand.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseProjectFromJSON(jsonString: string): ProjectState {
  const data = JSON.parse(jsonString);
  if (!data.categories || !Array.isArray(data.categories)) {
    throw new Error('Invalid project file format: missing categories');
  }
  return {
    ...INITIAL_PROJECT,
    ...data,
    id: data.id || `proj_${Date.now()}`,
    updatedAt: new Date().toISOString()
  };
}
