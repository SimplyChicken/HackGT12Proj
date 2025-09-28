type ColorPair = { case_id: string; color: string; color2: string };
type FontPair = { case_id: string; font: string; font2: string };

interface PairCardProps {
  colorPair?: ColorPair;
  fontPair?: FontPair;
  showColors?: boolean; // when true, only colors render
  showFonts?: boolean;  // when true, only fonts render
}

export default function PairCard({
  colorPair,
  fontPair,
  showColors = false,
  showFonts = false,
}: PairCardProps) {
  // If nothing valid is passed, render nothing
  if (showColors && !colorPair) return null;
  if (showFonts && !fontPair) return null;
  if (!showColors && !showFonts) return null;

  // Fallback helpers
  const c1 = colorPair?.color ?? "#ffffff";
  const c2 = colorPair?.color2 ?? "#000000";
  const f1 = fontPair?.font ?? "Arial";
  const f2 = fontPair?.font2 ?? "sans-serif";

  return (
    <div className="border border-slate-gray/20 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Render ONLY Color Pair */}
      {showColors && colorPair && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-space-cadet font-poly">Color Pair ({colorPair.case_id})</h2>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ background: c1 }} />
              <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ background: c2 }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-gray font-outfit">Color 1:</span>
              <span className="font-mono text-space-cadet">{c1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-gray font-outfit">Color 2:</span>
              <span className="font-mono text-space-cadet">{c2}</span>
            </div>
          </div>
        </>
      )}

      {/* Render ONLY Font Pair */}
      {showFonts && fontPair && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-space-cadet font-poly">Font Pair ({fontPair.case_id})</h2>
            <div className="text-sm text-slate-gray font-outfit">{f1} · {f2}</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-gray font-outfit">Font 1:</span>
              <span className="font-mono text-space-cadet">{f1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-gray font-outfit">Font 2:</span>
              <span className="font-mono text-space-cadet">{f2}</span>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-sm text-space-cadet" style={{ fontFamily: f1 }}>
                Sample: The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-sm text-slate-gray" style={{ fontFamily: f2 }}>
                Sample: The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Render both for combos */}
      {showColors && showFonts && colorPair && fontPair && (
        <div className="mt-3 border-t border-slate-gray/20 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ backgroundColor: c1 }} />
              <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ backgroundColor: c2 }} />
            </div>
            <div className="text-sm text-slate-gray font-outfit">{f1} / {f2}</div>
          </div>
        </div>
      )}
    </div>
  );
}
