"use client";

import Header from "@/components/ui/Header";
import { useSession, signIn, signOut } from "next-auth/react";
import PairCard from "./PairCard";
import { useEffect, useState } from "react";

interface ColorPair {
  case_id: string;
  color: string;
  color2: string;
}
interface FontPair {
  case_id: string;
  font: string;
  font2: string;
}


export default function AccountsPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"colors" | "fonts" | "combos">("colors");
  const [colorPairs, setColorPairs] = useState<ColorPair[]>([]);
  const [fontPairs, setFontPairs] = useState<FontPair[]>([]);

  useEffect(() => {
    if (!session) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/pairs`, { credentials: "same-origin" });
        if (!res.ok) {
          console.error("Failed to fetch pairs", await res.text());
          return;
        }

        const data = await res.json();

        // colorPairs and fontPairs are guaranteed to be objects now
        const colorPairs: ColorPair[] = data.colorPairs || [];
        const fontPairs: FontPair[] = data.fontPairs || [];

        // Optional: log to verify
        console.log("Fetched colorPairs:", colorPairs);
        console.log("Fetched fontPairs:", fontPairs);

        setColorPairs(colorPairs);
        setFontPairs(fontPairs);
      } catch (err) {
        console.error("Error fetching user pairs:", err);
      }
    }

    fetchUser();
  }, [session?.user?.email]);



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
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      {/* Signed-out view: centered tall rectangle */}
      {!session ? (
        <div className="flex items-center justify-center px-4 py-12">
          <div
            className="bg-white rounded-2xl shadow-lg border border-gray-200
                       w-80 h-[520px] flex flex-col justify-between p-6"
            role="region"
            aria-label="Sign in"
          >
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Sign In
              </h1>

              <div className="space-y-4">
                <button
                  onClick={() => signIn("github")}
                  className="w-full inline-flex items-center justify-center gap-2
                             bg-gray-900 text-white py-2 rounded-md hover:opacity-90 transition"
                >
                  Continue with GitHub
                </button>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleCredentialsSignIn(false)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                      Login with Email
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCredentialsSignIn(true)}
                      className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition"
                    >
                      Create account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By continuing you agree to our terms of service.
            </p>
          </div>
        </div>
      ) : (
        // Signed-in view: username top-left and tabs underneath
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm text-gray-500 block">Signed in as</span>
              <div className="text-lg font-medium text-gray-900">
                {session.user?.name ?? session.user?.email}
              </div>
            </div>

            <div>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-600 hover:underline"
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="mt-6">
            {/* Tab buttons */}
            <div className="flex gap-4 mb-4">
              <button onClick={() => setActiveTab("colors")}>Colors</button>
              <button onClick={() => setActiveTab("fonts")}>Fonts</button>
              <button onClick={() => setActiveTab("combos")}>Combos</button>
            </div>

            {/* Colors tab */}
            {activeTab === "colors" && (
              <>
                <div className="text-gray-700">Your saved color pairs:</div>
                {colorPairs.map((pair, i) => (
                  <PairCard key={`${pair.case_id}-${i}`} colorPair={pair} showColors />
                ))}
              </>
            )}

            {/* Fonts tab */}
            {activeTab === "fonts" && (
              <>
                <div className="text-gray-700">Your saved font pairs:</div>
                {fontPairs.map((pair, i) => (
                  <PairCard key={`${pair.case_id}-${i}`} fontPair={pair} showFonts />
                ))}
              </>
            )}

            {/* Combos tab */}
            {activeTab === "combos" && (
              <>
                <div className="text-gray-700">Your saved combos:</div>
                {colorPairs.map((c, idx) => (
                  <PairCard
                    key={`combo-${c.case_id}-${idx}`}
                    colorPair={c}
                    fontPair={fontPairs[idx]} // still naive combo
                    showColors
                    showFonts
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
