import { z } from "zod";
import { FontPairingSchema } from "../schemas";

interface GenerateFontPairingsOptions {
    purpose?: string;
    primaryCategories?: string[];
    secondaryCategories?: string[];
    locked?: {
        primaryName?: string;
        primaryWeight?: string;
        secondaryName?: string;
        secondaryWeight?: string;
    };
}

type GFontItem = {
    family: string;
    category: string;
    variants: string[];
    subsets: string[];
};

type GFontsResponse = { items: GFontItem[] };

export const generateFontPairings = async (
    options: GenerateFontPairingsOptions = {}
): Promise<z.infer<typeof FontPairingSchema>> => {
    const { purpose = "website", primaryCategories = ["serif", "sans-serif"], secondaryCategories = ["serif", "sans-serif"], locked = {} } = options;

    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    if (!apiKey) throw new Error("Missing GOOGLE_FONTS_API_KEY in environment.");

    // Fetch font list
    const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
    );
    if (!res.ok) throw new Error(`Google Fonts API failed: ${res.status}`);
    const data = (await res.json()) as GFontsResponse;

    const EXCLUDED_WORDS = ["guides", "underline", "charted", "rubik", "bitcount"];

    const keepFont = (f: GFontItem) => {
        if (!f.subsets?.includes("latin")) return false;

        const has400 = f.variants?.some(v => v === "regular" || v === "400");
        if (EXCLUDED_WORDS.some(w => f.family.toLowerCase().includes(w))) return false;

        return true;
    };


    const pSet = new Set(primaryCategories.map(s => s.toLowerCase()));
    const sSet = new Set(secondaryCategories.map(s => s.toLowerCase()));

    let primaryPool = data.items.filter(f => keepFont(f) && pSet.has(f.category.toLowerCase()));   // ← CHANGED (let)
    let secondaryPool = data.items.filter(f => keepFont(f) && sSet.has(f.category.toLowerCase())); // ← CHANGED (let)

    primaryPool = primaryPool.slice(0, Math.max(1, Math.floor(primaryPool.length * 0.7)));                               // ← ADDED
    secondaryPool = secondaryPool.slice(0, Math.max(1, Math.floor(secondaryPool.length * 0.7)));                         // ← ADDED

    if (primaryPool.length === 0) throw new Error("No fonts match primary category filters.");
    if (secondaryPool.length === 0) throw new Error("No fonts match secondary category filters.");

    //inline option to choose a font
    const findByFamily = (name?: string) =>                                       // ← ADDED
        name ? data.items.find(f => f.family.toLowerCase() === name.toLowerCase()) : undefined;

    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const isPrimaryLocked = Boolean(locked.primaryName);
    const isSecondaryLocked = Boolean(locked.secondaryName);


    let primary = isPrimaryLocked ? findByFamily(locked.primaryName) : pick(primaryPool);
    let secondary = isSecondaryLocked ? findByFamily(locked.secondaryName) : pick(secondaryPool);  // ← CHANGED

    if (!primary) throw new Error("Primary font not found");
    if (!secondary) throw new Error("Secondary font not found");


    while (!isSecondaryLocked && secondary.family === primary.family) {
        secondary = pick(secondaryPool);
    }

    const pickWeight = (variants: string[]) => {
        const numbers = variants
            .map(v => (v === "regular" ? "400" : v.replace("italic", "")))
            .filter(v => /^\d+$/.test(v));
        return numbers.length ? numbers[Math.floor(Math.random() * numbers.length)] : "400";
    };

    const primaryWeight = isPrimaryLocked && locked.primaryWeight
        ? locked.primaryWeight
        : pickWeight(primary.variants);                                              // ← CHANGED
    const secondaryWeight = isSecondaryLocked && locked.secondaryWeight
        ? locked.secondaryWeight
        : pickWeight(secondary.variants);
    // Build Google Fonts CSS2 URLs
    const buildUrl = (family: string, weight: string) =>
        `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`;

    const fontPairing = {
        primary: {
            name: primary.family,
            googleFontUrl: buildUrl(primary.family, primaryWeight),
            weight: primaryWeight,
            style: "normal",
            usage: "Use for headings and titles",
        },
        secondary: {
            name: secondary.family,
            googleFontUrl: buildUrl(secondary.family, secondaryWeight),
            weight: secondaryWeight,
            style: "normal",
            usage: "Use for body text and supporting content",
        }
    };

    return FontPairingSchema.parse(fontPairing);
};