"use client";

import React, { createContext, useState, useCallback, useMemo } from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

interface ConfettiContextType {
  fire: () => void;
}

export const ConfettiContext = createContext<ConfettiContextType | null>(null);

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [isFiring, setIsFiring] = useState(false);

  const fire = useCallback(() => {
    setIsFiring(true);
  }, []);

  const handleComplete = useCallback(() => {
    setIsFiring(false);
  }, []);
  
  const value = useMemo(() => ({ fire }), [fire]);

  return (
    <ConfettiContext.Provider value={value}>
      {children}
      {isFiring && <ConfettiCanvas onComplete={handleComplete} />}
    </ConfettiContext.Provider>
  );
}

export function ConfettiCanvas({ onComplete }: { onComplete?: () => void }) {
    const { width, height } = useWindowSize();

    if (!width || !height) return null;

    return (
        <ReactConfetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={600}
            tweenDuration={8000}
            onConfettiComplete={onComplete}
        />
    )
}
