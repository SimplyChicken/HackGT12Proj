export const config = {
  runtime: "node",
};

import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User";
import SavedComponent from "../../../models/SavedComponent";
import dbConnect from "../../../lib/dbConnect";
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ensure mongoose is connected
    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).lean<{ colorPairs?: any[]; fontPairs?: any[]; combos?: any[] }>();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.log('Pairs API - Retrieved user data:');
    console.log('colorPairs:', user.colorPairs);
    console.log('fontPairs:', user.fontPairs);
    console.log('combos:', user.combos);

    // Fetch saved components from the separate SavedComponent collection
    const components = await SavedComponent.find({ userId: session.user.email })
      .sort({ savedAt: -1 })
      .lean();

    // Filter out fallback or invalid font pairs (e.g., Arial / sans-serif or missing names)
    const rawFontPairs = (user.fontPairs || []) as any[];
    const filteredFontPairs = rawFontPairs.filter((pair) => {
      const primaryName = (pair?.primary?.name || pair?.font || '').toString().trim().toLowerCase();
      const secondaryName = (pair?.secondary?.name || pair?.font2 || '').toString().trim().toLowerCase();

      // Consider entries with both names missing or fallback defaults as invalid
      const primaryIsFallbackOrMissing = primaryName === '' || primaryName === 'arial';
      const secondaryIsFallbackOrMissing = secondaryName === '' || secondaryName === 'sans-serif';

      // If both sides are missing/fallback, drop it
      if (primaryIsFallbackOrMissing && secondaryIsFallbackOrMissing) return false;

      // Otherwise keep it
      return true;
    });

    return NextResponse.json({
      colorPairs: user.colorPairs || [],
      fontPairs: filteredFontPairs,
      combos: user.combos || [],
      components: components || [],
    });
  } catch (err) {
    console.error("API /api/pairs error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
