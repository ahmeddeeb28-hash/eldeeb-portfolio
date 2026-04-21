import { Lightbulb, Layers, Boxes, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function DesignServices() {
  const services = [
    {
      icon: Lightbulb,
      title: 'Product UX & Strategy',
      description: 'Clarifying problems, mapping journeys, and aligning teams on what we should build—and why.'
    },
    {
      icon: Layers,
      title: 'End-to-End Product Design',
      description: 'From wireframes to high-fidelity UI and prototypes, I design web and mobile products ready for development.'
    },
    {
      icon: Boxes,
      title: 'Design Systems & Components',
      description: 'Scalable systems, tokens, and reusable components that keep teams fast, consistent, and aligned.'
    },
    {
      icon: TrendingUp,
      title: 'UX Optimization & Growth',
      description: 'Improving flows, fixing friction, and testing ideas that increase activation, retention, and conversion.'
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section 
      id="design-services"
      className="relative px-6"
      style={{
        background: '#0A0A0A',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          {/* Pill/Eyebrow */}
          <div className="mb-6 flex justify-center">
            <div 
              className="inline-flex items-center rounded-full px-4 py-2"
              style={{
                background: 'rgba(91, 212, 240, 0.08)',
                border: '1px solid rgba(91, 212, 240, 0.2)',
                color: '#5BD4F0',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              DESIGN SERVICES
            </div>
          </div>

          {/* Heading */}
          <h2 
            className="mb-6"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: '#F5F7FF',
              lineHeight: '1.2'
            }}
          >
            Design services that move products forward
          </h2>

          {/* Subheading */}
          <p 
            className="mx-auto max-w-2xl"
            style={{
              fontSize: '18px',
              color: '#A7B0C3',
              lineHeight: '1.6'
            }}
          >
            From first idea to shipped product, I help teams design interfaces that are clear, scalable, and measurable.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group relative overflow-hidden rounded-3xl p-8"
                style={{
                  background: 'linear-gradient(135deg, #070C15 0%, #050A12 100%)',
                  border: '1px solid #1B2433',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                {/* Icon */}
                <div 
                  className="mb-6 inline-flex items-center justify-center rounded-2xl"
                  style={{
                    width: '56px',
                    height: '56px',
                    background: 'rgba(91, 212, 240, 0.08)',
                    border: '1px solid rgba(91, 212, 240, 0.15)'
                  }}
                >
                  <IconComponent 
                    className="h-6 w-6"
                    style={{ 
                      color: '#5BD4F0',
                      strokeWidth: 1.5
                    }}
                  />
                </div>

                {/* Title */}
                <h3 
                  className="mb-3"
                  style={{
                    fontSize: '20px',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    fontWeight: '600',
                    color: '#F5F7FF',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p 
                  style={{
                    fontSize: '15px',
                    color: '#A7B0C3',
                    lineHeight: '1.65'
                  }}
                >
                  {service.description}
                </p>

                {/* Hover glow effect */}
                <div 
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(91, 212, 240, 0.15), transparent 70%)',
                    mixBlendMode: 'soft-light'
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}