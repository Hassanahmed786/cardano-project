// File: components/providers/MeshProvider.tsx
"use client";

import { MeshProvider } from '@meshsdk/react';
import { ReactNode } from 'react';

interface ClientMeshProviderProps {
  children: ReactNode;
}

export default function ClientMeshProvider({ children }: ClientMeshProviderProps) {
  return (
    <MeshProvider>
      {children}
    </MeshProvider>
  );
}