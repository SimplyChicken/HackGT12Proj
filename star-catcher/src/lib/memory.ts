import { MemoryItem, Feedback, MemoryItemSchema, FeedbackSchema, UserPreferences } from './schemas';
import { PreferenceLearner } from './preferences/preferenceLearner';

const MEMORY_STORAGE_KEY = 'design-memories';
const FEEDBACK_STORAGE_KEY = 'design-feedback';
const PREFERENCES_STORAGE_KEY = 'user-preferences';

export class MemorySystem {
  private static instance: MemorySystem;
  private preferenceLearner: PreferenceLearner;
  
  private constructor() {
    this.preferenceLearner = new PreferenceLearner('anonymous');
    this.loadPreferences();
  }
  
  public static getInstance(): MemorySystem {
    if (!MemorySystem.instance) {
      MemorySystem.instance = new MemorySystem();
    }
    return MemorySystem.instance;
  }

  // Memory Management
  public saveMemory(memory: MemoryItem): void {
    if (typeof window === 'undefined') return;
    
    const memories = this.getMemories();
    const existingIndex = memories.findIndex(m => m.id === memory.id);
    
    if (existingIndex >= 0) {
      memories[existingIndex] = memory;
    } else {
      memories.push(memory);
    }
    
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));
  }

  public getMemories(): MemoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (!stored) return [];
      
      const memories = JSON.parse(stored);
      return memories.map((memory: any) => MemoryItemSchema.parse(memory));
    } catch (error) {
      console.error('Error parsing memories:', error);
      return [];
    }
  }

  public removeMemory(id: string): void {
    if (typeof window === 'undefined') return;
    
    const memories = this.getMemories().filter(m => m.id !== id);
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));
  }

  public clearMemories(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(MEMORY_STORAGE_KEY);
  }

  // Feedback Management
  public saveFeedback(feedback: Feedback): void {
    if (typeof window === 'undefined') return;
    
    const feedbacks = this.getFeedbacks();
    const existingIndex = feedbacks.findIndex(f => f.id === feedback.id);
    
    if (existingIndex >= 0) {
      feedbacks[existingIndex] = feedback;
    } else {
      feedbacks.push(feedback);
    }
    
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
  }

  public getFeedbacks(): Feedback[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (!stored) return [];
      
      const feedbacks = JSON.parse(stored);
      return feedbacks.map((feedback: any) => FeedbackSchema.parse(feedback));
    } catch (error) {
      console.error('Error parsing feedbacks:', error);
      return [];
    }
  }

  public getFeedbacksByType(type: 'font' | 'color' | 'component'): Feedback[] {
    return this.getFeedbacks().filter(f => f.type === type);
  }

  public getLikedItems(): MemoryItem[] {
    const feedbacks = this.getFeedbacks().filter(f => f.action === 'like');
    const memories = this.getMemories();
    
    return feedbacks.map(feedback => {
      const memory = memories.find(m => m.id === feedback.id);
      return memory;
    }).filter(Boolean) as MemoryItem[];
  }

  public getDislikedItems(): MemoryItem[] {
    const feedbacks = this.getFeedbacks().filter(f => f.action === 'dislike');
    const memories = this.getMemories();
    
    return feedbacks.map(feedback => {
      const memory = memories.find(m => m.id === feedback.id);
      return memory;
    }).filter(Boolean) as MemoryItem[];
  }

  // Helper methods
  public generateId(): string {
    return `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public createMemoryFromData(type: 'font' | 'color' | 'component', data: any): MemoryItem {
    return {
      id: this.generateId(),
      type,
      data,
      timestamp: Date.now(),
    };
  }

  public createFeedbackFromMemory(memory: MemoryItem, action: 'like' | 'dislike'): Feedback {
    return {
      id: memory.id,
      type: memory.type,
      action,
      data: memory.data,
      timestamp: Date.now(),
    };
  }

  // Enhanced Preference Learning Methods
  public learnFromUserInput(userInput: string, feedback?: 'like' | 'dislike'): void {
    this.preferenceLearner.learnFromInput(userInput, feedback);
    this.savePreferences();
  }

  public getPreferencesForPrompt(): string {
    return this.preferenceLearner.getPreferencesForPrompt();
  }

  public getComponentPreferences(componentType: string): any {
    return this.preferenceLearner.getComponentPreferences(componentType);
  }

  public getTopPreferences(category: string, limit: number = 5): any[] {
    return this.preferenceLearner.getTopPreferences(category, limit);
  }

  // Preference Storage Methods
  private savePreferences(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const preferences = this.preferenceLearner.getPreferences();
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  private loadPreferences(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        this.preferenceLearner.setPreferences(preferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }

  public updatePreferences(newPreferences: Partial<UserPreferences>): void {
    this.preferenceLearner.mergePreferences(newPreferences);
    this.savePreferences();
  }

  public clearPreferences(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    this.preferenceLearner = new PreferenceLearner('anonymous');
  }
}

export const memorySystem = MemorySystem.getInstance();
