import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawData = JSON.parse(fs.readFileSync('./data/EVDataExplorer2025.json', 'utf8'));

// Convert to EVRecord format with IDs
let idCounter = 0;
const evRecords = rawData.map(r => ({
  id: "ev-" + (++idCounter),
  region_country: r.region_country,
  category: r.category.replace('Projection-STEPS', 'Projection (STEPS)'),
  parameter: r.parameter,
  mode: r.mode,
  powertrain: r.powertrain,
  year: r.year,
  unit: r.unit,
  value: r.value
}));

// Extract unique values
const allCountries = [...new Set(evRecords.map(r => r.region_country))].filter(c => c !== 'World').sort();
const allModes = [...new Set(evRecords.map(r => r.mode))].sort();
const allPowertrains = [...new Set(evRecords.map(r => r.powertrain))].sort();
const allParameters = [...new Set(evRecords.map(r => r.parameter))].sort();

console.log('Processed', evRecords.length, 'records');
console.log('Countries:', allCountries.length);
console.log('Modes:', allModes);
console.log('Powertrains:', allPowertrains);
console.log('Parameters:', allParameters);

// Save processed data
fs.writeFileSync('./data/evData-processed.json', JSON.stringify({
  records: evRecords,
  allCountries,
  allModes,
  allPowertrains,
  allParameters
}, null, 2));
console.log('Saved processed data to evData-processed.json');
