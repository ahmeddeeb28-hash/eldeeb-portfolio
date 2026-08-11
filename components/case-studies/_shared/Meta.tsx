/* ── Meta ─────────────────────────────────────────────
   Two-line label/value pair used in the case-study meta
   strip (Role, Duration, Company, etc.). */
export function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.25em]">{label}</span>
      <span className="text-white font-bold text-sm tracking-tight">{value}</span>
    </div>
  );
}
