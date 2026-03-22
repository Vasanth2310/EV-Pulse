import { allCountries, allPowertrains, allModes } from "@/data/evData";

interface FilterBarProps {
  country: string;
  powertrain: string;
  mode: string;
  onCountryChange: (v: string) => void;
  onPowertrainChange: (v: string) => void;
  onModeChange: (v: string) => void;
}

export default function FilterBar({ country, powertrain, mode, onCountryChange, onPowertrainChange, onModeChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={country}
        onChange={e => onCountryChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="All">All Countries</option>
        {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        value={powertrain}
        onChange={e => onPowertrainChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="All">All Powertrains</option>
        {allPowertrains.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select
        value={mode}
        onChange={e => onModeChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="All">All Modes</option>
        {allModes.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  );
}
