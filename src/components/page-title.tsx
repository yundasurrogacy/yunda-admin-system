// src/components/ui/page-title.tsx
import React from 'react';

export default function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-2xl font-serif mb-6">{children}</h1>
  );
}