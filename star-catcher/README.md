# Star Catcher - AI Design Generator

A Next.js 14 application powered by a Mastra AI Agent that generates beautiful web design artifacts including font pairings, color palettes, and React components.

## Features

### 🎨 Design Generation
- **Font Pairings**: Generate harmonious Google Font combinations with usage guidance
- **Color Palettes**: Create accessible color schemes with WCAG AA contrast compliance
- **React Components**: Generate production-ready components (navbars, heroes, cards, buttons, footers)

### 🧠 AI-Powered Memory System
- **Personalized Recommendations**: The AI learns from your likes and dislikes
- **Memory Storage**: Save and manage your favorite designs in localStorage
- **Smart Biasing**: Future generations are influenced by your preferences

### 🎯 Modern Tech Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zod** for data validation
- **Mastra AI** for intelligent design generation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd star-catcher
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Generating Designs

1. **Fonts Tab**: Click "Generate Font Pairing" to create harmonious typography combinations
2. **Colors Tab**: Click "Generate Color Palette" to create accessible color schemes  
3. **Components Tab**: Click "Generate Component" to create React components

### Managing Memories

1. **Like/Dislike**: Use the 👍/👎 buttons to provide feedback on generated designs
2. **View Memories**: Click the "Memories" button to see all saved designs
3. **Apply Memories**: Click "Apply" on any saved memory to reuse previous designs

### Memory System

The application learns from your preferences:
- **Liked items** influence future generations positively
- **Disliked items** are avoided in future recommendations
- **All feedback** is stored locally in your browser

## Architecture

### Core Components

- **DesignAgent**: Central AI agent that coordinates design generation
- **Tools**: Specialized functions for fonts, colors, and components
- **Memory System**: Manages user preferences and feedback
- **API Routes**: Handle generation requests and responses

### File Structure

```
src/
├── app/
│   ├── api/design/route.ts    # API endpoint for design generation
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main application page
├── components/ui/
│   ├── GeneratorPanel.tsx     # Main interface with tabs
│   ├── TypographyPreview.tsx  # Font pairing preview
│   ├── PalettePreview.tsx     # Color palette preview
│   ├── PreviewCanvas.tsx      # Component preview
│   ├── LikeBar.tsx            # Feedback interface
│   └── MemoriesDrawer.tsx     # Memory management
├── lib/
│   ├── mastra/agent.ts        # DesignAgent implementation
│   ├── tools/                 # Generation tools
│   ├── schemas/               # Zod validation schemas
│   └── memory.ts              # Memory system
```

## API Reference

### POST /api/design

Generate design artifacts.

**Request Body:**
```json
{
  "type": "font" | "color" | "component",
  "options": {
    "style": "modern",
    "purpose": "website"
  },
  "memories": []
}
```

**Response:**
```json
{
  "type": "font",
  "data": {
    "primary": { "name": "Inter", "googleFontUrl": "...", ... },
    "secondary": { "name": "Roboto", "googleFontUrl": "...", ... },
    "rationale": "..."
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Mastra AI](https://mastra.ai/)
- Validated with [Zod](https://zod.dev/)
