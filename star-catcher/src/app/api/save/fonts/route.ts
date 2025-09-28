import { NextResponse } from 'next/server';
import User from '@/models/User';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $push: { fontPairs: body } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
