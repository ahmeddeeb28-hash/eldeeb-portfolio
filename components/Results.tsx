import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const results = [
  {
    value: "120%",
    metric: "Conversion Increase",
    description: "Average uplift in checkout performance for B2B marketplaces."
  },
  {
    value: "45%",
    metric: "Retention Growth",
    description: "Documented increase in quarterly user stickiness for SaaS platforms."
  },
  {
    value: "14 Days",
    metric: "Cycle Time Reduced",
    description: "Efficiency gain through standardized design-to-dev alignment."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export function Results() {
  return null;
}
