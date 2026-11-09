// Single source for every dropdown. Values must match the CHECK constraints in supabase/migrations.

export const CITIES = {
  Delhi: [
    "Saket", "Malviya Nagar", "Hauz Khas", "Green Park", "Lajpat Nagar", "Kalkaji", "Greater Kailash",
    "Vasant Kunj", "Munirka", "Rajouri Garden", "Janakpuri", "Dwarka", "Laxmi Nagar", "Mayur Vihar",
    "North Campus", "Mukherjee Nagar", "Karol Bagh", "Pitampura", "Rohini", "Okhla",
  ],
  Gurugram: [
    "DLF Phase 1", "DLF Phase 2", "DLF Phase 3", "DLF Phase 4", "DLF Phase 5", "Cyber City",
    "Golf Course Road", "Golf Course Extension", "Sohna Road", "Sushant Lok", "South City",
    "Sector 14", "Sector 15", "Sector 45", "Sector 56", "MG Road", "Udyog Vihar", "New Gurgaon",
  ],
  Noida: [
    "Sector 15", "Sector 18", "Sector 50", "Sector 62", "Sector 63", "Sector 76", "Sector 137",
    "Sector 128", "Noida Extension", "Greater Noida",
  ],
  Ghaziabad: ["Indirapuram", "Vaishali", "Vasundhara", "Kaushambi", "Raj Nagar Extension"],
  Faridabad: ["Sector 15", "Sector 21", "NIT", "Greater Faridabad"],
} as const;

export type City = keyof typeof CITIES;
export const CITY_NAMES = Object.keys(CITIES) as City[];

// Each city's line colour (full class names so Tailwind keeps them).
export const CITY_LINE: Record<City, { bg: string; text: string; hindi: string }> = {
  Delhi: { bg: "bg-line-magenta", text: "text-line-magenta", hindi: "दिल्ली" },
  Gurugram: { bg: "bg-line-yellow", text: "text-[#9a7300]", hindi: "गुरुग्राम" },
  Noida: { bg: "bg-line-blue", text: "text-line-blue", hindi: "नोएडा" },
  Ghaziabad: { bg: "bg-line-green", text: "text-line-green", hindi: "ग़ाज़ियाबाद" },
  Faridabad: { bg: "bg-line-violet", text: "text-line-violet", hindi: "फ़रीदाबाद" },
};
export const cityLine = (c: string) => CITY_LINE[c as City] ?? CITY_LINE.Delhi;

type Opts = readonly (readonly [value: string, label: string])[];

export const GENDER: Opts = [["male", "Male"], ["female", "Female"], ["other", "Other"]];
export const GENDER_PREF: Opts = [["any", "Anyone"], ["male", "Male only"], ["female", "Female only"]];
export const KIND: Opts = [["have_room", "Has a room"], ["need_room", "Needs a room"]];
export const FURNISHED: Opts = [["unfurnished", "Unfurnished"], ["semi", "Semi-furnished"], ["full", "Fully furnished"]];

// Lifestyle fields are ordered: neighbours in the list are "close" for the match score.
export const LIFESTYLE = {
  diet: { label: "Food", opts: [["veg", "Vegetarian"], ["eggetarian", "Eggetarian"], ["nonveg", "Non-veg"]], weight: 3 },
  smoking: { label: "Smoking", opts: [["no", "Don't smoke"], ["outside", "Only outside"], ["yes", "Smoke"]], weight: 3 },
  drinking: { label: "Drinking", opts: [["no", "Don't drink"], ["occasionally", "Occasionally"], ["yes", "Regularly"]], weight: 2 },
  sleep: { label: "Sleep", opts: [["early", "Before 11 pm"], ["midnight", "11 pm – 1 am"], ["late", "After 1 am"]], weight: 3 },
  cleanliness: { label: "Cleanliness", opts: [["relaxed", "Relaxed"], ["average", "Average"], ["tidy", "Very tidy"]], weight: 3 },
  guests: { label: "Guests", opts: [["rarely", "Rarely"], ["sometimes", "Sometimes"], ["often", "Often"]], weight: 2 },
  work: { label: "Work", opts: [["office", "Office"], ["hybrid", "Hybrid"], ["wfh", "Work from home"]], weight: 1 },
} as const satisfies Record<string, { label: string; opts: Opts; weight: number }>;

export type LifestyleKey = keyof typeof LIFESTYLE;
export const LIFESTYLE_KEYS = Object.keys(LIFESTYLE) as LifestyleKey[];
export type Lifestyle = Record<LifestyleKey, string>;

export const label = (opts: Opts, value: string) => opts.find(([v]) => v === value)?.[1] ?? value;
export const isOpt = (opts: Opts, value: unknown): value is string =>
  typeof value === "string" && opts.some(([v]) => v === value);

export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN");
