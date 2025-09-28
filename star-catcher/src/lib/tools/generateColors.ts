import { ColorPaletteSchema, type ColorPalette } from "@/lib/schemas";

type Theme = "light" | "dark";
type Strategy = "split" | "complement" | "analog";

// --- PRNG (yours) ---
function makePRNG(seed?: number) {
    let s = (seed ?? Math.floor(Math.random() * 2 ** 32)) >>> 0;
    return () => {
        s += 0x6D2B79F5;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Gaussian-ish number in [0,1], centered around 0.5 (for "most values are moderate")
function randNormal01(rnd: () => number) {
    // Box–Muller
    const u = Math.max(1e-9, rnd());
    const v = Math.max(1e-9, rnd());
    const n = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v); // ~N(0,1)
    // squash to [0,1] around 0.5
    const x = 0.5 + n * 0.18; // std dev ~0.18 → few outliers
    return Math.min(1, Math.max(0, x));
}

// clamp & lerp helpers
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// HSL helpers
function hslToRgb(h: number, s: number, l: number) {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
}
const rgbToHex = (r: number, g: number, b: number) =>
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
        .toString(16)
        .padStart(2, "0")}`.toUpperCase();
const hslToHex = (h: number, s: number, l: number) => {
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
};
const onColorByLightness = (l: number, strong = false) =>
    l < (strong ? 58 : 62) ? "#FFFFFF" : "#000000";


// --- add these helpers ---
function relLuminanceFromHsl(h: number, s: number, l: number) {
    // reuse your hslToRgb
    const { r, g, b } = hslToRgb(h, s, l);
    const toLin = (v: number) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    };
    const R = toLin(r), G = toLin(g), B = toLin(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrastRatio(h1:number,s1:number,l1:number, h2:number,s2:number,l2:number) {
    const L1 = relLuminanceFromHsl(h1,s1,l1);
    const L2 = relLuminanceFromHsl(h2,s2,l2);
    const [a,b] = L1 > L2 ? [L1, L2] : [L2, L1];
    return (a + 0.05) / (b + 0.05);
}

function ensureContrast(
    fg: {h:number;s:number;l:number},
    bg: {h:number;s:number;l:number},
    theme: "light"|"dark",
    target = 5.0 // bump to 7.0 for even stronger contrast
){
    const dir = theme === "light" ? -1 : 1; // move L down for light, up for dark
    let lo = 0, hi = 100, best = fg.l;
    // seed the search starting from current L in the correct direction
    let start = fg.l;
    for (let i=0;i<18;i++){ // binary search ~18 iters → sub-1/100 precision
        const mid = clamp(theme === "light" ? (start + lo)/2 : (start + hi)/2, 0, 100);
        const testL = theme === "light" ? Math.min(start, mid) : Math.max(start, mid);
        const c = contrastRatio(fg.h, fg.s, testL, bg.h, bg.s, bg.l);
        if (c >= target){
            best = testL;
            // push further in the same direction to see if we can keep it closer to muted
            if (theme === "light"){ lo = testL; } else { hi = testL; }
        } else {
            // move more aggressively toward darker/lighter
            if (theme === "light"){ hi = testL; } else { lo = testL; }
            start = start + dir * Math.max(1, (Math.abs(start - testL) * 0.5));
            start = clamp(start, 0, 100);
        }
    }
    return { h: fg.h, s: fg.s, l: best };
}


function mute(h: number, s: number, l: number, k: number, theme: Theme) {
    // k in [0,1] strength; blend saturation down and nudge lightness toward a soft target
    const targetL = theme === "light" ? 84 : 28; // powdery paper vs soft charcoal
    const s2 = s * (1 - 0.55 * k);               // compress chroma
    const l2 = lerp(l, targetL, 0.35 * k);       // pull L toward target slightly
    return { h, s: clamp(s2, 0, 100), l: clamp(l2, 0, 100) };
}

export function generateTrio(): ColorPalette {
    const rnd = makePRNG();

    const pick = <T,>(r: number, weighted: Array<[T, number]>) => {
        const total = weighted.reduce((a, [, w]) => a + w, 0);
        let x = r * total;
        for (const [val, w] of weighted) {
            if (x < w) return val;
            x -= w;
        }
        return weighted[weighted.length - 1][0];
    };

    const theme = pick(rnd(), [
        ["light", 0.6],
        ["dark", 0.4],
    ]) as Theme;

    const strategy = pick(rnd(), [
        ["analog", 0.1],
        ["split", 0.15],
        ["complement", 0.75], // complements are gentler now
    ]) as Strategy;

    // Mood tunes the S/L bands for that muted vibe
    const mood = pick(rnd(), [
        ["pastel", 0.45], // airy
        ["dusty", 0.40],  // slightly earthier
        ["slate", 0.15],  // cooler/greyer
    ]) as "pastel" | "dusty" | "slate";

    const baseH = Math.floor(rnd() * 360);

    // Saturation & lightness ranges (muted)
    const satPrimary = (
        mood === "pastel" ? lerp(18, 34, randNormal01(rnd))
            : mood === "dusty" ? lerp(20, 30, randNormal01(rnd))
                : /* slate */        lerp(12, 24, randNormal01(rnd))
    );

    const lightPrimary = theme === "light"
        ? (mood === "pastel" ? lerp(78, 88, randNormal01(rnd))
            : mood === "dusty" ? lerp(70, 80, randNormal01(rnd))
                : /* slate */        lerp(64, 74, randNormal01(rnd)))
        : (mood === "pastel" ? lerp(42, 52, randNormal01(rnd))
            : mood === "dusty" ? lerp(38, 48, randNormal01(rnd))
                : /* slate */        lerp(34, 44, randNormal01(rnd)));


    const splitGap = lerp(50, 80, rnd());        // tighter split
    const analogGap = lerp(20, 35, rnd());       // close neighbors
    const compGap = 180 + lerp(-10, 10, rnd());  // softened complement

    const hueShift = compGap - analogGap;
        strategy === "complement" ? compGap
            : strategy === "analog"    ? (rnd() < 0.5 ? analogGap : -analogGap)
                : /* split */                (rnd() < 0.5 ? splitGap : -splitGap);

   // const hueShift = 180 + lerp(-10, 10, rnd());

    let primary = { h: baseH, s: satPrimary, l: lightPrimary };

    let accent = {
        h: (baseH + hueShift + 360) % 360,
        s: clamp(primary.s + lerp(-6, 8, randNormal01(rnd)), 10, 45),
        l: clamp(primary.l + lerp(-6, 6, randNormal01(rnd)), 20, 90),
    };

    // Secondary (surface): very low chroma, near-neutral with slight base bias
    const neutralH = (baseH + lerp(-8, 8, rnd()) + 360) % 360;
    let secondary = {
        h: neutralH,
        s: theme === "light" ? lerp(3, 25, randNormal01(rnd)) : lerp(4, 10, randNormal01(rnd)),
        l: theme === "light" ? lerp(78, 96, randNormal01(rnd)) : lerp(16, 24, randNormal01(rnd)),
    };

    // Final muting pass (stronger on accent/primary than on the already-neutral secondary)
    const kPrim = 0.9, kAcc = 0.85, kSec = 0.5;
    primary   = mute(primary.h,   primary.s,   primary.l,   kPrim, theme);
    accent    = mute(accent.h,    accent.s,    accent.l,    kAcc,  theme);
    secondary = mute(secondary.h, secondary.s, secondary.l, kSec,  theme);

    primary   = ensureContrast(primary,   secondary, theme, 5.0);
    accent    = ensureContrast(accent,     secondary, theme, 7.0);

    const primaryHex   = hslToHex(primary.h, primary.s, primary.l);
    const accentHex    = hslToHex(accent.h,  accent.s,  accent.l);
    const secondaryHex = hslToHex(secondary.h, secondary.s, secondary.l);

    return {
        primary:   { name: "Primary",   value: primaryHex,   contrast: onColorByLightness(primary.l) },
        secondary: { name: "Secondary", value: secondaryHex, contrast: onColorByLightness(secondary.l, true) },
        accent:    { name: "Accent",    value: accentHex,    contrast: onColorByLightness(accent.l) },
    };
}
