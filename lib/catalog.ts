/** Product data. No "use client" and no routes import: safe for generateStaticParams. */
export type CategoryId =
  | "necklace" | "haaram" | "temple" | "bangle" | "chain" | "earring" | "ring" | "coin" | "silver" | "diamond";

export type Purity = "22K" | "18K" | "24K" | "silver";

export const CATEGORIES: { id: CategoryId; en: string; ta: string }[] = [
  { id: "necklace", en: "Necklaces", ta: "நெக்லஸ்" },
  { id: "haaram", en: "Haarams", ta: "ஹாரம்" },
  { id: "temple", en: "Temple Jewellery", ta: "கோயில் நகைகள்" },
  { id: "bangle", en: "Bangles", ta: "வளையல்கள்" },
  { id: "chain", en: "Chains", ta: "சங்கிலிகள்" },
  { id: "earring", en: "Earrings", ta: "காதணிகள்" },
  { id: "ring", en: "Rings", ta: "மோதிரங்கள்" },
  { id: "coin", en: "Gold Coins", ta: "தங்க நாணயங்கள்" },
  { id: "silver", en: "Silver", ta: "வெள்ளி" },
  { id: "diamond", en: "Diamond", ta: "வைரம்" },
];

export interface Product {
  slug: string;
  name: { en: string; ta: string };
  category: CategoryId;
  purity: Purity;
  weightG: number;
  stoneValue?: number;
  sizes?: string[];
  image: string;
  isNew?: boolean;
  prebookable: boolean;
}

const p = (
  slug: string, en: string, ta: string, category: CategoryId, purity: Purity, weightG: number,
  extra: Partial<Pick<Product, "stoneValue" | "sizes" | "isNew" | "prebookable">> = {},
): Product => ({ slug, name: { en, ta }, category, purity, weightG, image: `/images/products/${slug}.jpg`, prebookable: true, ...extra });

export const PRODUCTS: Product[] = [
  p("lakshmi-kasu-necklace", "Lakshmi Kasu Necklace", "லட்சுமி காசு மாலை", "necklace", "22K", 48, { isNew: true }),
  p("mango-mala-necklace", "Mango Mala Necklace", "மாங்காய் மாலை", "necklace", "22K", 56, { isNew: true }),
  p("ruby-choker-necklace", "Ruby Choker Necklace", "மாணிக்கக் கல் கழுத்தணி", "necklace", "22K", 36, { stoneValue: 12000 }),
  p("bridal-long-haaram", "Bridal Long Haaram", "மணப்பெண் நீள ஹாரம்", "haaram", "22K", 96, { isNew: true }),
  p("peacock-haaram", "Peacock Haaram", "மயில் ஹாரம்", "haaram", "22K", 72),
  p("temple-lakshmi-pendant-set", "Temple Lakshmi Pendant Set", "கோயில் லட்சுமி டாலர் செட்", "temple", "22K", 32),
  p("nakshi-temple-choker", "Nakshi Temple Choker", "நக்ஷி கோயில் கழுத்தணி", "temple", "22K", 44, { isNew: true }),
  p("kemp-temple-necklace", "Kemp Temple Necklace", "கெம்பு கோயில் நெக்லஸ்", "temple", "22K", 62, { stoneValue: 8000 }),
  p("antique-kada-bangle", "Antique Kada Bangle", "ஆன்டிக் காப்பு வளையல்", "bangle", "22K", 38, { sizes: ["2.4", "2.6", "2.8"] }),
  p("machine-cut-bangle-pair", "Machine-Cut Bangle Pair", "மெஷின் கட் வளையல் (ஜோடி)", "bangle", "22K", 24, { sizes: ["2.4", "2.6", "2.8"], isNew: true }),
  p("kemp-stone-bangles", "Kemp Stone Bangles", "கெம்புக் கல் வளையல்கள்", "bangle", "22K", 30, { stoneValue: 7000, sizes: ["2.4", "2.6", "2.8"] }),
  p("rope-chain", "Rope Chain", "ரோப் செயின்", "chain", "22K", 10),
  p("box-chain", "Box Chain", "பாக்ஸ் செயின்", "chain", "22K", 14),
  p("thali-kodi-chain", "Thali Kodi Chain", "தாலிக்கொடி", "chain", "22K", 20, { isNew: true }),
  p("temple-jhumka", "Temple Jhumka", "கோயில் ஜிமிக்கி", "earring", "22K", 12),
  p("ruby-stud-earrings", "Ruby Stud Earrings", "மாணிக்கத் தோடு", "earring", "22K", 5, { stoneValue: 6000 }),
  p("peacock-drop-earrings", "Peacock Drop Earrings", "மயில் தொங்கு தோடு", "earring", "22K", 9, { stoneValue: 5000, isNew: true }),
  p("navaratna-ring", "Navaratna Ring", "நவரத்தின மோதிரம்", "ring", "22K", 6, { stoneValue: 9000, sizes: ["10", "12", "14", "16"] }),
  p("mens-signet-ring", "Men's Signet Ring", "ஆண்கள் முத்திரை மோதிரம்", "ring", "22K", 10, { sizes: ["16", "18", "20"] }),
  p("lakshmi-gold-coin-4g", "Lakshmi Gold Coin 4 g", "லட்சுமி தங்க நாணயம் 4 கி", "coin", "24K", 4, { prebookable: false }),
  p("lakshmi-gold-coin-8g", "Lakshmi Gold Coin 8 g", "லட்சுமி தங்க நாணயம் 8 கி", "coin", "24K", 8, { prebookable: false }),
  p("silver-kuthuvilakku", "Silver Kuthuvilakku", "வெள்ளி குத்துவிளக்கு", "silver", "silver", 350, { prebookable: false }),
  p("silver-pooja-plate", "Silver Pooja Plate", "வெள்ளி பூஜை தட்டு", "silver", "silver", 180, { prebookable: false }),
  p("diamond-solitaire-pendant", "Diamond Solitaire Pendant", "வைர சாலிடேர் டாலர்", "diamond", "18K", 3, { stoneValue: 45000, isNew: true }),
];

export const getProduct = (slug: string): Product | undefined => PRODUCTS.find((x) => x.slug === slug);
export const byCategory = (cat: CategoryId): Product[] => PRODUCTS.filter((x) => x.category === cat);
