import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, borderColor: 'rgba(139, 92, 246, 0.4)' } : undefined}
      className={cn(
        "bg-surface/40 backdrop-blur-md border border-border-primary rounded-[2rem] overflow-hidden transition-all duration-300 shadow-xl shadow-black/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
