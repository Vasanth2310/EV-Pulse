import { useState, useMemo } from "react";
import { BarChart3, Car, Globe, Zap, TrendingUp } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import KpiCard from "@/components/dashboard/KpiCard";
import ChartCard from "@/components/dashboard/ChartCard";
import FilterBar from "@/components/dashboard/FilterBar";
import { evData, getFilteredData, aggregateByYear, aggregateByPowertrain, aggregateByMode, getYearlyPowertrainData } from "@/data/evData";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

export default function OverviewPage() {
  const [country, setCountry] = useState("All");
  const [powertrain, setPowertrain] = useState("All");
  const [mode, setMode] = useState("All");

  const filtered = useMemo(() => getFilteredData(evData, { country, powertrain, mode, parameter: "EV stock", category: "Historical" }), [country, powertrain, mode]);
  const salesData = useMemo(() => getFilteredData(evData, { country, powertrain, mode, parameter: "EV sales", category: "Historical" }), [country, powertrain, mode]);

  const yearlyStock = aggregateByYear(filtered);
  const yearlySales = aggregateByYear(salesData);
  const ptData = aggregateByPowertrain(filtered);
  const modeData = aggregateByMode(filtered);
  const yearlyPt = getYearlyPowertrainData(filtered);

  const totalStock = filtered.reduce((s, r) => s + r.value, 0);
  const latestYear = yearlyStock[yearlyStock.length - 1]?.value || 0;
  const prevYear = yearlyStock[yearlyStock.length - 2]?.value || 1;
  const growthRate = Math.round(((latestYear - prevYear) / prevYear) * 100);

  const years = yearlyStock.length;
  const firstVal = yearlyStock[0]?.value || 1;
  const lastVal = yearlyStock[yearlyStock.length - 1]?.value || 1;
  const cagr = Math.round((Math.pow(lastVal / firstVal, 1 / Math.max(years - 1, 1)) - 1) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Global EV adoption metrics and trends</p>
        </div>
        <FilterBar country={country} powertrain={powertrain} mode={mode} onCountryChange={setCountry} onPowertrainChange={setPowertrain} onModeChange={setMode} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total EV Stock" value={`${(totalStock / 1000).toFixed(1)}M`} change={growthRate} icon={Car} color="bg-ev-green" delay={0} />
        <KpiCard title="2024 Sales" value={`${(yearlySales[yearlySales.length - 1]?.value / 1000 || 0).toFixed(1)}M`} change={18} icon={TrendingUp} color="bg-ev-blue" delay={0.1} />
        <KpiCard title="CAGR" value={`${cagr}%`} icon={BarChart3} color="bg-ev-purple" delay={0.2} />
        <KpiCard title="Markets Tracked" value="15" icon={Globe} color="bg-ev-amber" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="EV Stock Growth Trend" subtitle="Thousands of vehicles" delay={0.2}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={yearlyStock}>
              <defs>
                <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#stockGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="BEV vs PHEV Yearly Trend" subtitle="Stacked comparison" delay={0.3}>
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

        <ChartCard title="Powertrain Distribution" subtitle="BEV vs PHEV share" delay={0.4}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ptData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="value" paddingAngle={4}>
                {ptData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vehicle Mode Breakdown" subtitle="Distribution by type" delay={0.5}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={modeData} cx="50%" cy="50%" outerRadius={110} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {modeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Annual EV Sales" subtitle="Sales volume per year" delay={0.6}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearlySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
