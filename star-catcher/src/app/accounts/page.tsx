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

    if (res?.error) {
      alert(`Sign in failed: ${res.error}. Please try again.`);
    } else {
      console.log("Sign in successful!", res);
    }
  }


  return (
    <div className="min-h-screen bg-eggshell text-space-cadet">
      <Header />
      {/* Signed-out view: centered tall rectangle */}
      {!session ? (
        <div className="flex items-center justify-center px-4 py-12">
          <div
            className="bg-white rounded-2xl shadow-lg border border-slate-gray/20
                       w-80 h-[520px] flex flex-col justify-between p-6"
            role="region"
            aria-label="Sign in"
          >
            <div>
              <h1 className="text-3xl font-bold text-space-cadet mb-4 text-center font-poly">
                Create Account
              </h1>

              <div className="space-y-4">
                <button
                  onClick={() => signIn("github")}
                  className="w-full inline-flex items-center justify-center gap-2
                             bg-space-cadet text-white py-3 rounded-md hover:bg-space-cadet/90 transition font-outfit font-medium"
                >
                  Continue with GitHub
                </button>

                <div className="border-t border-slate-gray/20 pt-4">
                  <label className="block text-sm font-medium text-space-cadet mb-1 font-outfit">Email</label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-gray/30 rounded-md focus:outline-none focus:ring-2 focus:ring-space-cadet/30 focus:border-space-cadet font-outfit"
                    required
                  />

                  <label className="block text-sm font-medium text-space-cadet mt-3 mb-1 font-outfit">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-gray/30 rounded-md focus:outline-none focus:ring-2 focus:ring-space-cadet/30 focus:border-space-cadet font-outfit"
                    required
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleCredentialsSignIn(false)}
                      className="flex-1 bg-slate-gray text-white py-2 rounded-md hover:bg-slate-gray/90 transition font-outfit font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCredentialsSignIn(true)}
                      className="flex-1 bg-space-cadet text-white py-2 rounded-md hover:bg-space-cadet/90 transition font-outfit font-medium"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-gray text-center font-outfit">
              By continuing you agree to our terms of service.
            </p>
          </div>
        </div>
      ) : (

          <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <div className="text-3xl font-medium text-ink font-poly">
                          Welcome Back Your Inspiration
                      </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                      {/* "signed in as" message */}
                      <span className="text-xs text-ink/70 font-outfit">
        Signed in as {session.user?.email}. Sign out?
      </span>

                      {/* themed button */}
                      <button
                          onClick={() => signOut()}
                          className="inline-flex items-center px-4 py-2 rounded-lg
                   bg-accent text-sm font-outfit text-white
                   transition-colors shadow-sm"
                      >
                          Sign out
                      </button>
                  </div>
              </div>


          <div className="mt-6">
            {/* Tab buttons */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setActiveTab("colors")}
                className={`px-4 py-2 rounded-md font-outfit font-medium transition-colors ${
                  activeTab === "colors" 
                    ? "bg-space-cadet text-white" 
                    : "bg-white text-slate-gray hover:bg-slate-gray/10 border border-slate-gray/20"
                }`}
              >
                Colors
              </button>
              <button 
                onClick={() => setActiveTab("fonts")}
                className={`px-4 py-2 rounded-md font-outfit font-medium transition-colors ${
                  activeTab === "fonts" 
                    ? "bg-space-cadet text-white" 
                    : "bg-white text-slate-gray hover:bg-slate-gray/10 border border-slate-gray/20"
                }`}
              >
                Fonts
              </button>
              <button 
                onClick={() => setActiveTab("combos")}
                className={`px-4 py-2 rounded-md font-outfit font-medium transition-colors ${
                  activeTab === "combos" 
                    ? "bg-space-cadet text-white" 
                    : "bg-white text-slate-gray hover:bg-slate-gray/10 border border-slate-gray/20"
                }`}
              >
                Combos
              </button>
            </div>

            {/* Colors tab */}
            {activeTab === "colors" && (
              <>
                <div className="text-slate-gray font-outfit mb-4">Your saved color pairs:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colorPairs.map((pair, i) => (
                    <PairCard key={`${pair.case_id}-${i}`} colorPair={pair} showColors />
                  ))}
                </div>
              </>
            )}

            {/* Fonts tab */}
            {activeTab === "fonts" && (
              <>
                <div className="text-slate-gray font-outfit mb-4">Your saved font pairs:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fontPairs.map((pair, i) => (
                    <PairCard key={`${pair.case_id}-${i}`} fontPair={pair} showFonts />
                  ))}
                </div>
              </>
            )}

            {/* Combos tab */}
            {activeTab === "combos" && (
              <>
                <div className="text-slate-gray font-outfit mb-4">Your saved combos:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colorPairs.map((c, idx) => (
                    <PairCard
                      key={`combo-${c.case_id}-${idx}`}
                      colorPair={c}
                      fontPair={fontPairs[idx]} // still naive combo
                      showColors
                      showFonts
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
