"use client";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch: cartDispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { toast } = useToast();

  const isWishlisted = wishlistState.items.some(item => item.id === product.id);

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: 'Added to cart!',
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleToggleWishlist = () => {
    wishlistDispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: product });
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: `${product.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  return (
    <div className="flex items-center gap-4">
        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
            <ShoppingCart className="mr-2"/> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleToggleWishlist}>
            <Heart className={cn("h-6 w-6", isWishlisted ? "text-destructive fill-destructive" : "text-foreground")} />
            <span className="sr-only">Add to wishlist</span>
        </Button>
    </div>
  );
}
