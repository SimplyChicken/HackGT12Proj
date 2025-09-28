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
    const { colorPair, fontPair } = body;

    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Validate required fields
    if (!colorPair || !fontPair) {
      return NextResponse.json(
        { success: false, error: "Missing color pair or font pair" },
        { status: 400 }
      );
    }

    // Create a combo object with case_id
    const comboData = { 
      case_id: Date.now().toString(),
      colorPair,
      fontPair
    };

    console.log('Combo save API - comboData to save:', comboData);

    // Update the user document
    const updatedUser = await User.findOneAndUpdate(
      { email: (session as any).user.email },
      { $push: { combos: comboData } },
      { new: true }
    );

    console.log('Combo save API - saved successfully, updated user:', updatedUser);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (err: any) {
    console.error("Error saving combo:", err);
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

    console.log('Combo delete API - deleting case_id:', caseId, 'for user:', (session as any).user.email);

    // Remove the combo from the user document
    const updatedUser = await User.findOneAndUpdate(
      { email: (session as any).user.email },
      { $pull: { combos: { case_id: caseId } } },
      { new: true }
    );

    console.log('Combo delete API - result:', updatedUser);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (err: any) {
    console.error("Error deleting combo:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
