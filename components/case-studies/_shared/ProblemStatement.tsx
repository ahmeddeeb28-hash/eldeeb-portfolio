/* ── Problem Statement Frame ─────────────────────────
   Hands the reader a precise, framed problem — not a paragraph.
   Quote · Stakes · Affected baseline metrics. */
export function ProblemStatement({
  problem,
  context,
  baselines,
}: {
  problem: string;
  context: string;
  baselines?: { label: string; before: string; after: string }[];
}) {
  // Headline = first declarative sentence. Body = the rest.
  const sentences = problem.split('. ').filter(Boolean);
  const headline = sentences[0]?.replace(/\.$/, '') + '.';
  const rest = sentences.slice(1).join('. ').trim();
  const stakes = context?.split('.')[0]?.trim();

  return (
    <div className="relative rounded-[36px] border border-[#FF5F5F]/15 bg-gradient-to-b from-[#FF5F5F]/[0.04] to-transparent p-8 md:p-14 overflow-hidden">
      {/* Corner mark */}
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F5F] animate-pulse" />
        <span className="text-[#FF5F5F]/70 text-[9px] font-black uppercase tracking-[0.4em]">
          Problem Statement
        </span>
      </div>

      {/* Quote glyph */}
      <span
        className="absolute top-6 left-8 text-[120px] leading-none text-[#FF5F5F]/15 select-none pointer-events-none"
        style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        aria-hidden
      >
        “
      </span>

      <div className="relative pt-16 md:pt-20 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Headline + body */}
        <div className="md:col-span-8">
          <p
            className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight mb-6 max-w-2xl"
          >
            {headline}
          </p>
          {rest && (
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl">
              {rest}
            </p>
          )}

          {/* Stakes line */}
          {stakes && (
            <div className="mt-10 flex items-start gap-4 pt-8 border-t border-white/5">
              <span className="shrink-0 inline-block px-2.5 py-1 rounded-md bg-[#FF5F5F]/10 border border-[#FF5F5F]/20 text-[#FF5F5F] text-[9px] font-black uppercase tracking-[0.3em]">
                Stakes
              </span>
              <p className="text-white/60 text-sm leading-relaxed">{stakes}.</p>
            </div>
          )}
        </div>

        {/* Affected baselines */}
        {baselines && baselines.length > 0 && (
          <div className="md:col-span-4 md:border-l md:border-white/5 md:pl-10 flex flex-col gap-5">
            <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
              Affected metrics (baseline)
            </span>
            <div className="flex flex-col gap-4">
              {baselines.map((b, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                    {b.label}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-2xl font-black tracking-tight">
                      {b.before}
                    </span>
                    <span className="text-[#FF5F5F]/70 text-[9px] font-black uppercase tracking-widest">
                      Below target
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
