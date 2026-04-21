import { useState, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GALLERY_ASSETS } from './GalleryAssets';

interface Hero3DCarouselFullViewProps {
  images?: string[];
}

export function Hero3DCarouselFullView({
  images: initialImages = GALLERY_ASSETS,
}: Hero3DCarouselFullViewProps) {
  const [carouselImages, setCarouselImages] = useState(initialImages.length > 0 ? initialImages : GALLERY_ASSETS);
  const [isBuilderMode, setIsBuilderMode] = useState(true);
  
  const handleReplaceImage = (index: number, newSrc: string) => {
    const newImages = [...carouselImages];
    newImages[index] = newSrc;
    setCarouselImages(newImages);
  };

  return null;
}

/* --- Sub-Components --- */

function BuilderToolbar({ carouselImages, onReplace, onPublish }: { 
  carouselImages: string[], 
  onReplace: (idx: number, src: string) => void, 
  onPublish: () => void 
}) {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-[60] flex items-center p-1.5 rounded-2xl bg-[#1E1E1E]/95 backdrop-blur-2xl border border-white/10 shadow-2xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 pointer-events-auto">
      <div className="flex items-center gap-2 pr-3 border-r border-white/5 mx-2">
        <div className="w-8 h-8 rounded-lg bg-[#5551FF] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Gallery</span>
          <span className="text-[8px] font-bold text-[#4AF2E5] uppercase tracking-widest">Editor</span>
        </div>
      </div>

      <div className="relative group/picker">
        <button className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-all text-[11px] font-bold flex items-center gap-2.5">
          Quick Asset Select
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-40"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        <div className="absolute top-full left-0 mt-4 w-[420px] opacity-0 group-hover/picker:opacity-100 pointer-events-none group-hover/picker:pointer-events-auto transition-all duration-300 z-[70]">
          <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#4AF2E5]">System Library</span>
              <label className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#3B36FF] hover:bg-[#4B46FF] text-white text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all shadow-xl active:scale-95">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                  Array.from(e.target.files || []).forEach((file, i) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => ev.target?.result && onReplace(i % carouselImages.length, ev.target.result as string);
                    reader.readAsDataURL(file);
                  });
                }} />
              </label>
            </div>
            <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {GALLERY_ASSETS.map((asset, i) => (
                <button key={i} onClick={() => onReplace(0, asset)} className="aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-[#4AF2E5]/60 transition-all group/asset relative bg-black/20">
                  <ImageWithFallback src={asset} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-px h-4 bg-white/5 mx-2" />

      <button onClick={onPublish} className="h-9 px-4 rounded-xl text-white/40 hover:text-[#FF4A4A] hover:bg-[#FF4A4A]/5 flex items-center gap-2 transition-all text-[10px] font-black uppercase tracking-widest">
        Publish Site
      </button>
    </div>
  );
}

function GalleryCard({ src, index, onReplace }: { src: string, index: number, onReplace: (newSrc: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => e.target?.result && onReplace(e.target.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="relative aspect-[4/5] rounded-[32px] overflow-hidden cursor-pointer border border-white/5 bg-[#0E0E0E]"
      style={{ boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)' }}
    >
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0]!)} />
      <ImageWithFallback src={src} className="w-full h-full object-cover" />
      
      {/* Editorial Overlay */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-[#4AF2E5]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Project {index + 1}</span>
        </div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none rounded-[32px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" />
    </div>
  );
}