import { LIFESTYLE, LIFESTYLE_KEYS, type Lifestyle } from "./options";

export type Match = { score: number; same: string[]; differ: string[] };

// Weighted similarity over ordered lifestyle answers: same = 1, one step apart = 0.5, opposite = 0.
export function matchScore(me: Lifestyle, them: Lifestyle): Match {
  let total = 0;
  let got = 0;
  const same: string[] = [];
  const differ: string[] = [];
  for (const key of LIFESTYLE_KEYS) {
    const { label, opts, weight } = LIFESTYLE[key];
    const values = opts.map(([v]) => v as string);
    const a = values.indexOf(me[key]);
    const b = values.indexOf(them[key]);
    if (a < 0 || b < 0) continue;
    const sim = 1 - Math.abs(a - b) / (values.length - 1);
    total += weight;
    got += weight * sim;
    if (sim === 1) same.push(label);
    else if (sim === 0) differ.push(label);
  }
  return { score: total ? Math.round((got / total) * 100) : 0, same, differ };
}
