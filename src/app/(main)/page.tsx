import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { categories, products, banners } from '@/lib/data';
import { ProductCarousel } from '@/components/product/product-carousel';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const topDeals = [...products].sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price)).slice(0, 8);
  const trending = [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 8);

  return (
    <div>
      {/* Hero Banner Carousel */}
      <section className="w-full">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative aspect-[2/1] md:aspect-[3/1] w-full">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={banner.imageUrl.includes('b1') ? "electronics sale" : banner.imageUrl.includes('b2') ? "fashion model" : "living room"}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white space-y-4 max-w-2xl px-4">
                      <h1 className="text-3xl md:text-6xl font-bold">{banner.title}</h1>
                      <p className="text-lg md:text-xl">{banner.description}</p>
                      <Button asChild size="lg">
                        <Link href={banner.link}>Shop Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      <div className="container px-4 md:px-6">
        {/* Shop by Category */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-2 flex flex-col items-center justify-center aspect-square">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={100}
                      height={100}
                      className="object-contain w-12 h-12 sm:w-16 sm:h-16 transition-transform group-hover:scale-110"
                      data-ai-hint={category.name.toLowerCase()}
                    />
                    <p className="mt-2 font-semibold text-center text-sm">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Deals Carousel */}
        <ProductCarousel title="Top Deals" products={topDeals} />

        {/* Trending Now Carousel */}
        <ProductCarousel title="Trending Now" products={trending} />
        
        {/* Recommended for you */}
        <ProductCarousel title="Recommended for You" products={[...products].reverse().slice(0, 8)} />
      </div>
    </div>
  );
}
