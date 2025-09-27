"use client";

import Header from "@/components/ui/Header";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handles both login and registration depending on the `register` flag
  async function handleCredentialsSignIn(register = false) {
    const res = await signIn("credentials", {
      email,
      password,
      register,
      redirect: false,
    });
    console.log("signIn result:", res);
  }

  return (
    <div style={{ backgroundColor: "lightblue", height: "100vh", color: "black" }}>
      <Header />

      {session ? (
        <>
          <span>{session.user?.email}</span>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <>
          {/* GitHub login */}
          <button onClick={() => signIn("github")}>Login with GitHub</button>

          {/* Email/Password login or registration */}
          <div style={{ marginTop: "1rem" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button type="button" onClick={() => handleCredentialsSignIn(false)}>
                Login with Email
              </button>
              <button type="button" onClick={() => handleCredentialsSignIn(true)}>
                Create account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
