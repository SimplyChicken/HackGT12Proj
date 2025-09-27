import { z } from "zod";
import { FontPairingSchema } from "../schemas";

interface GenerateFontPairingsOptions {
    purpose?: string;
    primaryCategories?: string[];   // ← from checkboxes
    secondaryCategories?: string[]; // ← from checkboxes
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
    const { purpose = "website", primaryCategories = ["serif", "sans-serif"], secondaryCategories = ["serif", "sans-serif"]} = options;

    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    if (!apiKey) throw new Error("Missing GOOGLE_FONTS_API_KEY in environment.");

    // Fetch font list
    const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
    );
    if (!res.ok) throw new Error(`Google Fonts API failed: ${res.status}`);
    const data = (await res.json()) as GFontsResponse;


    const keepFont = (f: GFontItem) => {
        if (!f.subsets?.includes("latin")) return false;                                 // 2
        const has400 = f.variants?.some(v => v === "regular" || v === "400");            // 3
        // if (!has400) return false;
        // const weights = new Set(
        //     f.variants
        //         .map(v => (v === "regular" ? "400" : v.replace("italic","")))
        //         .filter(v => /^\d+$/.test(v))
        // );
        // if (weights.size < 2) return false;
        return true;
    };


    const pSet = new Set(primaryCategories.map(s => s.toLowerCase()));
    const sSet = new Set(secondaryCategories.map(s => s.toLowerCase()));

    const primaryPool = data.items.filter(f => keepFont(f) && pSet.has(f.category.toLowerCase()));
    const secondaryPool = data.items.filter(f => keepFont(f) && sSet.has(f.category.toLowerCase()));

    if (primaryPool.length === 0) throw new Error("No fonts match primary category filters.");
    if (secondaryPool.length === 0) throw new Error("No fonts match secondary category filters.");

    //inline option to choose a font
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const primary = pick(primaryPool);
    let secondary = pick(secondaryPool);


    while (secondary.family === primary.family) {
        secondary = pick(secondaryPool);
    }

    console.log(primary.category);
    console.log(secondary.category);

    // // Pick random weights (fall back to "400" if missing)
    // const pickWeight = (variants: string[]) => {
    //     const numbers = variants
    //         .map(v => (v === "regular" ? "400" : v.replace("italic", "")))
    //         .filter(v => /^\d+$/.test(v));
    //     return numbers.length ? numbers[Math.floor(Math.random() * numbers.length)] : "400";
    // };

    const primaryWeight = "400"
    const secondaryWeight = "400"

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