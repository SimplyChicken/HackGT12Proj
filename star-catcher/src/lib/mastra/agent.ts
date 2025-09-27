import { generateFontPairings } from '../tools/generateFontPairings';
import { generatePalette } from '../tools/generatePalette';
import { generateComponent } from '../tools/generateComponent';
import { MemoryItem } from '../schemas';

export class DesignAgent {
  private memories: MemoryItem[] = [];

  constructor() {
    // Simplified agent without external AI service for demo purposes
  }

  private getSystemPrompt(): string {
    const memoryContext = this.getMemoryContext();
    
    return `You are DesignAgent, a senior product designer + frontend developer. You return minimal, production-ready decisions. Prefer accessibility (WCAG AA+), modern web defaults, and Tailwind best practices.

${memoryContext}

Your role:
- Generate font pairings that work harmoniously together
- Create accessible color palettes with proper contrast ratios
- Build responsive, production-ready React components with Tailwind CSS
- Always consider accessibility and modern web standards
- Provide clear rationale for design decisions

Guidelines:
- Use semantic HTML elements
- Ensure proper color contrast (WCAG AA minimum)
- Make components responsive and mobile-first
- Use Tailwind utility classes effectively
- Follow React best practices
- Keep code clean and maintainable`;
  }

  private getMemoryContext(): string {
    if (this.memories.length === 0) {
      return '';
    }

    const likedItems = this.memories.filter(m => m.type === 'font' || m.type === 'color' || m.type === 'component');
    
    if (likedItems.length === 0) {
      return '';
    }

    const fontPreferences = likedItems.filter(m => m.type === 'font').map(m => {
      const font = m.data as any;
      return `${font.primary.name} + ${font.secondary.name}`;
    });

    const colorPreferences = likedItems.filter(m => m.type === 'color').map(m => {
      const color = m.data as any;
      return `${color.primary.name} (${color.primary.value})`;
    });

    const componentPreferences = likedItems.filter(m => m.type === 'component').map(m => {
      const component = m.data as any;
      return component.name;
    });

    let context = 'User Preferences (based on previous likes):\n';
    
    if (fontPreferences.length > 0) {
      context += `- Preferred font pairings: ${fontPreferences.join(', ')}\n`;
    }
    
    if (colorPreferences.length > 0) {
      context += `- Preferred colors: ${colorPreferences.join(', ')}\n`;
    }
    
    if (componentPreferences.length > 0) {
      context += `- Preferred component styles: ${componentPreferences.join(', ')}\n`;
    }

    context += '\nBias your recommendations toward these preferences while maintaining quality and accessibility.';
    
    return context;
  }

  public setMemories(memories: MemoryItem[]): void {
    this.memories = memories;
  }

  public async generate(type: 'font' | 'color' | 'component', options: any = {}): Promise<any> {
    try {
      let result;
      
      if (type === 'font') {
        result = await generateFontPairings(options);
      } else if (type === 'color') {
        result = await generatePalette(options);
      } else if (type === 'component') {
        result = await generateComponent({ 
          componentType: options.componentType || 'button', 
          style: options.style || 'modern' 
        });
      } else {
        throw new Error(`Invalid type: ${type}`);
      }

      return result;
    } catch (error) {
      console.error('Error generating design:', error);
      throw new Error(`Failed to generate ${type}: ${error}`);
    }
  }
}

// Export singleton instance
export const designAgent = new DesignAgent();
