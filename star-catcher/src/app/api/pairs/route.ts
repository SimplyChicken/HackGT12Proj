// src/app/api/pairs/route.ts
export const runtime = 'nodejs'; // or remove; default is node

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";      // ✅ v4
import { authOptions } from "../auth/[...nextauth]/route"; // bring options
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);  // ✅ v4
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email })
            .lean<{ colorPairs?: any[]; fontPairs?: any[] }>();

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({
            colorPairs: user.colorPairs ?? [],
            fontPairs:  user.fontPairs  ?? [],
        });
    } catch (err) {
        console.error("API /api/pairs error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}