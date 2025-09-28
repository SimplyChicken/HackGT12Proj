import { NextResponse } from 'next/server';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Extract font data properly
    const { primary, secondary } = body;
    
    // Validate required fields
    if (!primary || !secondary) {
      return NextResponse.json(
        { success: false, error: "Missing required font data" },
        { status: 400 }
      );
    }

    // Add case_id to the font pairing data
    const fontData = {
      case_id: Date.now().toString(),
      primary,
      secondary
    };

    console.log('Font save API - fontData to save:', fontData);

    await User.findOneAndUpdate(
      { email: (session as any).user.email },
      { $push: { fontPairs: fontData } }
    );

    console.log('Font save API - saved successfully');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
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

    console.log('Font delete API - deleting case_id:', caseId, 'for user:', (session as any).user.email);

    const result = await User.findOneAndUpdate(
      { email: (session as any).user.email },
      { $pull: { fontPairs: { case_id: caseId } } },
      { new: true }
    );

    console.log('Font delete API - result:', result);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Font delete error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
