import { z } from 'zod';

// Font Pairing Schema
export const FontPairingSchema = z.object({
  primary: z.object({
    name: z.string(),
    googleFontUrl: z.string().url(),
    weight: z.string(),
    style: z.string(),
    usage: z.string(),
  }),
  secondary: z.object({
    name: z.string(),
    googleFontUrl: z.string().url(),
    weight: z.string(),
    style: z.string(),
    usage: z.string(),
  }),
  rationale: z.string(),
});

export type FontPairing = z.infer<typeof FontPairingSchema>;

// Color Palette Schema
export const ColorTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  usage: z.string(),
});

export const ColorPaletteSchema = z.object({
  primary: z.object({
    name: z.string(),
    value: z.string(),
    contrast: z.string(),
    usage: z.string(),
  }),
  secondary: z.object({
    name: z.string(),
    value: z.string(),
    contrast: z.string(),
    usage: z.string(),
  }),
  accent: z.object({
    name: z.string(),
    value: z.string(),
    contrast: z.string(),
    usage: z.string(),
  }),
  neutral: z.object({
    name: z.string(),
    value: z.string(),
    contrast: z.string(),
    usage: z.string(),
  }),
  background: z.object({
    name: z.string(),
    value: z.string(),
    contrast: z.string(),
    usage: z.string(),
  }),
  surface: z.object({
    name: z.string(),
    value: z.string(),
    contrast: z.string(),
    usage: z.string(),
  }),
  text: z.object({
    name: z.string(),
    value: z.string(),
    contrast: z.string(),
    usage: z.string(),
  }),
  rationale: z.string(),
});

export type ColorPalette = z.infer<typeof ColorPaletteSchema>;

// Component Schema
export const ComponentSchema = z.object({
  type: z.enum(['navbar', 'hero', 'card', 'button', 'footer']),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  props: z.record(z.any()).optional(),
});

export type Component = z.infer<typeof ComponentSchema>;

// Memory System Schemas
export const MemoryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['font', 'color', 'component']),
  data: z.union([FontPairingSchema, ColorPaletteSchema, ComponentSchema]),
  timestamp: z.number(),
});

export const FeedbackSchema = z.object({
  id: z.string(),
  type: z.enum(['font', 'color', 'component']),
  action: z.enum(['like', 'dislike']),
  data: z.union([FontPairingSchema, ColorPaletteSchema, ComponentSchema]),
  timestamp: z.number(),
});

export type MemoryItem = z.infer<typeof MemoryItemSchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;

// API Response Schema
export const DesignResponseSchema = z.object({
  type: z.enum(['font', 'color', 'component']),
  data: z.union([FontPairingSchema, ColorPaletteSchema, ComponentSchema]),
});

export type DesignResponse = z.infer<typeof DesignResponseSchema>;
