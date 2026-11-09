// Schematic NCR "network": lines are illustrative, stations are real searchable areas.
type Side = "l" | "r" | "t" | "b" | "tl" | "tr" | "bl";
type Stop = { area?: string; city?: string; x: number; y: number; side?: Side; hub?: boolean };
type Line = { id: string; stroke: string; delay: string; pts: [number, number][]; stops: Stop[] };

const LINES: Line[] = [
  {
    id: "blue", stroke: "#1f5fd6", delay: "[animation-delay:0ms]",
    pts: [[40, 130], [490, 130], [560, 200], [560, 330]],
    stops: [
      { area: "Dwarka", city: "Delhi", x: 50, y: 130, side: "b" },
      { area: "Janakpuri", city: "Delhi", x: 110, y: 130, side: "t", hub: true },
      { area: "Rajouri Garden", city: "Delhi", x: 175, y: 130, side: "b" },
      { area: "Karol Bagh", city: "Delhi", x: 245, y: 130, side: "t" },
      { x: 330, y: 130, hub: true },
      { area: "Laxmi Nagar", city: "Delhi", x: 410, y: 130, side: "b" },
      { area: "Mayur Vihar", city: "Delhi", x: 480, y: 130, side: "tl", hub: true },
      { area: "Sector 15", city: "Noida", x: 525, y: 165, side: "r" },
      { area: "Sector 18", city: "Noida", x: 560, y: 200, side: "r" },
      { area: "Sector 50", city: "Noida", x: 560, y: 250, side: "r", hub: true },
      { area: "Sector 62", city: "Noida", x: 560, y: 330, side: "l", hub: true },
    ],
  },
  {
    id: "yellow", stroke: "#f2b705", delay: "[animation-delay:150ms]",
    pts: [[330, 30], [330, 330], [250, 410], [50, 410]],
    stops: [
      { area: "North Campus", city: "Delhi", x: 330, y: 40, side: "r" },
      { area: "Green Park", city: "Delhi", x: 330, y: 200, side: "l" },
      { area: "Hauz Khas", city: "Delhi", x: 330, y: 250, side: "bl", hub: true },
      { area: "Malviya Nagar", city: "Delhi", x: 330, y: 290, side: "l" },
      { area: "Saket", city: "Delhi", x: 330, y: 330, side: "r" },
      { area: "MG Road", city: "Gurugram", x: 290, y: 370, side: "r" },
      { area: "Golf Course Road", city: "Gurugram", x: 210, y: 410, side: "b" },
      { area: "Cyber City", city: "Gurugram", x: 160, y: 410, side: "t" },
      { area: "DLF Phase 2", city: "Gurugram", x: 110, y: 410, side: "b" },
      { area: "Sohna Road", city: "Gurugram", x: 55, y: 410, side: "t" },
    ],
  },
  {
    id: "magenta", stroke: "#c4167c", delay: "[animation-delay:300ms]",
    pts: [[110, 130], [110, 250], [560, 250]],
    stops: [
      { area: "Vasant Kunj", city: "Delhi", x: 180, y: 250, side: "b" },
      { area: "Munirka", city: "Delhi", x: 240, y: 250, side: "t" },
      { area: "Kalkaji", city: "Delhi", x: 420, y: 250, side: "tr", hub: true },
      { area: "Okhla", city: "Delhi", x: 490, y: 250, side: "b" },
    ],
  },
  {
    id: "violet", stroke: "#6a3fb5", delay: "[animation-delay:450ms]",
    pts: [[390, 198], [420, 228], [420, 470]],
    stops: [
      { area: "Lajpat Nagar", city: "Delhi", x: 390, y: 198, side: "t" },
      { area: "Greater Kailash", city: "Delhi", x: 420, y: 300, side: "r" },
      { area: "Sector 21", city: "Faridabad", x: 420, y: 360, side: "r" },
      { area: "Sector 15", city: "Faridabad", x: 420, y: 410, side: "r" },
      { area: "NIT", city: "Faridabad", x: 420, y: 460, side: "r" },
    ],
  },
  {
    id: "green", stroke: "#1a8f4a", delay: "[animation-delay:600ms]",
    pts: [[480, 130], [540, 70], [705, 70]],
    stops: [
      { area: "Kaushambi", city: "Ghaziabad", x: 510, y: 100, side: "l" },
      { area: "Vaishali", city: "Ghaziabad", x: 580, y: 70, side: "b" },
      { area: "Indirapuram", city: "Ghaziabad", x: 630, y: 70, side: "t" },
      { area: "Vasundhara", city: "Ghaziabad", x: 680, y: 70, side: "b" },
    ],
  },
  {
    id: "aqua", stroke: "#0a9cad", delay: "[animation-delay:750ms]",
    pts: [[560, 330], [640, 410], [640, 490]],
    stops: [
      { area: "Sector 76", city: "Noida", x: 600, y: 370, side: "r" },
      { area: "Sector 137", city: "Noida", x: 640, y: 430, side: "r" },
      { area: "Greater Noida", city: "Noida", x: 640, y: 480, side: "l" },
    ],
  },
];

