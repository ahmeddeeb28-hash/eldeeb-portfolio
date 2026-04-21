import { ArrowRight, ClipboardCheck, Briefcase, MessageSquare, Layers, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export function Mentorship() {
  const benefits = [
    {
      icon: ClipboardCheck,
      title: 'Portfolio Reviews',
      description: 'Get expert feedback on your design work and case studies to stand out.'
    },
    {
      icon: Briefcase,
      title: 'Career Mentorship',
      description: 'Navigate career transitions, promotions, and finding the right opportunities.'
    },
    {
      icon: MessageSquare,
      title: 'Interview Preparation',
      description: 'Practice design challenges and behavioral interviews with real-world scenarios.'
    },
    {
      icon: Layers,
      title: 'Design Systems Guidance',
      description: 'Learn how to build scalable design systems and component libraries.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section className="px-6 py-24" id="mentorship">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 
            className="mb-6 uppercase"
            style={{ 
              fontSize: 'clamp(48px, 6vw, 72px)',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '900',
              lineHeight: '0.9',
              letterSpacing: '-0.05em',
              color: 'rgba(255, 255, 255, 0.98)'
            }}
          >
            ADPList<br />Mentorship
          </h2>
          <p 
            className="mx-auto max-w-3xl"
            style={{ 
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.55)'
            }}
          >
            Join hundreds of designers I've mentored through ADPList—portfolio reviews, career guidance, 
            and real-world product strategy insights.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[24px] p-12 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Reflection Layer */}
          <div 
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
              opacity: 0.6
            }}
          />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Column - Benefits */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative space-y-8"
            >
              {/* Ambient Gradient Behind Left List */}
              <div 
                className="absolute -left-20 -top-20 w-96 h-96 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(77, 124, 255, 0.12) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                  zIndex: 0
                }}
              />
              
              {benefits.map((benefit, index) => {
                const iconColors = [
                  { from: '#00F0FF', to: '#87FFF3' }, // Teal → Aqua
                  { from: '#A66CFF', to: '#FF76D6' }, // Purple → Magenta
                  { from: '#4D7CFF', to: '#74FFF8' }, // Blue → Cyan
                  { from: '#87FFF3', to: '#A66CFF' }  // Aqua → Purple
                ];
                const colorPair = iconColors[index % iconColors.length];
                
                return (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="relative group flex gap-4 transition-all duration-300 z-10"
                  >
                    {/* Icon */}
                    <div 
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${colorPair.from}15, ${colorPair.to}10)`,
                        border: `1px solid ${colorPair.from}30`,
                        boxShadow: `0 0 0 0 ${colorPair.from}00`,
                      }}
                    >
                      <benefit.icon 
                        className="h-6 w-6" 
                        style={{ 
                          color: colorPair.to,
                          filter: 'brightness(1.2)',
                          strokeWidth: 2.5
                        }} 
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 
                        className="mb-2 font-semibold"
                        style={{ 
                          fontSize: '18px',
                          color: 'rgba(255, 255, 255, 0.95)'
                        }}
                      >
                        {benefit.title}
                      </h3>
                      <p 
                        style={{ 
                          fontSize: '15px',
                          lineHeight: '1.6',
                          color: 'rgba(255, 255, 255, 0.55)'
                        }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* CTA Button */}
              <motion.div 
                variants={itemVariants}
                className="relative pt-4 z-10"
              >
                <motion.a 
                  href="https://adplist.org/mentors/ahmad-el-deeb?session=design-mentorship-portfolio-guidance-12b8-mh7tmqtm"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex overflow-hidden rounded-full bg-white px-8 py-4 text-black shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),0_0_60px_rgba(92,255,224,0.20)]"
                >
                  <span className="flex items-center gap-2.5 font-bold tracking-tight">
                    Book a Session on ADPList
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right Column - Calendar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              {/* Ambient Gradient Behind Calendar Card */}
              <div 
                className="absolute -right-20 top-1/4 w-[500px] h-[500px] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(166, 108, 255, 0.14) 0%, rgba(255, 118, 214, 0.08) 50%, transparent 70%)',
                  filter: 'blur(80px)',
                  zIndex: 0
                }}
              />
              
              <div 
                className="relative rounded-[24px] p-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'inset 0 2px 20px rgba(0, 0, 0, 0.2)',
                  zIndex: 10
                }}
              >
                {/* Header with Icon and Title */}
                <div className="mb-6 flex items-center gap-3">
                  <div 
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(135, 255, 243, 0.1))',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)'
                    }}
                  >
                    <Calendar 
                      className="h-6 w-6" 
                      style={{ 
                        color: '#87FFF3',
                        filter: 'brightness(1.2)',
                        strokeWidth: 2.5
                      }} 
                    />
                  </div>
                  <h4 
                    className="font-semibold"
                    style={{ 
                      fontSize: '20px',
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}
                  >
                    ADPList Calendar
                  </h4>
                </div>

                {/* Description */}
                <p 
                  className="mb-8"
                  style={{ 
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.55)',
                    lineHeight: '1.6'
                  }}
                >
                  Browse live availability and book a 1-on-1 mentorship session directly through ADPList.
                </p>

                {/* ADPList Embedded Calendar */}
                <div 
                  className="bg-black/20"
                  style={{
                    height: '496px',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 8px 32px 0px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: '650px'
                  }}
                >
                  <iframe 
                    src="https://adplist.org/widgets/booking?src=ahmad-el-deeb" 
                    title="ADPList Booking Calendar"
                    width="100%" 
                    height="100%" 
                    loading="lazy" 
                    style={{ border: 0 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}