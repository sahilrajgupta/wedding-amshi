import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '../lib/reducedMotion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, useful when revealing a row of siblings. */
  delay?: number;
  /** How far the element travels/scales in from — 'pop' is punchier than 'soft'. */
  variant?: 'pop' | 'soft';
}

export default function Reveal({ children, className = '', delay = 0, variant = 'pop' }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const initial =
    variant === 'pop' ? { opacity: 0, y: 46, scale: 0.86, rotate: -1.5 } : { opacity: 0, y: 26 };
  const animate = variant === 'pop' ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.25, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 140, damping: 16, mass: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
}