const ZONES = [
  { name: "Delhi", hindi: "दिल्ली", x: 130, y: 196 },
  { name: "Gurugram", hindi: "गुरुग्राम", x: 50, y: 470 },
  { name: "Noida", hindi: "नोएडा", x: 618, y: 292 },
  { name: "Ghaziabad", hindi: "ग़ाज़ियाबाद", x: 560, y: 26 },
  { name: "Faridabad", hindi: "फ़रीदाबाद", x: 250, y: 470 },
];

const path = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${x} ${y}`).join(" L");

function labelPos(s: Stop) {
  switch (s.side) {
    case "l": return { x: s.x - 12, y: s.y + 4, anchor: "end" as const };
    case "t": return { x: s.x, y: s.y - 14, anchor: "middle" as const };
    case "b": return { x: s.x, y: s.y + 24, anchor: "middle" as const };
    case "tl": return { x: s.x - 10, y: s.y - 12, anchor: "end" as const };
    case "tr": return { x: s.x + 10, y: s.y - 12, anchor: "start" as const };
    case "bl": return { x: s.x - 10, y: s.y + 22, anchor: "end" as const };
    default: return { x: s.x + 12, y: s.y + 4, anchor: "start" as const };
  }
}

export function MetroMap({ counts }: { counts: Record<string, number> }) {
  return (
    <svg viewBox="0 0 720 520" className="h-auto w-full font-display" aria-labelledby="map-title">
      <title id="map-title">NCR flatmate map. Each station is an area; select one to browse its posts.</title>
      {ZONES.map((z) => (
        <g key={z.name} aria-hidden="true" className="fill-ink/25">
          <text x={z.x} y={z.y} className="text-[22px] font-black uppercase tracking-[0.12em]">{z.name}</text>
          <text x={z.x} y={z.y + 18} className="font-sans text-[13px]">{z.hindi}</text>
        </g>
      ))}

      {LINES.map((l) => (
        <path key={l.id} id={`line-${l.id}`} d={path(l.pts)} pathLength={1} fill="none" stroke={l.stroke}
          strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" className={`metro-line ${l.delay}`} />
      ))}

      <circle r={5} className="metro-train fill-ink stroke-line-yellow" strokeWidth={2.5} aria-hidden="true">
        <animateMotion dur="16s" begin="1.6s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear">
          <mpath href="#line-yellow" />
        </animateMotion>
      </circle>

      {LINES.flatMap((l) =>
        l.stops.map((s) => {
          const key = `${l.id}-${s.x}-${s.y}`;
          const dot = (
            <circle cx={s.x} cy={s.y} r={s.hub ? 7.5 : 5.5} fill="white" stroke={s.hub ? "#15171c" : l.stroke}
              strokeWidth={s.hub ? 3.5 : 3} className="metro-dot" />
          );
          if (!s.area || !s.city) return <g key={key} className="metro-station">{dot}</g>;
          const n = counts[`${s.city}|${s.area}`] ?? 0;
          const lp = labelPos(s);
          return (
            <a key={key} href={`/browse?city=${encodeURIComponent(s.city)}&area=${encodeURIComponent(s.area)}`}
              className="metro-stop metro-station cursor-pointer outline-none"
              aria-label={`${s.area}, ${s.city}: ${n} live ${n === 1 ? "post" : "posts"}`}>
              <circle cx={s.x} cy={s.y} r={16} fill="transparent" />
              {dot}
              <text x={lp.x} y={lp.y} textAnchor={lp.anchor} className="metro-label fill-ink text-[12.5px] font-semibold">{s.area}</text>
              {n > 0 && (
                <g aria-hidden="true">
                  <rect x={s.x - 26} y={s.y - 26} width={22} height={16} rx={8} className="fill-board" />
                  <text x={s.x - 15} y={s.y - 14} textAnchor="middle" className="fill-amber text-[11px] font-bold tabular-nums">{n}</text>
                </g>
              )}
            </a>
          );
        }),
      )}
    </svg>
  );
}
