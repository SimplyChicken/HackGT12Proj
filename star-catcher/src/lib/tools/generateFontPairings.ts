import { z } from 'zod';
import { FontPairingSchema } from '../schemas';

const GoogleFonts = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Source Sans Pro',
  'Raleway', 'PT Sans', 'Nunito', 'Playfair Display', 'Merriweather', 'Crimson Text',
  'Libre Baskerville', 'Lora', 'PT Serif', 'Crimson Text', 'Playfair Display',
  'Space Grotesk', 'DM Sans', 'Work Sans', 'Fira Sans', 'IBM Plex Sans',
  'Atkinson Hyperlegible', 'Public Sans', 'Recursive', 'Spectral', 'Chivo'
];

const FontWeights = ['300', '400', '500', '600', '700'];
const FontStyles = ['normal', 'italic'];

interface GenerateFontPairingsOptions {
  style?: string;
  purpose?: string;
}

export const generateFontPairings = async (options: GenerateFontPairingsOptions = {}): Promise<any> => {
  const { style = 'modern', purpose = 'website' } = options;
  
  // Simulate AI-generated font pairing logic
  const primaryFont = GoogleFonts[Math.floor(Math.random() * GoogleFonts.length)];
  const secondaryFont = GoogleFonts[Math.floor(Math.random() * GoogleFonts.length)];
  
  const primaryWeight = FontWeights[Math.floor(Math.random() * FontWeights.length)];
  const secondaryWeight = FontWeights[Math.floor(Math.random() * FontWeights.length)];
  
  const primaryStyle = FontStyles[Math.floor(Math.random() * FontStyles.length)];
  const secondaryStyle = FontStyles[Math.floor(Math.random() * FontStyles.length)];

  const fontPairing = {
    primary: {
      name: primaryFont,
      googleFontUrl: `https://fonts.googleapis.com/css2?family=${primaryFont.replace(' ', '+')}:wght@${primaryWeight}${primaryStyle === 'italic' ? ':ital,wght@1' : ''}`,
      weight: primaryWeight,
      style: primaryStyle,
      usage: 'Use for headings, titles, and important text elements',
    },
    secondary: {
      name: secondaryFont,
      googleFontUrl: `https://fonts.googleapis.com/css2?family=${secondaryFont.replace(' ', '+')}:wght@${secondaryWeight}${secondaryStyle === 'italic' ? ':ital,wght@1' : ''}`,
      weight: secondaryWeight,
      style: secondaryStyle,
      usage: 'Use for body text, captions, and supporting content',
    },
    rationale: `${primaryFont} and ${secondaryFont} create a harmonious ${style} pairing perfect for ${purpose}. The combination offers excellent readability and visual hierarchy.`,
  };

  return FontPairingSchema.parse(fontPairing);
};
