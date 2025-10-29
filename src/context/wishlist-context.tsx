"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

type WishlistState = {
  items: Product[];
};

type WishlistAction =
  | { type: 'TOGGLE_WISHLIST_ITEM'; payload: Product }
  | { type: 'SET_STATE'; payload: WishlistState };

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
} | undefined>(undefined);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'TOGGLE_WISHLIST_ITEM':
      const itemExists = state.items.some(item => item.id === action.payload.id);
      if (itemExists) {
        return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'SET_STATE':
        return action.payload;
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [savedWishlist, setSavedWishlist] = useLocalStorage<WishlistState>('wishlist', { items: [] });

  const [state, dispatch] = useReducer(wishlistReducer, savedWishlist);

  const enhancedDispatch = (action: WishlistAction) => {
    const newState = wishlistReducer(state, action);
    setSavedWishlist(newState);
    dispatch(action)
  };
  
  React.useEffect(() => {
    dispatch({ type: 'SET_STATE', payload: savedWishlist });
  }, [savedWishlist]);

  return (
    <WishlistContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
