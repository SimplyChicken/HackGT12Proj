// Support both old and new data formats
type ColorPair = { 
  case_id: string; 
  // New format
  primary?: { name: string; value: string; contrast: string };
  secondary?: { name: string; value: string; contrast: string };
  accent?: { name: string; value: string; contrast: string };
  // Old format (for backward compatibility)
  color?: string;
  color2?: string;
};
type FontPair = { 
  case_id: string; 
  // New format
  primary?: { name: string; googleFontUrl: string; weight: string; style: string; usage: string };
  secondary?: { name: string; googleFontUrl: string; weight: string; style: string; usage: string };
  // Old format (for backward compatibility)
  font?: string;
  font2?: string;
};

interface PairCardProps {
  colorPair?: ColorPair;
  fontPair?: FontPair;
  showColors?: boolean; // when true, only colors render
  showFonts?: boolean;  // when true, only fonts render
  onDelete?: (type: 'color' | 'font' | 'combo', caseId: string) => void;
  isCombo?: boolean; // when true, this is a combo and should delete as combo
}

export default function PairCard({
  colorPair,
  fontPair,
  showColors = false,
  showFonts = false,
  onDelete,
  isCombo = false,
}: PairCardProps) {
  // If nothing valid is passed, render nothing
  if (showColors && !colorPair) return null;
  if (showFonts && !fontPair) return null;
  if (!showColors && !showFonts) return null;

  // Debug logging
  if (showFonts && fontPair) {
    console.log('PairCard received fontPair:', fontPair);
  }
  if (showColors && colorPair) {
    console.log('PairCard received colorPair:', colorPair);
  }

  // Fallback helpers - handle both old and new formats
  const c1 = colorPair?.primary?.value ?? colorPair?.color ?? "#ffffff";
  const c2 = colorPair?.secondary?.value ?? colorPair?.color2 ?? "#000000";
  const c3 = colorPair?.accent?.value ?? "#ff0000";
  const f1 = fontPair?.primary?.name ?? fontPair?.font ?? "Arial";
  const f2 = fontPair?.secondary?.name ?? fontPair?.font2 ?? "sans-serif";

  return (
    <div className="border border-slate-gray/20 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Render ONLY Color Pair */}
      {showColors && colorPair && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-space-cadet font-poly">
              {colorPair.primary ? 'Color Palette' : 'Color Pair'} ({colorPair.case_id})
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ background: c1 }} title={colorPair.primary?.name || 'Color 1'} />
                <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ background: c2 }} title={colorPair.secondary?.name || 'Color 2'} />
                {colorPair.accent && (
                  <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ background: c3 }} title={colorPair.accent.name} />
                )}
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(isCombo ? 'combo' : 'color', colorPair.case_id)}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  title={isCombo ? "Delete combo" : "Delete color palette"}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-gray font-outfit">
                Primary:
              </span>
              <span className="font-mono text-space-cadet">{c1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-gray font-outfit">
                Secondary:
              </span>
              <span className="font-mono text-space-cadet">{c2}</span>
            </div>
            {colorPair.accent && (
              <div className="flex justify-between">
                <span className="text-slate-gray font-outfit">Accent:</span>
                <span className="font-mono text-space-cadet">{c3}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Render ONLY Font Pair */}
      {showFonts && fontPair && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-space-cadet font-poly">Font Pair ({fontPair.case_id})</h2>
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-gray font-outfit">{f1} · {f2}</div>
              {onDelete && (
                <button
                  onClick={() => onDelete(isCombo ? 'combo' : 'font', fontPair.case_id)}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  title={isCombo ? "Delete combo" : "Delete font pair"}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-gray font-outfit">
                Primary:
              </span>
              <span className="font-mono text-space-cadet">
                {f1} {fontPair.primary?.weight && `(${fontPair.primary.weight})`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-gray font-outfit">
                Secondary:
              </span>
              <span className="font-mono text-space-cadet">
                {f2} {fontPair.secondary?.weight && `(${fontPair.secondary.weight})`}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-sm text-space-cadet" style={{ fontFamily: f1, fontWeight: fontPair.primary?.weight || 'normal' }}>
                Sample: The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-sm text-slate-gray" style={{ fontFamily: f2, fontWeight: fontPair.secondary?.weight || 'normal' }}>
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
            <div className="flex gap-1">
              <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ backgroundColor: c1 }} title={colorPair.primary?.name || 'Color 1'} />
              <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ backgroundColor: c2 }} title={colorPair.secondary?.name || 'Color 2'} />
              {colorPair.accent && (
                <div className="w-8 h-8 rounded-sm border border-slate-gray/30" style={{ backgroundColor: c3 }} title={colorPair.accent.name} />
              )}
            </div>
            <div className="text-sm text-slate-gray font-outfit">{f1} / {f2}</div>
          </div>
        </div>
      )}
    </div>
  );
}
