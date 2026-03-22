import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface CountryMapData {
  country: string;
  value: number;
  code: string;
}

interface WorldMapProps {
  data: CountryMapData[];
}

// Simplified world map paths for key EV markets
const countryPaths: Record<string, { d: string; cx: number; cy: number; name: string }> = {
  USA: { d: "M55,140 L130,140 L135,155 L130,170 L120,180 L55,180 L45,170 L45,155 Z", cx: 90, cy: 160, name: "USA" },
  China: { d: "M580,130 L650,120 L670,135 L665,165 L640,175 L600,170 L580,155 Z", cx: 625, cy: 148, name: "China" },
  Germany: { d: "M380,110 L400,108 L405,120 L395,130 L380,128 Z", cx: 392, cy: 118, name: "Germany" },
  France: { d: "M365,120 L385,118 L388,135 L375,142 L360,135 Z", cx: 374, cy: 130, name: "France" },
  UK: { d: "M360,95 L370,92 L372,108 L365,112 L358,105 Z", cx: 365, cy: 102, name: "UK" },
  Norway: { d: "M385,60 L395,55 L400,80 L392,90 L383,82 Z", cx: 391, cy: 73, name: "Norway" },
  Japan: { d: "M685,135 L695,130 L700,145 L695,155 L685,150 Z", cx: 692, cy: 143, name: "Japan" },
  "South Korea": { d: "M665,135 L675,132 L678,145 L672,150 L663,145 Z", cx: 670, cy: 141, name: "South Korea" },
  India: { d: "M570,165 L600,155 L610,175 L595,205 L575,200 L565,185 Z", cx: 588, cy: 180, name: "India" },
  Brazil: { d: "M170,210 L220,195 L235,220 L220,260 L185,265 L165,240 Z", cx: 198, cy: 230, name: "Brazil" },
  Canada: { d: "M55,95 L155,90 L160,110 L150,130 L55,130 L45,115 Z", cx: 103, cy: 112, name: "Canada" },
  Netherlands: { d: "M378,105 L388,103 L390,112 L384,115 L376,110 Z", cx: 383, cy: 109, name: "Netherlands" },
  Sweden: { d: "M395,55 L405,50 L410,75 L402,85 L393,78 Z", cx: 401, cy: 68, name: "Sweden" },
  Italy: { d: "M390,130 L400,125 L408,145 L400,160 L392,152 Z", cx: 399, cy: 143, name: "Italy" },
  Australia: { d: "M640,240 L710,235 L720,260 L700,280 L645,275 L635,260 Z", cx: 678, cy: 258, name: "Australia" },
  Thailand: { d: "M620,180 L632,175 L635,195 L628,200 L618,192 Z", cx: 627, cy: 188, name: "Thailand" },
  Indonesia: { d: "M630,210 L680,205 L685,220 L670,230 L630,225 Z", cx: 657, cy: 218, name: "Indonesia" },
};

// Continent outlines for visual context
const continentPaths = [
  // North America
  "M30,80 L160,75 L170,100 L165,140 L140,185 L115,195 L55,190 L35,170 L30,130 Z",
  // South America
  "M135,200 L185,190 L240,210 L245,250 L230,290 L195,310 L160,295 L135,260 Z",
  // Europe
  "M345,50 L420,45 L430,90 L415,135 L380,140 L355,120 L345,80 Z",
  // Africa
  "M360,150 L420,140 L440,180 L430,260 L400,290 L370,280 L355,230 L350,180 Z",
  // Asia
  "M430,40 L710,35 L720,90 L700,160 L660,180 L570,160 L530,130 L440,100 Z",
  // Oceania
  "M625,230 L730,225 L735,270 L715,290 L640,285 L625,265 Z",
];

export default function WorldMap({ data }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

  const getColor = (value: number) => {
    const intensity = Math.min(value / maxValue, 1);
    if (intensity > 0.7) return "hsl(var(--primary))";
    if (intensity > 0.4) return "hsl(var(--ev-blue))";
    if (intensity > 0.15) return "hsl(var(--ev-cyan))";
    return "hsl(var(--ev-green) / 0.4)";
  };

  const getOpacity = (value: number) => {
    return 0.4 + (value / maxValue) * 0.6;
  };

  const dataMap = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(d => { map[d.country] = d.value; });
    return map;
  }, [data]);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 760 320"
        className="w-full h-auto"
        style={{ minHeight: 250 }}
      >
        {/* Background */}
        <rect width="760" height="320" fill="hsl(var(--card))" rx="8" />

        {/* Grid lines */}
        {[80, 160, 240].map(y => (
          <line key={`h-${y}`} x1="0" y1={y} x2="760" y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        ))}
        {[152, 304, 456, 608].map(x => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="320" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        ))}

        {/* Continent silhouettes */}
        {continentPaths.map((d, i) => (
          <path key={i} d={d} fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
        ))}

        {/* Country regions */}
        {Object.entries(countryPaths).map(([code, path]) => {
          const value = dataMap[path.name] || 0;
          const isHovered = hoveredCountry === code;

          return (
            <g key={code}>
              <motion.path
                d={path.d}
                fill={value > 0 ? getColor(value) : "hsl(var(--muted-foreground) / 0.2)"}
                stroke={isHovered ? "hsl(var(--primary-foreground))" : "hsl(var(--border))"}
                strokeWidth={isHovered ? 2 : 0.8}
                opacity={getOpacity(value)}
                className="cursor-pointer transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={(e) => {
                  setHoveredCountry(code);
                  const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                  if (rect) {
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                onMouseLeave={() => setHoveredCountry(null)}
              />
              {/* Pulse dot for top markets */}
              {value > maxValue * 0.3 && (
                <circle cx={path.cx} cy={path.cy} r={3 + (value / maxValue) * 5} fill="hsl(var(--primary))" opacity={0.6}>
                  <animate attributeName="r" values={`${3 + (value / maxValue) * 3};${5 + (value / maxValue) * 6};${3 + (value / maxValue) * 3}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Country label */}
              {value > maxValue * 0.1 && (
                <text x={path.cx} y={path.cy - 10} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="600" opacity="0.8">
                  {code.length > 5 ? code.slice(0, 3) : code}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredCountry && dataMap[countryPaths[hoveredCountry]?.name] && (
        <div
          className="absolute pointer-events-none z-10 glass-card px-3 py-2 text-xs"
          style={{ left: tooltipPos.x + 10, top: tooltipPos.y - 40 }}
        >
          <p className="font-semibold text-foreground">{countryPaths[hoveredCountry].name}</p>
          <p className="text-primary font-bold">{(dataMap[countryPaths[hoveredCountry].name] || 0).toLocaleString()}K units</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--ev-green) / 0.4)" }} />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--ev-cyan))" }} />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--ev-blue))" }} />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--primary))" }} />
          <span>Dominant</span>
        </div>
      </div>
    </div>
  );
}
