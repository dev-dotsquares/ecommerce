"use client";

import { useContext } from 'react';
import { ConfettiContext } from '@/components/shared/confetti-provider';

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  if (!context) {
    throw new Error('useConfetti must be used within a ConfettiProvider');
  }
  return context;
};
