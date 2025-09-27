import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectDB();
  const body = await req.json();
  await User.updateOne(
    { email: session.user?.email },
    { $set: { someData: body.someData } }
  );

  return new Response("Saved");
}