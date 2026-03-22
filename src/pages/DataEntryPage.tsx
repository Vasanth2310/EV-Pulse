import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import { EVRecord, allCountries, allModes, allPowertrains, allParameters } from "@/data/evData";
import { toast } from "sonner";

export default function DataEntryPage() {
  const [records, setRecords] = useState<EVRecord[]>([]);
  const [newEntryIds, setNewEntryIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    region_country: "China",
    parameter: "EV stock",
    mode: "Cars",
    powertrain: "BEV",
    year: "2024",
    unit: "Thousands",
    value: "",
  });

  const addRecord = () => {
    if (!form.value) {
      toast.error("Please enter a value");
      return;
    }
    const id = `manual-${Date.now()}`;
    const record: EVRecord = {
      id,
      region_country: form.region_country,
      category: "Manual Entry",
      parameter: form.parameter,
      mode: form.mode,
      powertrain: form.powertrain,
      year: parseInt(form.year),
      unit: form.unit,
      value: parseFloat(form.value),
    };
    setRecords((prev) => [record, ...prev]);
    setNewEntryIds((prev) => new Set([...prev, id]));
    setForm((prev) => ({ ...prev, value: "" }));
    toast.success("Record added successfully");

    // Auto-remove highlight after 5 seconds
    setTimeout(() => {
      setNewEntryIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }, 5000);
  };

  const removeRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setNewEntryIds((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
    toast.info("Record removed");
  };

  // Data aggregation for visualizations
  const yearlyData = useMemo(() => {
    const map = new Map<number, { value: number; newValue: number }>();
    records.forEach((r) => {
      const existing = map.get(r.year) || { value: 0, newValue: 0 };
      if (newEntryIds.has(r.id)) {
        existing.newValue += r.value;
      } else {
        existing.value += r.value;
      }
      map.set(r.year, existing);
    });
    return Array.from(map.entries())
      .map(([year, data]) => ({ year, ...data }))
      .sort((a, b) => a.year - b.year);
  }, [records, newEntryIds]);

  const countryData = useMemo(() => {
    const map = new Map<string, { value: number; newValue: number }>();
    records.forEach((r) => {
      const existing = map.get(r.region_country) || { value: 0, newValue: 0 };
      if (newEntryIds.has(r.id)) {
        existing.newValue += r.value;
      } else {
        existing.value += r.value;
      }
      map.set(r.region_country, existing);
    });
    return Array.from(map.entries())
      .map(([country, data]) => ({ country, ...data, totalValue: data.value + data.newValue }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);
  }, [records, newEntryIds]);

  const modeData = useMemo(() => {
    const map = new Map<string, { value: number; newValue: number }>();
    records.forEach((r) => {
      const existing = map.get(r.mode) || { value: 0, newValue: 0 };
      if (newEntryIds.has(r.id)) {
        existing.newValue += r.value;
      } else {
        existing.value += r.value;
      }
      map.set(r.mode, existing);
    });
    return Array.from(map.entries()).map(([mode, data]) => ({
      mode,
      ...data,
      totalValue: data.value + data.newValue,
    }));
  }, [records, newEntryIds]);

  const powertrainData = useMemo(() => {
    const map = new Map<string, { value: number; newValue: number }>();
    records.forEach((r) => {
      const existing = map.get(r.powertrain) || { value: 0, newValue: 0 };
      if (newEntryIds.has(r.id)) {
        existing.newValue += r.value;
      } else {
        existing.value += r.value;
      }
      map.set(r.powertrain, existing);
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      ...data,
      totalValue: data.value + data.newValue,
    }));
  }, [records, newEntryIds]);

  const exportCSV = () => {
    if (records.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["Country", "Parameter", "Mode", "Powertrain", "Year", "Unit", "Value"];
    const rows = records.map((r) => [r.region_country, r.parameter, r.mode, r.powertrain, r.year, r.unit, r.value]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ev_data_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Data Entry & Visualization</h1>
          <p className="text-muted-foreground mt-1">Add data records and see real-time visualization with highlighting</p>
        </div>
        <button
          onClick={exportCSV}
          className="filter-btn active flex items-center gap-2"
          disabled={records.length === 0}
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-display font-semibold mb-4">Add New Record</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Country</label>
            <select
              value={form.region_country}
              onChange={(e) => setForm((p) => ({ ...p, region_country: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm"
            >
              {allCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Parameter</label>
            <select
              value={form.parameter}
              onChange={(e) => setForm((p) => ({ ...p, parameter: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm"
            >
              {allParameters.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Vehicle Mode</label>
            <select
              value={form.mode}
              onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm"
            >
              {allModes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Powertrain</label>
            <select
              value={form.powertrain}
              onChange={(e) => setForm((p) => ({ ...p, powertrain: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm"
            >
              {allPowertrains.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Year</label>
            <input
              type="number"
              min="2010"
              max="2030"
              value={form.year}
              onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm"
            >
              <option value="Thousands">Thousands</option>
              <option value="%">%</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Value</label>
            <input
              type="number"
              step="0.1"
              value={form.value}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm"
              placeholder="Enter value"
            />
          </div>
          <div className="flex items-end">
            <button onClick={addRecord} className="filter-btn active w-full flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>
      </motion.div>

      {/* Visualizations */}
      {records.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Entries by Year" subtitle="New entries highlighted in gold" delay={0.1}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Existing" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="newValue" fill="#f59e0b" name="New Entries" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Countries" subtitle="New entries highlighted in gold" delay={0.2}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="country" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Existing" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="newValue" fill="#f59e0b" name="New Entries" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="By Vehicle Mode" subtitle="Distribution of entries" delay={0.3}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mode" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Existing" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="newValue" fill="#f59e0b" name="New Entries" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="By Powertrain Type" subtitle="Distribution of entries" delay={0.4}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={powertrainData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#8b5cf6" name="Existing" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="newValue" fill="#f59e0b" name="New Entries" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Data Table */}
      {records.length > 0 && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-display font-semibold mb-4">Entered Records ({records.length})</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Parameter</th>
                  <th>Mode</th>
                  <th>Powertrain</th>
                  <th>Year</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <motion.tr
                    key={record.id}
                    className={newEntryIds.has(record.id) ? "bg-amber-500/10" : ""}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <td className="font-medium">{record.region_country}</td>
                    <td>{record.parameter}</td>
                    <td>{record.mode}</td>
                    <td>{record.powertrain}</td>
                    <td>{record.year}</td>
                    <td>
                      {record.value} {record.unit}
                      {newEntryIds.has(record.id) && <span className="text-amber-500 ml-2 text-xs font-bold">NEW</span>}
                    </td>
                    <td>
                      <button
                        onClick={() => removeRecord(record.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {records.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-muted-foreground">No records yet. Add a record above to see visualizations!</p>
        </motion.div>
      )}
    </div>
  );
}
