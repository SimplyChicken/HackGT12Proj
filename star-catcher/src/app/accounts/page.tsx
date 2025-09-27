"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <div style={{ backgroundColor: "lightblue", height: "100vh", color : "black" }}>
      {session ? (
        <>
          <span>{session.user?.email}</span>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <button onClick={() => signIn('github')}>Login with GitHub</button>
      )}
    </div>
  );
}
