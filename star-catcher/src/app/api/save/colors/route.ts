// /api/save/colors/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const body = await req.json();
    const { email, case_id, color, color2 } = body;

    // Validate required fields
    if (!email || !case_id || !color || !color2) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a valid color pair object
    const colorData = { case_id, color, color2 };

    // Update the user document
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $push: { colorPairs: colorData } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (err: any) {
    console.error("Error saving color pair:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
