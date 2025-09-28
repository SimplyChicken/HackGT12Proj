"use client";

import Header from "@/components/ui/Header";
import { useSession, signIn, signOut } from "next-auth/react";
import PairCard from "./PairCard";
import { useEffect, useState } from "react";
import { UserPreferences } from "@/lib/schemas";

// Support both old and new data formats
interface ColorPair {
  case_id: string;
  // New format
  primary?: { name: string; value: string; contrast: string };
  secondary?: { name: string; value: string; contrast: string };
  accent?: { name: string; value: string; contrast: string };
  // Old format (for backward compatibility)
  color?: string;
  color2?: string;
}
interface FontPair {
  case_id: string;
  // New format
  primary?: { name: string; googleFontUrl: string; weight: string; style: string; usage: string };
  secondary?: { name: string; googleFontUrl: string; weight: string; style: string; usage: string };
  // Old format (for backward compatibility)
  font?: string;
  font2?: string;
}

interface Combo {
  case_id: string;
  colorPair: ColorPair;
  fontPair: FontPair;
  savedAt: string;
}


export default function AccountsPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"colors" | "fonts" | "combos" | "components" | "preferences">("colors");
  const [colorPairs, setColorPairs] = useState<ColorPair[]>([]);
  const [fontPairs, setFontPairs] = useState<FontPair[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [savedComponents, setSavedComponents] = useState<any[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    if (!session) return;

    async function fetchUser() {
      try {
        // Fetch pairs
        const pairsRes = await fetch(`/api/pairs`, { credentials: "same-origin" });
        if (pairsRes.ok) {
          const pairsData = await pairsRes.json();
          const colorPairs: ColorPair[] = pairsData.colorPairs || [];
          const fontPairs: FontPair[] = pairsData.fontPairs || [];
          const combos: Combo[] = pairsData.combos || [];
          setColorPairs(colorPairs);
          setFontPairs(fontPairs);
          setCombos(combos);
        }

        // Fetch preferences
        const prefsRes = await fetch('/api/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get',
            data: {}
          }),
        });

        if (prefsRes.ok) {
          const prefsData = await prefsRes.json();
          if (prefsData.success && prefsData.result.preferences) {
            setUserPreferences(prefsData.result.preferences);
          }
        }

        // Fetch saved components
        const componentsRes = await fetch('/api/pairs', { credentials: "same-origin" });
        if (componentsRes.ok) {
          const componentsData = await componentsRes.json();
          const components: any[] = componentsData.components || [];
          setSavedComponents(components);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
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

  async function handleDelete(type: 'color' | 'font' | 'combo', caseId: string) {
    if (!session?.user?.email) return;

    try {
      if (type === 'color') {
        const res = await fetch(`/api/save/colors?case_id=${caseId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setColorPairs(prev => prev.filter(pair => pair.case_id !== caseId));
        } else {
          console.error('Failed to delete color pair');
        }
      } else if (type === 'font') {
        const res = await fetch(`/api/save/fonts?case_id=${caseId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setFontPairs(prev => prev.filter(pair => pair.case_id !== caseId));
        } else {
          console.error('Failed to delete font pair');
        }
      } else if (type === 'combo') {
        const res = await fetch(`/api/save/combos?case_id=${caseId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setCombos(prev => prev.filter(combo => combo.case_id !== caseId));
        } else {
          console.error('Failed to delete combo');
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  }

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <Header />

            {!session ? (
                // Signed-out view
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
                                    type="button"
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
                // Signed-in view
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <span className="text-sm text-gray-500 block">Signed in as</span>
                            <div className="text-lg font-medium text-gray-900">
                                {session.user?.name ?? session.user?.email}
                            </div>
                        </div>

                        {/* cohesive sign-out block */}
                        <div className="flex flex-col items-end space-y-1">
            <span className="text-xs text-ink/70 font-outfit">
              Signed in as {session.user?.email}. Sign out?
            </span>
                            <button
                                type="button"
                                onClick={() => signOut()}
                                className="inline-flex items-center px-4 py-2 rounded-lg
                         bg-accent text-sm font-outfit text-white
                         transition-colors shadow-sm"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>

                    <div className="text-3xl font-medium text-ink font-poly mb-4">
                        Welcome Back Your Inspiration
                    </div>

                    {/* Tabs */}
                    <div className="mt-6">
                        <div className="flex gap-4 mb-4">
                            {/* ... your tab buttons unchanged ... */}
                        </div>

                        {/* ... your tab panels (colors/fonts/combos/components/preferences) unchanged ... */}
                    </div>
                </div>
            )}
        </div>
    );
}
