"use client";

import { useWishlist } from '@/context/wishlist-context';
import { ProductCard } from '@/components/product/product-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Breadcrumb } from '@/components/shared/breadcrumb';

export default function WishlistPage() {
  const { state } = useWishlist();

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} className="mb-6" />
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({state.items.length})</h1>
      {state.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {state.items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          image="empty-wishlist"
          title="Your Wishlist is Empty"
          description="Looks like you haven't added any favorites yet. Explore products and add them to your wishlist!"
          ctaLabel="Explore Products"
          ctaHref="/"
        />
      )}
    </div>
  );
}
