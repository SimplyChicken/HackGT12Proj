import { StyleKeyword, UserPreferences } from '../schemas';

export class PreferenceLearner {
  private preferences: UserPreferences;
  
  constructor(userId: string) {
    this.preferences = {
      userId,
      extractedThemes: [],
      extractedColors: [],
      extractedStyles: [],
      extractedKeywords: [],
      extractedPatterns: [],
      styleKeywords: [],
      preferredColors: [],
      preferredThemes: [],
      preferredStyles: [],
      preferredPatterns: [],
      componentPreferences: {},
      analysisCount: 0,
      lastUpdated: Date.now()
    };
  }
  
  /**
   * Learn from user input and update preferences
   */
  learnFromInput(userInput: string, feedback?: 'like' | 'dislike'): void {
    // Safety check for undefined or null input
    if (!userInput || typeof userInput !== 'string') {
      return;
    }
    
    // For now, just store the raw user input as a keyword
    // The AI-powered theme extraction will handle the detailed analysis
    const inputKeyword: StyleKeyword = {
      keyword: userInput.toLowerCase(),
      category: 'theme',
      weight: feedback === 'like' ? 0.7 : feedback === 'dislike' ? 0.3 : 0.5,
      usageCount: 1,
      lastUsed: Date.now(),
      source: 'user-input'
    };
    
    this.updateKeywordPreference(inputKeyword, feedback);
    this.preferences.lastUpdated = Date.now();
  }
  
  /**
   * Update keyword preference based on usage and feedback
   */
  private updateKeywordPreference(newKeyword: StyleKeyword, feedback?: 'like' | 'dislike'): void {
    const existingKeyword = this.preferences.styleKeywords.find(
      k => k.keyword === newKeyword.keyword && k.category === newKeyword.category
    );
    
    if (existingKeyword) {
      // Update existing keyword
      existingKeyword.usageCount += 1;
      existingKeyword.lastUsed = Date.now();
      
      // Adjust weight based on feedback
      if (feedback === 'like') {
        existingKeyword.weight = Math.min(1, existingKeyword.weight + 0.1);
      } else if (feedback === 'dislike') {
        existingKeyword.weight = Math.max(0, existingKeyword.weight - 0.1);
      }
    } else {
      // Add new keyword
      const keyword: StyleKeyword = {
        ...newKeyword,
        weight: feedback === 'like' ? 0.7 : feedback === 'dislike' ? 0.3 : 0.5
      };
      this.preferences.styleKeywords.push(keyword);
    }
  }
  
  /**
   * Update color preference
   */
  private updateColorPreference(color: string, feedback?: 'like' | 'dislike'): void {
    if (feedback === 'like' && !this.preferences.preferredColors.includes(color)) {
      this.preferences.preferredColors.push(color);
    } else if (feedback === 'dislike') {
      this.preferences.preferredColors = this.preferences.preferredColors.filter(c => c !== color);
    }
  }
  
  /**
   * Update theme preference
   */
  private updateThemePreference(theme: string, feedback?: 'like' | 'dislike'): void {
    if (feedback === 'like' && !this.preferences.preferredThemes.includes(theme as any)) {
      this.preferences.preferredThemes.push(theme as any);
    } else if (feedback === 'dislike') {
      this.preferences.preferredThemes = this.preferences.preferredThemes.filter(t => t !== theme);
    }
  }
  
  /**
   * Get top preferences for a specific category
   */
  getTopPreferences(category: string, limit: number = 5): StyleKeyword[] {
    return this.preferences.styleKeywords
      .filter(k => k.category === category)
      .sort((a, b) => {
        // Sort by weight first, then by usage count
        if (b.weight !== a.weight) {
          return b.weight - a.weight;
        }
        return b.usageCount - a.usageCount;
      })
      .slice(0, limit);
  }
  
  /**
   * Get all preferences as a formatted string for AI prompts
   */
  getPreferencesForPrompt(): string {
    const sections: string[] = [];
    
    // Style keywords by category
    const categories = ['color', 'layout', 'typography', 'spacing', 'animation', 'theme', 'component-style'];
    categories.forEach(category => {
      const topKeywords = this.getTopPreferences(category, 3);
      if (topKeywords.length > 0) {
        const keywordList = topKeywords.map(k => `${k.keyword} (weight: ${k.weight.toFixed(2)})`).join(', ');
        sections.push(`${category}: ${keywordList}`);
      }
    });
    
    // Preferred colors
    if (this.preferences.preferredColors.length > 0) {
      sections.push(`preferred colors: ${this.preferences.preferredColors.join(', ')}`);
    }
    
    // Preferred themes
    if (this.preferences.preferredThemes.length > 0) {
      sections.push(`preferred themes: ${this.preferences.preferredThemes.join(', ')}`);
    }
    
    return sections.length > 0 
      ? `User Style Preferences:\n${sections.join('\n')}`
      : '';
  }
  
  /**
   * Get preferences for component generation
   */
  getComponentPreferences(componentType: string): any {
    const basePreferences = {
      styleKeywords: this.getTopPreferences('component-style', 3),
      colors: this.preferences.preferredColors.slice(0, 3),
      themes: this.preferences.preferredThemes.slice(0, 2)
    };
    
    // Add component-specific preferences if they exist
    const componentSpecific = this.preferences.componentPreferences[componentType];
    if (componentSpecific) {
      return { ...basePreferences, ...componentSpecific };
    }
    
    return basePreferences;
  }
  
  /**
   * Update component-specific preferences
   */
  updateComponentPreferences(componentType: string, preferences: any): void {
    this.preferences.componentPreferences[componentType] = {
      ...this.preferences.componentPreferences[componentType],
      ...preferences
    };
  }

