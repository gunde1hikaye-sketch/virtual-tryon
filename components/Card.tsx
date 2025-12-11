import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}
