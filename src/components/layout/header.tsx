"use client";

import Link from 'next/link';
import { Heart, ShoppingCart, User } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { SearchBar } from '@/components/shared/search-bar';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { MobileNav } from '../shared/mobile-nav';

export default function Header() {
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();

  const cartItemCount = cartState.items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemCount = wishlistState.items.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Logo />
        </div>
        <MobileNav />
        <div className="hidden md:flex flex-1 items-center justify-between gap-4">
          <div className="w-full flex-1">
            <SearchBar />
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <div className="relative">
                  <Heart />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      {wishlistItemCount}
                    </span>
                  )}
                </div>
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCart />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
             <Button variant="ghost" size="icon">
              <User />
              <span className="sr-only">Profile</span>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
