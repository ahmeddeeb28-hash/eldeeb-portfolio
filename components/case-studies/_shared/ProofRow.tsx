import { motion } from 'motion/react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

/* ── Stacked Proof Row (alternating caption/screen) ──
   Even rows have caption left / screen right; odd rows flip via RTL
   trick so the caption stays read-order natural while the screen
   swaps sides. Click-to-zoom is wired through `onZoom`. */
export function ProofRow({
  index,
  total,
  src,
  caption,
  note,
  onZoom,
}: {
  index: number;
  total: number;
  src: string;
  caption: string;
  note: string;
  onZoom: () => void;
}) {
  const reversed = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${
        reversed ? 'md:[direction:rtl]' : ''
      }`}
    >
      {/* Caption column */}
      <div className="md:col-span-4 md:[direction:ltr]">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-[#4AF2E5] text-xs font-black tracking-[0.3em]">
            0{index + 1}
          </span>
          <span className="text-white/20 text-[10px] font-black tracking-[0.3em]">
            / {String(total).padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight mb-3">
          {caption}
        </h3>
        <p className="text-white/45 text-sm leading-relaxed">{note}</p>
      </div>

      {/* Image column */}
      <button
        onClick={onZoom}
        className="md:col-span-8 md:[direction:ltr] relative group w-full aspect-[16/10] overflow-hidden bg-[#0D0D0D] border border-white/5 rounded-[24px] cursor-zoom-in"
      >
        <ImageWithFallback
          src={src}
          alt={caption}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-1000"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[24px] pointer-events-none" />
      </button>
    </motion.div>
  );
}
