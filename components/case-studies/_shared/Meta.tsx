/* ── Meta ─────────────────────────────────────────────
   Two-line label/value pair used in the case-study meta
   strip (Role, Duration, Company, etc.). */
export function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-white/40 text-xs">{label}</span>
      <span className="text-white font-medium text-sm">{value}</span>
    </div>
  );
}
