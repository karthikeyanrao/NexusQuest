// Card.tsx
import React from 'react';

export function Card({ children, className }: { children: React.ReactNode, className: string }) {
  return (
    <div className={`bg-card p-4 rounded-md ${className}`}>
      {children}
    </div>
  );
}
