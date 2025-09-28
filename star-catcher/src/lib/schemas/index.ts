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
  })
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
    value: z.string(),
    contrast: z.string(),
  }),
  secondary: z.object({
    value: z.string(),
    contrast: z.string(),
  }),
  accent: z.object({
    value: z.string(),
    contrast: z.string(),
  }),
});

export type ColorPalette = z.infer<typeof ColorPaletteSchema>;

// Component Schema
export const ComponentSchema = z.object({
  type: z.enum(['navbar', 'hero', 'card', 'button', 'footer']),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  props: z.record(z.any()).optional(),
  style: z.string().optional(),
  features: z.array(z.string()).optional(),
  preferences: z.record(z.any()).optional(),
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

// User Style Preferences Schema
export const StyleKeywordSchema = z.object({
  keyword: z.string(),
  category: z.enum(['color', 'layout', 'typography', 'spacing', 'animation', 'theme', 'component-style', 'pattern']),
  weight: z.number().min(0).max(1).default(0.5), // How much user likes this keyword
  usageCount: z.number().default(1),
  lastUsed: z.number().default(() => Date.now()),
  source: z.enum(['user-input', 'ai-analysis']).default('user-input'),
});

export const UserPreferencesSchema = z.object({
  userId: z.string(),
  
  // Raw extracted data from OpenAI analysis
  extractedThemes: z.array(z.string()).default([]),
  extractedColors: z.array(z.string()).default([]),
  extractedStyles: z.array(z.string()).default([]),
  extractedKeywords: z.array(z.string()).default([]),
  extractedPatterns: z.array(z.string()).default([]),
  
  // Processed preferences with weights and usage tracking
  styleKeywords: z.array(StyleKeywordSchema).default([]),
  
  // Aggregated preferences
  preferredColors: z.array(z.string()).default([]),
  preferredThemes: z.array(z.string()).default([]), // No enum restriction - let AI generate themes
  preferredStyles: z.array(z.string()).default([]),
  preferredPatterns: z.array(z.string()).default([]),
  
  // Component-specific preferences
  componentPreferences: z.record(z.any()).default({}),
  
  // Analysis metadata
  analysisCount: z.number().default(0),
  lastAnalysis: z.date().optional(),
  lastUpdated: z.number().default(() => Date.now()),
});

export type StyleKeyword = z.infer<typeof StyleKeywordSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

// API Response Schema
export const DesignResponseSchema = z.object({
  type: z.enum(['font', 'color', 'component']),
  data: z.union([FontPairingSchema, ColorPaletteSchema, ComponentSchema]),
});

export type DesignResponse = z.infer<typeof DesignResponseSchema>;
