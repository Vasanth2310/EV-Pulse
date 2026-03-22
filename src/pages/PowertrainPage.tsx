import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import FilterBar from "@/components/dashboard/FilterBar";
import { evData, getFilteredData, aggregateByPowertrain, getYearlyPowertrainData } from "@/data/evData";

const COLORS = ["#10b981", "#3b82f6"];

export default function PowertrainPage() {
  const [country, setCountry] = useState("All");
  const [mode, setMode] = useState("All");

  const filtered = useMemo(() => getFilteredData(evData, { country, mode, parameter: "EV stock", category: "Historical" }), [country, mode]);
  const ptData = aggregateByPowertrain(filtered);
  const yearlyPt = getYearlyPowertrainData(filtered);

  const growthData = useMemo(() => {
    return yearlyPt.map((d, i) => ({
      year: d.year,
      "BEV Growth": i > 0 ? Math.round(((d.BEV - yearlyPt[i-1].BEV) / yearlyPt[i-1].BEV) * 100) : 0,
      "PHEV Growth": i > 0 ? Math.round(((d.PHEV - yearlyPt[i-1].PHEV) / yearlyPt[i-1].PHEV) * 100) : 0,
    }));
  }, [yearlyPt]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Powertrain Analysis</h1>
          <p className="text-muted-foreground mt-1">BEV vs PHEV deep dive</p>
        </div>
        <FilterBar country={country} powertrain="All" mode={mode} onCountryChange={setCountry} onPowertrainChange={() => {}} onModeChange={setMode} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ptData.map((pt, i) => (
          <div key={pt.name} className="kpi-card">
            <p className="text-sm text-muted-foreground">{pt.name} Total Stock</p>
            <p className="text-3xl font-display font-bold mt-2" style={{ color: COLORS[i] }}>{(pt.value / 1000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground mt-1">{((pt.value / ptData.reduce((s, p) => s + p.value, 0)) * 100).toFixed(1)}% of total</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Powertrain Distribution" subtitle="Current split" delay={0.1}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ptData} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="value" paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {ptData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Yearly Stacked Trend" subtitle="BEV & PHEV over time" delay={0.2}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyPt}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="BEV" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="PHEV" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Growth Rate Comparison" subtitle="Year-over-year growth %" delay={0.3}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData.slice(1)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="BEV Growth" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
            <Line type="monotone" dataKey="PHEV Growth" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
