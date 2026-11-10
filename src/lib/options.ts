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
  Bengaluru: [
    "Koramangala", "HSR Layout", "Indiranagar", "Whitefield", "Marathahalli", "Bellandur", "Sarjapur Road",
    "Electronic City", "BTM Layout", "Jayanagar", "JP Nagar", "Bannerghatta Road", "Hebbal", "Yelahanka",
    "Malleshwaram", "Kalyan Nagar", "KR Puram", "Domlur", "Brookefield", "Hennur",
  ],
  Mumbai: [
    "Andheri West", "Andheri East", "Bandra West", "Bandra East", "Powai", "Goregaon", "Malad", "Kandivali",
    "Borivali", "Juhu", "Santacruz", "Vile Parle", "Lower Parel", "Worli", "Dadar", "Chembur", "Ghatkopar",
    "Kurla", "Thane", "Navi Mumbai",
  ],
  Pune: [
    "Hinjewadi", "Wakad", "Baner", "Aundh", "Balewadi", "Kothrud", "Viman Nagar", "Kharadi", "Hadapsar",
    "Magarpatta", "Koregaon Park", "Kalyani Nagar", "Shivaji Nagar", "Pimple Saudagar", "Wagholi", "Yerwada",
    "Pashan", "Undri",
  ],
  Hyderabad: [
    "Gachibowli", "HITEC City", "Madhapur", "Kondapur", "Kukatpally", "Banjara Hills", "Jubilee Hills",
    "Begumpet", "Ameerpet", "Manikonda", "Nanakramguda", "Financial District", "Miyapur", "Secunderabad",
    "Tolichowki", "Uppal", "Kompally", "Narsingi",
  ],
  Chennai: [
    "OMR", "Velachery", "Adyar", "T Nagar", "Anna Nagar", "Nungambakkam", "Guindy", "Porur", "Sholinganallur",
    "Perungudi", "Thoraipakkam", "Tambaram", "Mylapore", "Besant Nagar", "Kodambakkam", "Ashok Nagar",
    "Medavakkam", "Pallikaranai",
  ],
} as const;

export type City = keyof typeof CITIES;
export const CITY_NAMES = Object.keys(CITIES) as City[];

// Users pick a metro first; Delhi NCR spans five cities, the rest are one city each.
export const METROS = {
  "Delhi NCR": ["Delhi", "Gurugram", "Noida", "Ghaziabad", "Faridabad"],
  Bengaluru: ["Bengaluru"],
  Mumbai: ["Mumbai"],
  Pune: ["Pune"],
  Hyderabad: ["Hyderabad"],
  Chennai: ["Chennai"],
} as const satisfies Record<string, readonly City[]>;
export type Metro = keyof typeof METROS;
export const METRO_NAMES = Object.keys(METROS) as Metro[];
export const metroOf = (c: string) => METRO_NAMES.find((m) => (METROS[m] as readonly string[]).includes(c));

// Each city's line colour (full class names so Tailwind keeps them).
export const CITY_LINE: Record<City, { bg: string; text: string }> = {
  Delhi: { bg: "bg-line-magenta", text: "text-line-magenta" },
  Gurugram: { bg: "bg-line-yellow", text: "text-[#9a7300]" },
  Noida: { bg: "bg-line-blue", text: "text-line-blue" },
  Ghaziabad: { bg: "bg-line-green", text: "text-line-green" },
  Faridabad: { bg: "bg-line-violet", text: "text-line-violet" },
  Bengaluru: { bg: "bg-line-violet", text: "text-line-violet" },
  Mumbai: { bg: "bg-line-blue", text: "text-line-blue" },
  Pune: { bg: "bg-line-aqua", text: "text-line-aqua" },
  Hyderabad: { bg: "bg-line-magenta", text: "text-line-magenta" },
  Chennai: { bg: "bg-line-green", text: "text-line-green" },
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
