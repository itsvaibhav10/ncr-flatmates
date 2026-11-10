import type { Metro } from "@/lib/options";

// Schematic India network: every live city is an interchange of two lines (two people "clicking").
type Pt = [number, number];
const LINES: { id: string; stroke: string; delay: string; pts: Pt[] }[] = [
  { id: "yellow", stroke: "#f2b705", delay: "[animation-delay:0ms]", pts: [[360, 100], [360, 190], [210, 340], [255, 385]] },
  { id: "magenta", stroke: "#c4167c", delay: "[animation-delay:150ms]", pts: [[360, 100], [400, 140], [400, 385], [400, 470]] },
  { id: "blue", stroke: "#1f5fd6", delay: "[animation-delay:300ms]", pts: [[255, 385], [400, 385], [480, 465]] },
  { id: "green", stroke: "#1a8f4a", delay: "[animation-delay:450ms]", pts: [[400, 470], [475, 470]] },
];

type Side = "l" | "r" | "t" | "b";
const LIVE: { metro: Metro; hindi: string; x: number; y: number; side: Side }[] = [
  { metro: "Delhi NCR", hindi: "दिल्ली एनसीआर", x: 360, y: 100, side: "l" },
  { metro: "Mumbai", hindi: "मुंबई", x: 210, y: 340, side: "l" },
  { metro: "Pune", hindi: "पुणे", x: 255, y: 385, side: "b" },
  { metro: "Hyderabad", hindi: "हैदराबाद", x: 400, y: 385, side: "r" },
  { metro: "Bengaluru", hindi: "बेंगलुरु", x: 400, y: 470, side: "l" },
  { metro: "Chennai", hindi: "चेन्नई", x: 480, y: 465, side: "r" },
];

const SOON: { name: string; x: number; y: number }[] = [
  { name: "Chandigarh", x: 330, y: 40 },
  { name: "Jaipur", x: 270, y: 150 },
  { name: "Ahmedabad", x: 150, y: 240 },
  { name: "Kolkata", x: 560, y: 250 },
  { name: "Kochi", x: 330, y: 522 },
];

const path = (pts: Pt[]) => "M" + pts.map(([x, y]) => `${x} ${y}`).join(" L");

function label(s: Side, x: number, y: number) {
  switch (s) {
    case "l": return { x: x - 20, y: y + 2, anchor: "end" as const };
    case "r": return { x: x + 20, y: y + 2, anchor: "start" as const };
    case "t": return { x, y: y - 34, anchor: "middle" as const };
    default: return { x, y: y + 38, anchor: "middle" as const };
  }
}

export function IndiaMap({ counts }: { counts: Partial<Record<Metro, number>> }) {
  return (
    <svg viewBox="40 10 620 520" className="h-auto w-full font-display" aria-labelledby="india-map-title">
      <title id="india-map-title">Clikkit cities. Select a city to browse its posts.</title>

      {SOON.map((c) => (
        <g key={c.name} aria-hidden="true">
          <circle cx={c.x} cy={c.y} r={6} fill="white" stroke="#c7c9cc" strokeWidth={3} strokeDasharray="3 3" />
          <text x={c.x + 12} y={c.y + 5} className="fill-ink/35 text-[15px] font-semibold">{c.name}</text>
        </g>
      ))}

      {LINES.map((l) => (
        <path key={l.id} id={`india-${l.id}`} d={path(l.pts)} pathLength={1} fill="none" stroke={l.stroke}
          strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" className={`metro-line ${l.delay}`} />
      ))}

      <circle r={6} className="metro-train fill-ink stroke-line-yellow" strokeWidth={3} aria-hidden="true">
        <animateMotion dur="14s" begin="1.6s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear">
          <mpath href="#india-yellow" />
        </animateMotion>
      </circle>

      {LIVE.map((s) => {
        const n = counts[s.metro] ?? 0;
        const lp = label(s.side, s.x, s.y);
        return (
          <a key={s.metro} href={`/browse?metro=${encodeURIComponent(s.metro)}`} className="metro-stop metro-station cursor-pointer outline-none"
            aria-label={`${s.metro}: ${n} live ${n === 1 ? "post" : "posts"}`}>
            <circle cx={s.x} cy={s.y} r={24} fill="transparent" />
            <circle cx={s.x} cy={s.y} r={10} fill="white" stroke="#15171c" strokeWidth={4.5} className="metro-dot" />
            <text x={lp.x} y={lp.y} textAnchor={lp.anchor} className="fill-ink text-[22px] font-black">{s.metro}</text>
            <text x={lp.x} y={lp.y + 20} textAnchor={lp.anchor} className="fill-ink/50 font-sans text-[13px]">
              {s.hindi}{n > 0 ? ` · ${n} live` : ""}
            </text>
          </a>
        );
      })}
    </svg>
  );
}
