# Enhanced User Style Preferences System

## Overview

This system enhances the Star Catcher application with intelligent user preference learning that automatically extracts style keywords from user input and builds personalized style profiles over time.

## Key Features

### 🎯 **Automatic Keyword Extraction**
- Extracts style preferences from natural language input
- Categorizes keywords into: color, layout, typography, spacing, animation, theme, component-style
- Supports synonyms and multiple ways to express the same preference

### 🧠 **Intelligent Learning**
- Learns from user interactions and feedback
- Tracks keyword weights based on usage frequency and user feedback
- Builds component-specific preferences over time

### 💾 **Persistent Storage**
- Stores preferences in localStorage (client-side) and MongoDB (server-side)
- Supports both anonymous and authenticated users
- Automatic preference merging and conflict resolution

## Architecture

### Core Components

1. **StyleKeywordExtractor** (`keywordExtractor.ts`)
   - Extracts style keywords from user input
   - Maps natural language to structured preferences
   - Supports color extraction, theme detection, and style categorization

2. **PreferenceLearner** (`preferenceLearner.ts`)
   - Manages user preference learning and updates
   - Handles preference merging and conflict resolution
   - Provides formatted preferences for AI prompts

3. **Enhanced MemorySystem** (`memory.ts`)
   - Integrates preference learning with existing memory system
   - Provides unified API for memory and preference management
   - Handles localStorage persistence

4. **Updated Mastra Integration** (`server.ts`)
   - Automatically learns from user input during component generation
   - Enhances AI prompts with learned preferences
   - Provides personalized component recommendations

## Usage Examples

### Learning from User Input

```typescript
// The system automatically learns when users make requests
const userInput = "I want a dark, modern navbar with rounded corners";

// Keywords extracted:
// - dark (color, weight: 0.5)
// - modern (theme, weight: 0.5)  
// - rounded (component-style, weight: 0.5)

// Future requests will be influenced by these preferences
```

### Getting Personalized Recommendations

```typescript
const preferences = memorySystem.getComponentPreferences('navbar');
// Returns: {
//   styleKeywords: [{ keyword: 'rounded', category: 'component-style', weight: 0.7 }],
//   colors: ['dark'],
//   themes: ['modern']
// }
```

### Using in AI Prompts

```typescript
const prompt = memorySystem.getPreferencesForPrompt();
// Returns formatted string:
// "User Style Preferences:
// color: dark (weight: 0.65), bold (weight: 0.55)
// theme: modern (weight: 0.70), minimal (weight: 0.60)
// component-style: rounded (weight: 0.75)
// preferred colors: dark, navy, charcoal
// preferred themes: modern, minimal"
```

## Supported Keywords

### Color Keywords
- **Dark**: dark, black, night, shadow, midnight
- **Light**: light, white, bright, clean, minimal
- **Colorful**: colorful, vibrant, bright colors, rainbow
- **Warm**: warm, orange, red, yellow, cozy
- **Cool**: cool, blue, green, purple, ocean
- **Bold**: bold, vibrant, strong, intense

### Theme Keywords
- **Modern**: modern, contemporary, current, trendy
- **Minimal**: minimal, minimalist, clean, simple
- **Bold**: bold, striking, dramatic, attention-grabbing
- **Elegant**: elegant, sophisticated, refined, classy
- **Playful**: playful, fun, whimsical, cheerful
- **Corporate**: corporate, professional, business, formal

### Component Style Keywords
- **Rounded**: rounded, soft, curved, pill
- **Sharp**: sharp, angular, geometric, crisp
- **Shadowed**: shadowed, elevated, floating, depth
- **Flat**: flat, no shadow, simple, clean

## Integration with Mastra

The system seamlessly integrates with the existing Mastra workflow:

1. **User makes request** → Keywords are automatically extracted
2. **Mastra agent processes** → Enhanced with learned preferences
3. **Component generated** → Personalized based on user history
4. **User provides feedback** → Preferences are updated and weighted

## Database Schema

### User Model Updates
```typescript
{
  preferences: {
    styleKeywords: [{
      keyword: String,
      category: String,
      weight: Number, // 0-1
      usageCount: Number,
      lastUsed: Date
    }],
    preferredColors: [String],
    preferredThemes: [String],
    componentPreferences: Map,
    lastUpdated: Date
  }
}
```

## API Endpoints

### `/api/preferences`
- `POST` with action: `get`, `update`, `learn`, `clear`
- Handles preference management and learning
- Supports both client-side and server-side preference storage

## Benefits

1. **Personalized Experience**: Users get components that match their style preferences
2. **Reduced Iterations**: Fewer back-and-forth requests to get desired results
3. **Learning Over Time**: System gets better at understanding user preferences
4. **Cross-Component Learning**: Preferences learned in one component type influence others
5. **Intelligent Weighting**: Frequently used preferences get higher priority

## Future Enhancements

- **Visual Preference Learning**: Learn from user's visual selections
- **Collaborative Filtering**: Learn from similar users' preferences
- **A/B Testing**: Test different preference weights for optimization
- **Export/Import**: Allow users to share or backup their preferences
- **Preference Analytics**: Dashboard showing user preference trends
