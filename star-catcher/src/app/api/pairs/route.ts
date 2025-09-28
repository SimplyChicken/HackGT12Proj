export const config = {
  runtime: "node",
};

import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User";
import dbConnect from "../../../lib/dbConnect";
import { auth } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ensure mongoose is connected
    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).lean<{ colorPairs?: any[]; fontPairs?: any[] }>();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      colorPairs: user.colorPairs || [],
      fontPairs: user.fontPairs || [],
    });
  } catch (err) {
    console.error("API /api/pairs error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