  /**
   * Learn from component analysis and update preferences
   */
  learnFromComponentAnalysis(componentType: string, analysis: any): void {
    if (!analysis) return;

    // Store raw extracted data
    if (analysis.themes && Array.isArray(analysis.themes)) {
      this.preferences.extractedThemes = [...new Set([...(this.preferences.extractedThemes || []), ...analysis.themes])];
      this.preferences.preferredThemes = [...new Set([...(this.preferences.preferredThemes || []), ...analysis.themes])];
      
      // Also add as style keywords with AI source
      analysis.themes.forEach((theme: string) => {
        const themeKeyword = {
          keyword: theme,
          category: 'theme' as const,
          weight: 0.8,
          usageCount: 1,
          lastUsed: Date.now(),
          source: 'ai-analysis' as const
        };
        this.updateKeywordPreference(themeKeyword, 'like');
      });
    }

    if (analysis.colors && Array.isArray(analysis.colors)) {
      this.preferences.extractedColors = [...new Set([...(this.preferences.extractedColors || []), ...analysis.colors])];
      this.preferences.preferredColors = [...new Set([...(this.preferences.preferredColors || []), ...analysis.colors])];
      
      analysis.colors.forEach((color: string) => {
        const colorKeyword = {
          keyword: color,
          category: 'color' as const,
          weight: 0.8,
          usageCount: 1,
          lastUsed: Date.now(),
          source: 'ai-analysis' as const
        };
        this.updateKeywordPreference(colorKeyword, 'like');
      });
    }

    if (analysis.styles && Array.isArray(analysis.styles)) {
      this.preferences.extractedStyles = [...new Set([...(this.preferences.extractedStyles || []), ...analysis.styles])];
      this.preferences.preferredStyles = [...new Set([...(this.preferences.preferredStyles || []), ...analysis.styles])];
      
      analysis.styles.forEach((style: string) => {
        const styleKeyword = {
          keyword: style,
          category: 'component-style' as const,
          weight: 0.8,
          usageCount: 1,
          lastUsed: Date.now(),
          source: 'ai-analysis' as const
        };
        this.updateKeywordPreference(styleKeyword, 'like');
      });
    }

    if (analysis.keywords && Array.isArray(analysis.keywords)) {
      this.preferences.extractedKeywords = [...new Set([...(this.preferences.extractedKeywords || []), ...analysis.keywords])];
      
      analysis.keywords.forEach((keyword: string) => {
        const keywordStyle = {
          keyword: keyword,
          category: 'theme' as const,
          weight: 0.7,
          usageCount: 1,
          lastUsed: Date.now(),
          source: 'ai-analysis' as const
        };
        this.updateKeywordPreference(keywordStyle, 'like');
      });
    }

    if (analysis.patterns && Array.isArray(analysis.patterns)) {
      this.preferences.extractedPatterns = [...new Set([...(this.preferences.extractedPatterns || []), ...analysis.patterns])];
      this.preferences.preferredPatterns = [...new Set([...(this.preferences.preferredPatterns || []), ...analysis.patterns])];
      
      analysis.patterns.forEach((pattern: string) => {
        const patternKeyword = {
          keyword: pattern,
          category: 'pattern' as const,
          weight: 0.8,
          usageCount: 1,
          lastUsed: Date.now(),
          source: 'ai-analysis' as const
        };
        this.updateKeywordPreference(patternKeyword, 'like');
      });
    }

    // Update component-specific preferences
    if (analysis.preferences) {
      this.updateComponentPreferences(componentType, analysis.preferences);
    }

    // Update analysis metadata
    this.preferences.analysisCount = (this.preferences.analysisCount || 0) + 1;
    this.preferences.lastAnalysis = new Date();
    this.preferences.lastUpdated = Date.now();
  }
  
  /**
   * Get current preferences object
   */
  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }
  
  /**
   * Set preferences (for loading from database)
   */
  setPreferences(preferences: UserPreferences): void {
    this.preferences = { ...preferences };
  }
  
  /**
   * Merge with existing preferences (for incremental updates)
   */
  mergePreferences(newPreferences: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...newPreferences,
      styleKeywords: this.mergeKeywords(this.preferences.styleKeywords, newPreferences.styleKeywords || []),
      preferredColors: [...new Set([...this.preferences.preferredColors, ...(newPreferences.preferredColors || [])])],
      preferredThemes: [...new Set([...this.preferences.preferredThemes, ...(newPreferences.preferredThemes || [])])],
      componentPreferences: {
        ...this.preferences.componentPreferences,
        ...(newPreferences.componentPreferences || {})
      }
    };
  }
  
  /**
   * Merge keyword arrays intelligently
   */
  private mergeKeywords(existing: StyleKeyword[], newKeywords: StyleKeyword[]): StyleKeyword[] {
    const keywordMap = new Map<string, StyleKeyword>();
    
    // Add existing keywords
    existing.forEach(keyword => {
      const key = `${keyword.keyword}-${keyword.category}`;
      keywordMap.set(key, keyword);
    });
    
    // Merge new keywords
    newKeywords.forEach(keyword => {
      const key = `${keyword.keyword}-${keyword.category}`;
      const existing = keywordMap.get(key);
      
      if (existing) {
        // Merge existing keyword
        existing.usageCount += keyword.usageCount;
        existing.lastUsed = Math.max(existing.lastUsed, keyword.lastUsed);
        existing.weight = (existing.weight + keyword.weight) / 2; // Average the weights
      } else {
        // Add new keyword
        keywordMap.set(key, keyword);
      }
    });
    
    return Array.from(keywordMap.values());
  }
}
