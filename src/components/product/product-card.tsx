
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { RatingStars } from '../shared/rating-stars';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch: cartDispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { toast } = useToast();
  const router = useRouter();

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const isWishlisted = wishlistState.items.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    cartDispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: 'Added to cart!',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    cartDispatch({ type: 'ADD_ITEM', payload: product });
    router.push('/checkout');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    wishlistDispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: product });
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: `${product.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  return (
    <Card className="group overflow-hidden flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${product.id}`} className="block aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="product image"
          />
        </Link>
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-md">
            {discount}% OFF
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full h-8 w-8 bg-background/70 hover:bg-background"
          onClick={handleToggleWishlist}
        >
          <Heart className={cn("h-4 w-4", isWishlisted ? "text-destructive fill-destructive" : "text-foreground")} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-base leading-tight truncate hover:underline">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={product.rating} />
          <span className="text-sm text-muted-foreground">({product.reviewsCount})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground line-through">${product.mrp.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full sm:hidden">
            <Button onClick={handleBuyNow} disabled={!product.inStock} className="w-full">
                {product.inStock ? 'Buy Now' : 'Out of Stock'}
            </Button>
        </div>
        <div className="hidden sm:grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" onClick={handleAddToCart} disabled={!product.inStock}>
              {product.inStock ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </Button>
            <Button onClick={handleBuyNow} disabled={!product.inStock}>
              Buy Now
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
