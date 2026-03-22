import { motion } from "framer-motion";
import { Battery, Clock, DollarSign, Zap, TrendingUp, Gauge } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";

const batteryData = [
  { year: 2020, efficiency: 72, range: 250, cost: 140 },
  { year: 2021, efficiency: 76, range: 280, cost: 125 },
  { year: 2022, efficiency: 80, range: 320, cost: 110 },
  { year: 2023, efficiency: 84, range: 370, cost: 95 },
  { year: 2024, efficiency: 88, range: 420, cost: 80 },
];

const chargingData = [
  { time: "12am-4am", rate: 0.08, demand: "Low", recommended: true },
  { time: "4am-8am", rate: 0.12, demand: "Medium", recommended: true },
  { time: "8am-12pm", rate: 0.22, demand: "High", recommended: false },
  { time: "12pm-4pm", rate: 0.20, demand: "High", recommended: false },
  { time: "4pm-8pm", rate: 0.28, demand: "Peak", recommended: false },
  { time: "8pm-12am", rate: 0.14, demand: "Medium", recommended: true },
];

const costCompare = [
  { metric: "Fuel Cost", EV: 30, ICE: 85 },
  { metric: "Maintenance", EV: 20, ICE: 65 },
  { metric: "Insurance", EV: 55, ICE: 50 },
  { metric: "Depreciation", EV: 45, ICE: 40 },
  { metric: "Total/Month", EV: 150, ICE: 240 },
];

const optimizationScore = [
  { subject: "Charging", A: 85 }, { subject: "Efficiency", A: 92 },
  { subject: "Cost", A: 78 }, { subject: "Range", A: 88 },
  { subject: "Maintenance", A: 95 }, { subject: "Green Score", A: 90 },
];

const insights = [
  { icon: Battery, title: "Battery Efficiency Up 22%", desc: "Average battery efficiency improved from 72% to 88% over 4 years", color: "text-ev-green" },
  { icon: DollarSign, title: "43% Cost Reduction", desc: "Battery pack costs dropped from $140/kWh to $80/kWh", color: "text-ev-blue" },
  { icon: Clock, title: "Optimal Charging: 12AM–4AM", desc: "Off-peak charging saves up to 71% on electricity costs", color: "text-ev-purple" },
  { icon: Gauge, title: "Range Increased 68%", desc: "Average EV range grew from 250km to 420km since 2020", color: "text-ev-amber" },
];

export default function OptimizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-text">EV Optimization Engine</h1>
        <p className="text-muted-foreground mt-1">Smart insights for maximizing EV efficiency</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((ins, i) => (
          <motion.div key={ins.title} className="kpi-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <ins.icon className={`w-8 h-8 ${ins.color} mb-3`} />
            <p className="font-semibold text-sm">{ins.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{ins.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Battery Efficiency Trends" subtitle="Efficiency %, range (km), cost ($/kWh)" delay={0.1}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={batteryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="cost" name="Cost $/kWh" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Optimal Charging Times" subtitle="Electricity rate by time slot" delay={0.2}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chargingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="EV vs ICE Monthly Costs" subtitle="Cost comparison ($)" delay={0.3}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costCompare}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="EV" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ICE" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Optimization Score" subtitle="Overall performance radar" delay={0.4}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={optimizationScore}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Radar name="Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
