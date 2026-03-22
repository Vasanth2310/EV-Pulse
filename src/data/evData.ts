import evDataImport from '../../data/evData-processed.json';

export interface EVRecord {
  id: string;
  region_country: string;
  category: string;
  parameter: string;
  mode: string;
  powertrain: string;
  year: number;
  unit: string;
  value: number;
}

// Import real data from XLSX file
const importedData = evDataImport as any;
const evData: EVRecord[] = importedData.records;
const allCountries: string[] = importedData.allCountries;
const allModes: string[] = importedData.allModes;
const allPowertrains: string[] = importedData.allPowertrains;
const allParameters: string[] = importedData.allParameters;

export { evData, allCountries, allModes, allPowertrains, allParameters };

export function getFilteredData(data: EVRecord[], filters: { country?: string; powertrain?: string; mode?: string; parameter?: string; category?: string }) {
  return data.filter(r => {
    if (filters.country && filters.country !== "All" && r.region_country !== filters.country) return false;
    if (filters.powertrain && filters.powertrain !== "All" && r.powertrain !== filters.powertrain) return false;
    if (filters.mode && filters.mode !== "All" && r.mode !== filters.mode) return false;
    if (filters.parameter && r.parameter !== filters.parameter) return false;
    if (filters.category && r.category !== filters.category) return false;
    return true;
  });
}

export function aggregateByYear(data: EVRecord[]): { year: number; value: number }[] {
  const map = new Map<number, number>();
  data.forEach(r => map.set(r.year, (map.get(r.year) || 0) + r.value));
  return Array.from(map.entries()).map(([year, value]) => ({ year, value })).sort((a, b) => a.year - b.year);
}

export function aggregateByCountry(data: EVRecord[]): { country: string; value: number }[] {
  const map = new Map<string, number>();
  data.forEach(r => map.set(r.region_country, (map.get(r.region_country) || 0) + r.value));
  return Array.from(map.entries()).map(([country, value]) => ({ country, value })).sort((a, b) => b.value - a.value);
}

export function aggregateByPowertrain(data: EVRecord[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  data.forEach(r => map.set(r.powertrain, (map.get(r.powertrain) || 0) + r.value));
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function aggregateByMode(data: EVRecord[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  data.forEach(r => map.set(r.mode, (map.get(r.mode) || 0) + r.value));
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function getYearlyPowertrainData(data: EVRecord[]): { year: number; BEV: number; PHEV: number }[] {
  const map = new Map<number, { BEV: number; PHEV: number }>();
  data.forEach(r => {
    const entry = map.get(r.year) || { BEV: 0, PHEV: 0 };
    entry[r.powertrain as "BEV" | "PHEV"] += r.value;
    map.set(r.year, entry);
  });
  return Array.from(map.entries()).map(([year, v]) => ({ year, ...v })).sort((a, b) => a.year - b.year);
}

export function getYearlyModeData(data: EVRecord[]): Record<string, number>[] {
  const map = new Map<number, Record<string, number>>();
  data.forEach(r => {
    const entry = map.get(r.year) || { year: r.year };
    entry[r.mode] = (entry[r.mode] || 0) + r.value;
    map.set(r.year, entry);
  });
  return Array.from(map.values()).sort((a, b) => a.year - b.year);
}
