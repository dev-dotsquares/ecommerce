import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  image: 'empty-cart' | 'empty-wishlist' | 'no-results' | 'order-success';
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ image, title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === image);

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {placeholder && (
        <Image
          src={placeholder.imageUrl}
          alt={placeholder.description}
          width={400}
          height={300}
          className="w-64 h-auto object-contain mb-8"
          data-ai-hint={placeholder.imageHint}
        />
      )}
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {ctaLabel && ctaHref && (
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
