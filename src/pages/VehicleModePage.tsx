import { useMemo, useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import { evData, getFilteredData, getYearlyModeData, aggregateByMode } from "@/data/evData";

const MODE_COLORS: Record<string, string> = { Cars: "#10b981", Buses: "#3b82f6", "2-Wheelers": "#8b5cf6", "3-Wheelers": "#f59e0b" };

export default function VehicleModePage() {
  const [country, setCountry] = useState("All");

  const filtered = useMemo(() => getFilteredData(evData, { country, parameter: "EV stock", category: "Historical" }), [country]);
  const modeData = aggregateByMode(filtered);
  const yearlyMode = getYearlyModeData(filtered);
  const modes = ["Cars", "Buses", "2-Wheelers", "3-Wheelers"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Vehicle Mode Analysis</h1>
          <p className="text-muted-foreground mt-1">Breakdown by vehicle type</p>
        </div>
        <select value={country} onChange={e => setCountry(e.target.value)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm font-medium">
          <option value="All">All Countries</option>
          {["China", "USA", "Germany", "Norway", "India"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {modeData.map((m, i) => (
          <div key={m.name} className="kpi-card">
            <div className="w-3 h-3 rounded-full mb-2" style={{ background: MODE_COLORS[m.name] }} />
            <p className="text-sm text-muted-foreground">{m.name}</p>
            <p className="text-2xl font-display font-bold mt-1">{(m.value / 1000).toFixed(1)}M</p>
          </div>
        ))}
      </div>

      <ChartCard title="Mode Trends Over Time" subtitle="Stacked area chart" delay={0.1}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={yearlyMode}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Legend />
            {modes.map(m => (
              <Area key={m} type="monotone" dataKey={m} stackId="1" stroke={MODE_COLORS[m]} fill={MODE_COLORS[m]} fillOpacity={0.4} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Yearly Volume by Mode" subtitle="Bar chart comparison" delay={0.2}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={yearlyMode}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Legend />
            {modes.map(m => (
              <Bar key={m} dataKey={m} fill={MODE_COLORS[m]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
