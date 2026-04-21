import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative px-4 py-20 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-white/20"></div>
          <span className="text-sm uppercase tracking-wider text-white/60">Portfolio 2024</span>
          <div className="h-px w-8 bg-white/20"></div>
        </div>
        
        <h1 className="mb-6 text-5xl md:text-7xl">
          I help nypreneures land<br />
          <span className="text-white/90">high-value clients.</span>
        </h1>
        
        <p className="mb-10 text-lg text-white/60">
          Transform your business with proven strategies that deliver results.
        </p>
        
        <button className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-black transition-all hover:gap-4 hover:bg-white/90">
          <span>Get Started Today</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Decorative grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:32px_32px]"></div>
    </section>
  );
}
