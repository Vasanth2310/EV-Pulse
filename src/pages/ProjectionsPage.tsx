import { useMemo } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import { evData, getFilteredData, aggregateByYear } from "@/data/evData";

export default function ProjectionsPage() {
  const historical = useMemo(() => aggregateByYear(getFilteredData(evData, { parameter: "EV stock", category: "Historical" })), []);
  const projected = useMemo(() => aggregateByYear(getFilteredData(evData, { parameter: "EV stock", category: "Projection (STEPS)" })), []);

  const combined = useMemo(() => {
    const all = [...historical.map(d => ({ ...d, type: "historical" })), ...projected.map(d => ({ ...d, type: "projected" }))];
    return all.map(d => ({
      year: d.year,
      Historical: d.type === "historical" ? d.value : undefined,
      "STEPS Projection": d.type === "projected" ? d.value : undefined,
      "Optimistic": d.type === "projected" ? Math.round(d.value * 1.3) : undefined,
      "Conservative": d.type === "projected" ? Math.round(d.value * 0.75) : undefined,
    }));
  }, [historical, projected]);

  // Connect lines at boundary
  const lastHistorical = historical[historical.length - 1];
  if (lastHistorical) {
    const bridgeIdx = combined.findIndex(d => d.year === lastHistorical.year);
    if (bridgeIdx >= 0) {
      combined[bridgeIdx]["STEPS Projection"] = lastHistorical.value;
      combined[bridgeIdx]["Optimistic"] = lastHistorical.value;
      combined[bridgeIdx]["Conservative"] = lastHistorical.value;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-text">Future Projections</h1>
        <p className="text-muted-foreground mt-1">Historical data meets scenario-based forecasts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "STEPS Scenario", desc: "Stated Policies", color: "text-ev-blue", val: projected[projected.length - 1]?.value },
          { label: "Optimistic", desc: "Accelerated adoption", color: "text-ev-green", val: Math.round((projected[projected.length - 1]?.value || 0) * 1.3) },
          { label: "Conservative", desc: "Slower growth", color: "text-ev-amber", val: Math.round((projected[projected.length - 1]?.value || 0) * 0.75) },
        ].map(s => (
          <div key={s.label} className="kpi-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
            <p className={`text-2xl font-display font-bold mt-2 ${s.color}`}>{((s.val || 0) / 1000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground">by 2030</p>
          </div>
        ))}
      </div>

      <ChartCard title="Scenario Comparison" subtitle="Historical vs projected paths" delay={0.1}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combined}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Legend />
            <ReferenceLine x={2024} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label="Now" />
            <Line type="monotone" dataKey="Historical" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} connectNulls={false} />
            <Line type="monotone" dataKey="STEPS Projection" stroke="#3b82f6" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 3 }} connectNulls={false} />
            <Line type="monotone" dataKey="Optimistic" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} connectNulls={false} />
            <Line type="monotone" dataKey="Conservative" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="STEPS Forecast Area" subtitle="Growth envelope" delay={0.2}>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={combined}>
            <defs>
              <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Area type="monotone" dataKey="Historical" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
            <Area type="monotone" dataKey="STEPS Projection" stroke="#3b82f6" fill="url(#projGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
