"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps {
  children: ReactNode;
  error?: string;
  className?: string;
}

export function Field({ children, error, className }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
