'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ViewportAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ViewportAnimation = ({
  children,
  className,
  delay = 0,
}: ViewportAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

