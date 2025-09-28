import { StyleKeyword, UserPreferences } from '../schemas';

// Style keyword mappings for automatic extraction
const STYLE_KEYWORD_MAPPINGS = {
  // Color keywords
  color: {
    'dark': ['dark', 'black', 'night', 'shadow', 'midnight'],
    'light': ['light', 'white', 'bright', 'clean', 'minimal'],
    'colorful': ['colorful', 'vibrant', 'bright colors', 'rainbow', 'multicolor'],
    'monochrome': ['monochrome', 'grayscale', 'black and white', 'neutral'],
    'warm': ['warm', 'orange', 'red', 'yellow', 'cozy', 'sunset'],
    'cool': ['cool', 'blue', 'green', 'purple', 'ocean', 'sky'],
    'pastel': ['pastel', 'soft', 'gentle', 'muted', 'subtle'],
    'bold': ['bold', 'vibrant', 'strong', 'intense', 'dramatic']
  },
  
  // Layout keywords
  layout: {
    'centered': ['centered', 'center', 'middle', 'balanced'],
    'left-aligned': ['left', 'left-aligned', 'left side'],
    'right-aligned': ['right', 'right-aligned', 'right side'],
    'grid': ['grid', 'organized', 'structured', 'layout'],
    'spacious': ['spacious', 'roomy', 'breathing room', 'open'],
    'compact': ['compact', 'tight', 'condensed', 'dense']
  },
  
  // Typography keywords
  typography: {
    'bold': ['bold', 'strong', 'heavy', 'thick'],
    'thin': ['thin', 'light', 'delicate', 'fine'],
    'serif': ['serif', 'classic', 'traditional', 'elegant'],
    'sans-serif': ['sans-serif', 'modern', 'clean', 'geometric'],
    'large': ['large', 'big', 'huge', 'prominent'],
    'small': ['small', 'tiny', 'subtle', 'minimal']
  },
  
  // Spacing keywords
  spacing: {
    'tight': ['tight', 'close', 'minimal spacing', 'condensed'],
    'loose': ['loose', 'wide', 'generous spacing', 'open'],
    'balanced': ['balanced', 'even', 'proportional', 'harmonious'],
    'minimal': ['minimal', 'clean', 'simple', 'uncluttered']
  },
  
  // Animation keywords
  animation: {
    'smooth': ['smooth', 'fluid', 'elegant', 'polished'],
    'bouncy': ['bouncy', 'playful', 'fun', 'energetic'],
    'subtle': ['subtle', 'gentle', 'soft', 'understated'],
    'dramatic': ['dramatic', 'bold', 'eye-catching', 'striking'],
    'none': ['static', 'no animation', 'still', 'fixed']
  },
  
  // Theme keywords
  theme: {
    'modern': ['modern', 'contemporary', 'current', 'trendy'],
    'minimal': ['minimal', 'minimalist', 'clean', 'simple'],
    'bold': ['bold', 'striking', 'dramatic', 'attention-grabbing'],
    'elegant': ['elegant', 'sophisticated', 'refined', 'classy'],
    'playful': ['playful', 'fun', 'whimsical', 'cheerful'],
    'corporate': ['corporate', 'professional', 'business', 'formal'],
    'creative': ['creative', 'artistic', 'unique', 'innovative']
  },
  
  // Component-style keywords
  'component-style': {
    'rounded': ['rounded', 'soft', 'curved', 'pill'],
    'sharp': ['sharp', 'angular', 'geometric', 'crisp'],
    'shadowed': ['shadowed', 'elevated', 'floating', 'depth'],
    'flat': ['flat', 'no shadow', 'simple', 'clean'],
    'gradient': ['gradient', 'colorful', 'blended', 'smooth'],
    'outlined': ['outlined', 'border', 'bordered', 'defined']
  }
};

export class StyleKeywordExtractor {
  /**
   * Extract style keywords from user input text
   */
  static extractKeywords(userInput: string): StyleKeyword[] {
    const keywords: StyleKeyword[] = [];
    const input = userInput.toLowerCase();
    
    // Iterate through all keyword mappings
    Object.entries(STYLE_KEYWORD_MAPPINGS).forEach(([category, keywordMap]) => {
      Object.entries(keywordMap).forEach(([keyword, synonyms]) => {
        // Check if any synonym matches the user input
        const matches = synonyms.some(synonym => input.includes(synonym));
        
        if (matches) {
          keywords.push({
            keyword,
            category: category as any,
            weight: 0.5, // Default weight
            usageCount: 1,
            lastUsed: Date.now()
          });
        }
      });
    });
    
    return keywords;
  }
  
  /**
   * Extract color preferences from user input
   */
  static extractColorPreferences(userInput: string): string[] {
    const colors: string[] = [];
    const input = userInput.toLowerCase();
    
    // Common color names
    const colorNames = [
      'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown',
      'black', 'white', 'gray', 'grey', 'silver', 'gold', 'navy', 'teal',
      'cyan', 'magenta', 'lime', 'olive', 'maroon', 'aqua', 'fuchsia'
    ];
    
    colorNames.forEach(color => {
      if (input.includes(color)) {
        colors.push(color);
      }
    });
    
    // Extract hex colors
    const hexMatches = input.match(/#[0-9a-fA-F]{6}/g);
    if (hexMatches) {
      colors.push(...hexMatches);
    }
    
    return colors;
  }
  
  /**
   * Extract theme preferences from user input
   */
  static extractThemePreferences(userInput: string): string[] {
    const themes: string[] = [];
    const input = userInput.toLowerCase();
    
    const themeKeywords = {
      'modern': ['modern', 'contemporary', 'current', 'trendy'],
      'minimal': ['minimal', 'minimalist', 'clean', 'simple'],
      'bold': ['bold', 'striking', 'dramatic', 'attention-grabbing'],
      'elegant': ['elegant', 'sophisticated', 'refined', 'classy'],
      'playful': ['playful', 'fun', 'whimsical', 'cheerful'],
      'corporate': ['corporate', 'professional', 'business', 'formal'],
      'creative': ['creative', 'artistic', 'unique', 'innovative']
    };
    
    Object.entries(themeKeywords).forEach(([theme, synonyms]) => {
      const matches = synonyms.some(synonym => input.includes(synonym));
      if (matches) {
        themes.push(theme);
      }
    });
    
    return themes;
  }
  
  /**
   * Combine extracted preferences into a comprehensive analysis
   */
  static extractPreferences(userInput: string): {
    keywords: StyleKeyword[];
    colors: string[];
    themes: string[];
  } {
    return {
      keywords: this.extractKeywords(userInput),
      colors: this.extractColorPreferences(userInput),
      themes: this.extractThemePreferences(userInput)
    };
  }
}
