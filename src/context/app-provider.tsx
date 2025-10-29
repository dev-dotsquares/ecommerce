"use client";

import React from 'react';
import { CartProvider } from './cart-context';
import { WishlistProvider } from './wishlist-context';
import { ConfettiProvider } from '@/components/shared/confetti-provider';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>
        <ConfettiProvider>
          {children}
        </ConfettiProvider>
      </CartProvider>
    </WishlistProvider>
  );
}
