import type { Metadata } from "next";
import { Poly, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers"; // 👈 your SessionProvider wrapper

// Fonts
const poly = Poly({
  variable: "--font-poly",
  subsets: ["latin"],
  weight: "400",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Metadata
export const metadata: Metadata = {
  title: "Star Catcher - AI Design Generator",
  description:
    "Generate beautiful font pairings, accessible color palettes, and production-ready components powered by Mastra AI",
};

// Root layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poly.variable} ${outfit.variable} antialiased min-h-screen`}
        style={{ backgroundColor: '#F0EAD6' }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

