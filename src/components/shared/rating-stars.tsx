import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  className?: string;
  size?: number;
}

export function RatingStars({ rating, className, size = 16 }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-0.5 text-rating", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" size={size} />
      ))}
      {halfStar && <StarHalf key="half" fill="currentColor" size={size} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} fill="currentColor" className="text-muted/50" size={size} />
      ))}
    </div>
  );
}
