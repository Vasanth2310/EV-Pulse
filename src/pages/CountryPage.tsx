import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import WorldMap from "@/components/dashboard/WorldMap";
import { evData, getFilteredData, aggregateByCountry, allCountries } from "@/data/evData";
import { motion } from "framer-motion";

export default function CountryPage() {
  const [selectedParam, setSelectedParam] = useState("EV stock");

  const filtered = useMemo(() => getFilteredData(evData, { parameter: selectedParam, category: "Historical" }), [selectedParam]);
  const countryData = aggregateByCountry(filtered).slice(0, 10);

  const mapData = useMemo(() => {
    return countryData.map(d => ({ country: d.country, value: d.value, code: d.country }));
  }, [countryData]);

  const radarData = useMemo(() => {
    return allCountries.slice(0, 8).map(c => {
      const cData = evData.filter(r => r.region_country === c && r.category === "Historical" && r.year === 2024);
      return {
        country: c,
        stock: cData.filter(r => r.parameter === "EV stock").reduce((s, r) => s + r.value, 0) / 100,
        sales: cData.filter(r => r.parameter === "EV sales").reduce((s, r) => s + r.value, 0) / 100,
      };
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">Country Analysis</h1>
        <p className="text-muted-foreground mt-1">Compare EV adoption across markets</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["EV stock", "EV sales"].map(p => (
          <button key={p} onClick={() => setSelectedParam(p)} className={`filter-btn ${selectedParam === p ? "active" : ""}`}>{p}</button>
        ))}
      </div>

      {/* Interactive World Map */}
      <ChartCard title="Global EV Heatmap" subtitle="Interactive map — hover over countries to explore" delay={0.05}>
        <WorldMap data={mapData} />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top 10 EV Markets" subtitle="By total volume" delay={0.1}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={countryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="country" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Market Comparison Radar" subtitle="Stock vs Sales" delay={0.2}>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="country" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Radar name="Stock" dataKey="stock" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              <Radar name="Sales" dataKey="sales" stroke="hsl(var(--ev-blue))" fill="hsl(var(--ev-blue))" fillOpacity={0.3} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Country Rankings" subtitle="All tracked markets" delay={0.3}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th><th>Country</th><th>Total Volume (K)</th><th>Share</th><th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {countryData.map((row, i) => {
                const total = countryData.reduce((s, r) => s + r.value, 0);
                const pct = ((row.value / total) * 100).toFixed(1);
                return (
                  <motion.tr key={row.country} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <td className="font-bold text-primary">#{i + 1}</td>
                    <td className="font-medium">{row.country}</td>
                    <td>{row.value.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        {pct}%
                      </div>
                    </td>
                    <td className="text-ev-green">↗ Growing</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>

    </div>
  );
}
