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
    primary?: {
        name: string;
        googleFontUrl: string;
        weight: string;
        style: string;
        usage: string;
    };
    secondary?: {
        name: string;
        googleFontUrl: string;
        weight: string;
        style: string;
        usage: string;
    };
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

    const [activeTab, setActiveTab] = useState<
        "colors" | "fonts" | "combos" | "components" | "preferences"
    >("colors");

    const [colorPairs, setColorPairs] = useState<ColorPair[]>([]);
    const [fontPairs, setFontPairs] = useState<FontPair[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [savedComponents, setSavedComponents] = useState<any[]>([]);
    const [userPreferences, setUserPreferences] =
        useState<UserPreferences | null>(null);

    useEffect(() => {
        if (!session?.user?.email) return;

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
                const prefsRes = await fetch("/api/preferences", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "get",
                        data: {},
                    }),
                });

                if (prefsRes.ok) {
                    const prefsData = await prefsRes.json();
                    if (prefsData.success && prefsData.result?.preferences) {
                        setUserPreferences(prefsData.result.preferences);
                    }
                }

                // Fetch saved components (use the actual components endpoint)
                const componentsRes = await fetch("/api/components", {
                    credentials: "same-origin",
                });
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

    async function handleDelete(
        type: "color" | "font" | "combo",
        caseId: string
    ) {
        if (!session?.user?.email) return;

        try {
            if (type === "color") {
                const res = await fetch(`/api/save/colors?case_id=${caseId}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    setColorPairs((prev) => prev.filter((pair) => pair.case_id !== caseId));
                } else {
                    console.error("Failed to delete color pair");
                }
            } else if (type === "font") {
                const res = await fetch(`/api/save/fonts?case_id=${caseId}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    setFontPairs((prev) => prev.filter((pair) => pair.case_id !== caseId));
                } else {
                    console.error("Failed to delete font pair");
                }
            } else if (type === "combo") {
                const res = await fetch(`/api/save/combos?case_id=${caseId}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    setCombos((prev) => prev.filter((combo) => combo.case_id !== caseId));
                } else {
                    console.error("Failed to delete combo");
                }
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <Header />

            {/* Signed-out view */}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@domain.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        required
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
                                        Password
                                    </label>
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

                    <div className="text-3xl font-medium text-ink font-poly">
                        Welcome Back Your Inspiration
                    </div>

                    <div className="mt-6">
                        {/* Tab buttons */}
                        <div className="flex gap-4 mb-4">
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

                            <button
                                onClick={() => setActiveTab("components")}
                                className={`px-4 py-2 rounded-md font-outfit font-medium transition-colors ${
                                    activeTab === "components"
                                        ? "bg-space-cadet text-white"
                                        : "bg-white text-slate-gray hover:bg-slate-gray/10 border border-slate-gray/20"
                                }`}
                            >
                                Components
                            </button>

                            <button
                                onClick={() => setActiveTab("preferences")}
                                className={`px-4 py-2 rounded-md font-outfit font-medium transition-colors ${
                                    activeTab === "preferences"
                                        ? "bg-space-cadet text-white"
                                        : "bg-white text-slate-gray hover:bg-slate-gray/10 border border-slate-gray/20"
                                }`}
                            >
                                Preferences
                            </button>
                        </div>

                        {/* Colors tab */}
                        {activeTab === "colors" && (
                            <>
                                <div className="text-gray-700">Your saved color palettes:</div>
                                {colorPairs.map((pair, i) => (
                                    <PairCard
                                        key={`${pair.case_id}-${i}`}
                                        colorPair={pair}
                                        showColors
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </>
                        )}

                        {/* Fonts tab */}
                        {activeTab === "fonts" && (
                            <>
                                <div className="text-gray-700">Your saved font pairs:</div>
                                {fontPairs.map((pair, i) => (
                                    <PairCard
                                        key={`${pair.case_id}-${i}`}
                                        fontPair={pair}
                                        showFonts
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </>
                        )}

                        {/* Combos tab */}
                        {activeTab === "combos" && (
                            <>
                                <div className="text-gray-700">Your saved combos:</div>
                                {combos.length > 0 ? (
                                    combos.map((combo) => (
                                        <PairCard
                                            key={`combo-${combo.case_id}`}
                                            colorPair={combo.colorPair}
                                            fontPair={combo.fontPair}
                                            showColors
                                            showFonts
                                            onDelete={handleDelete}
                                            isCombo={true}
                                        />
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-center py-8">
                                        No saved combos yet. Generate some colors and fonts together
                                        and click the like button to save them as combos!
                                    </div>
                                )}
                            </>
                        )}

                        {/* Components tab */}
                        {activeTab === "components" && (
                            <div className="space-y-6">
                                <div className="text-gray-700 mb-4">Your saved components:</div>

                                {savedComponents.length > 0 ? (
                                    <div className="space-y-4">
                                        {savedComponents.map((component, idx) => (
                                            <div
                                                key={`${component._id || idx}`}
                                                className="bg-white p-6 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 capitalize">
                                                            {component.type} Component
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {component.name}
                                                        </p>
                                                        {component.description && (
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {component.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                            {component.savedAt
                                ? new Date(
                                    component.savedAt
                                ).toLocaleDateString()
                                : "Recently saved"}
                          </span>
                                                </div>

                                                {/* User Inputs */}
                                                {component.userInputs &&
                                                    component.userInputs.length > 0 && (
                                                        <div className="mb-4">
                                                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                                User Inputs:
                                                            </h5>
                                                            <div className="space-y-1">
                                                                {component.userInputs.map(
                                                                    (input: string, inputIdx: number) => (
                                                                        <div
                                                                            key={inputIdx}
                                                                            className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded"
                                                                        >
                                                                            "{input}"
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Analyzed Preferences */}
                                                {component.analyzedPreferences && (
                                                    <div className="mb-4">
                                                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                            AI Analysis:
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                            {component.analyzedPreferences.themes &&
                                                                component.analyzedPreferences.themes.length >
                                                                0 && (
                                                                    <div>
                                    <span className="font-medium text-gray-600">
                                      Themes:
                                    </span>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {component.analyzedPreferences.themes.map(
                                                                                (theme: string, themeIdx: number) => (
                                                                                    <span
                                                                                        key={themeIdx}
                                                                                        className="px-2 py-1 bg-green-100 text-green-800 rounded"
                                                                                    >
                                            {theme}
                                          </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {component.analyzedPreferences.colors &&
                                                                component.analyzedPreferences.colors.length >
                                                                0 && (
                                                                    <div>
                                    <span className="font-medium text-gray-600">
                                      Colors:
                                    </span>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {component.analyzedPreferences.colors.map(
                                                                                (color: string, colorIdx: number) => (
                                                                                    <span
                                                                                        key={colorIdx}
                                                                                        className="px-2 py-1 bg-purple-100 text-purple-800 rounded"
                                                                                    >
                                            {color}
                                          </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {component.analyzedPreferences.styles &&
                                                                component.analyzedPreferences.styles.length >
                                                                0 && (
                                                                    <div>
                                    <span className="font-medium text-gray-600">
                                      Styles:
                                    </span>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {component.analyzedPreferences.styles.map(
                                                                                (style: string, styleIdx: number) => (
                                                                                    <span
                                                                                        key={styleIdx}
                                                                                        className="px-2 py-1 bg-orange-100 text-orange-800 rounded"
                                                                                    >
                                            {style}
                                          </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {component.analyzedPreferences.keywords &&
                                                                component.analyzedPreferences.keywords.length >
                                                                0 && (
                                                                    <div>
                                    <span className="font-medium text-gray-600">
                                      Keywords:
                                    </span>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {component.analyzedPreferences.keywords.map(
                                                                                (
                                                                                    keyword: string,
                                                                                    keywordIdx: number
                                                                                ) => (
                                                                                    <span
                                                                                        key={keywordIdx}
                                                                                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded"
                                                                                    >
                                            {keyword}
                                          </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Component Code Preview */}
                                                <details className="mt-4">
                                                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                                                        View Code
                                                    </summary>
                                                    <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto">
                            <code>{component.code}</code>
                          </pre>
                                                </details>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-8">
                                        <p>No components saved yet.</p>
                                        <p className="text-sm mt-2">
                                            Start customizing components to see them here!
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Preferences tab */}
                        {activeTab === "preferences" && (
                            <div className="space-y-6">
                                <div className="text-gray-700 mb-4">
                                    Your AI-learned design preferences:
                                </div>

                                {userPreferences ? (
                                    <div className="space-y-4">
                                        {/* AI-Extracted Themes */}
                                        {userPreferences.extractedThemes &&
                                            userPreferences.extractedThemes.length > 0 && (
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        AI-Extracted Themes
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {userPreferences.extractedThemes.map(
                                                            (theme, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md"
                                                                >
                                  {theme}
                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* AI-Extracted Colors */}
                                        {userPreferences.extractedColors &&
                                            userPreferences.extractedColors.length > 0 && (
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        AI-Extracted Colors
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {userPreferences.extractedColors.map(
                                                            (color, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-md"
                                                                >
                                  {color}
                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* AI-Extracted Styles */}
                                        {userPreferences.extractedStyles &&
                                            userPreferences.extractedStyles.length > 0 && (
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        AI-Extracted Styles
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {userPreferences.extractedStyles.map(
                                                            (style, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-md"
                                                                >
                                  {style}
                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* AI-Extracted Patterns */}
                                        {userPreferences.extractedPatterns &&
                                            userPreferences.extractedPatterns.length > 0 && (
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        AI-Extracted Patterns
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {userPreferences.extractedPatterns.map(
                                                            (pattern, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                                                                >
                                  {pattern}
                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* AI-Extracted Keywords */}
                                        {userPreferences.extractedKeywords &&
                                            userPreferences.extractedKeywords.length > 0 && (
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        AI-Extracted Keywords
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {userPreferences.extractedKeywords.map(
                                                            (keyword, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-md"
                                                                >
                                  {keyword}
                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Style Keywords with Source */}
                                        {userPreferences.styleKeywords &&
                                            userPreferences.styleKeywords.length > 0 && (
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        Processed Style Keywords
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {userPreferences.styleKeywords.map(
                                                            (keyword, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`px-2 py-1 text-sm rounded-md ${
                                                                        keyword.source === "ai-analysis"
                                                                            ? "bg-indigo-100 text-indigo-800"
                                                                            : "bg-blue-100 text-blue-800"
                                                                    }`}
                                                                >
                                  {keyword.keyword} ({keyword.category})
                                  <span className="text-xs opacity-75 ml-1">
                                    {keyword.source === "ai-analysis"
                                        ? "🤖"
                                        : "👤"}
                                  </span>
                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Component Preferences */}
                                        {userPreferences.componentPreferences &&
                                            Object.keys(userPreferences.componentPreferences).length >
                                            0 && (
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        Component Preferences
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {Object.entries(
                                                            userPreferences.componentPreferences
                                                        ).map(([component, prefs]) => (
                                                            <div key={component} className="text-sm">
                                <span className="font-medium capitalize">
                                  {component}:
                                </span>
                                                                <span className="ml-2 text-gray-600">
                                  {JSON.stringify(prefs)}
                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Analysis Metadata */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                                Analysis Statistics
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                          <span className="font-medium text-gray-600">
                            Analysis Count:
                          </span>
                                                    <span className="ml-2 text-gray-800">
                            {userPreferences.analysisCount || 0}
                          </span>
                                                </div>
                                                {userPreferences.lastAnalysis && (
                                                    <div>
                            <span className="font-medium text-gray-600">
                              Last Analysis:
                            </span>
                                                        <span className="ml-2 text-gray-800">
                              {new Date(
                                  userPreferences.lastAnalysis
                              ).toLocaleDateString()}
                            </span>
                                                    </div>
                                                )}
                                                {userPreferences.lastUpdated && (
                                                    <div>
                            <span className="font-medium text-gray-600">
                              Last Updated:
                            </span>
                                                        <span className="ml-2 text-gray-800">
                              {new Date(
                                  userPreferences.lastUpdated
                              ).toLocaleDateString()}
                            </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-8">
                                        <p>No preferences learned yet.</p>
                                        <p className="text-sm mt-2">
                                            Start using the design generator to build your
                                            preferences!
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
