// /api/save/colors/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const body = await req.json();
    const { email, primary, secondary, accent } = body;

    // Validate required fields
    if (!email || !primary || !secondary || !accent) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a valid color pair object with case_id - save the full objects with names and values
    const colorData = { 
      case_id: Date.now().toString(),
      primary,
      secondary,
      accent
    };

    console.log('Color save API - colorData to save:', colorData);

    // Update the user document
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $push: { colorPairs: colorData } },
      { new: true }
    );

    console.log('Color save API - saved successfully, updated user:', updatedUser);

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

export async function DELETE(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('case_id');

    if (!caseId) {
      return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Color delete API - deleting case_id:', caseId, 'for user:', (session as any).user.email);

    // Remove the color pair from the user document
    const updatedUser = await User.findOneAndUpdate(
      { email: (session as any).user.email },
      { $pull: { colorPairs: { case_id: caseId } } },
      { new: true }
    );

    console.log('Color delete API - result:', updatedUser);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (err: any) {
    console.error("Error deleting color pair:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
