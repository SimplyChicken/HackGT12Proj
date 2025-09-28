import { StyleKeyword, UserPreferences } from '../schemas';

export class PreferenceLearner {
  private preferences: UserPreferences;
  
  constructor(userId: string) {
    this.preferences = {
      userId,
      styleKeywords: [],
      preferredColors: [],
      preferredThemes: [],
      componentPreferences: {},
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
      lastUsed: Date.now()
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
