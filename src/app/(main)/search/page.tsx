
"use client";

import { products } from '@/lib/data';
import { ProductCard } from '@/components/product/product-card';
import { ProductFilters } from '@/components/product/product-filters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
];

function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') as string || '').toLowerCase();
  
  const searchedProducts = query 
    ? products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    : [];

  const filteredProducts = searchedProducts.filter(product => {
    const price = searchParams.get('price') ? String(searchParams.get('price')).split(',').map(Number) : null;
    const brands = searchParams.getAll('brand') || [];
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : null;
    const discount = searchParams.get('discount') ? Number(searchParams.get('discount')) : null;
    const inStock = searchParams.get('stock') === 'true';

    if (price && (product.price < price[0] || product.price > price[1])) return false;
    if (brands.length > 0 && !brands.includes(product.brand)) return false;
    if (rating && product.rating < rating) return false;
    if (discount && ((product.mrp - product.price) / product.mrp) * 100 < discount) return false;
    if (inStock && !product.inStock) return false;

    // Attribute filters
    for (const [key, value] of searchParams.entries()) {
        if (key.startsWith('attributes.')) {
            const attrKey = key.replace('attributes.', '');
            const values = searchParams.getAll(key);
            if (product.attributes[attrKey] && !values.includes(product.attributes[attrKey])) {
                return false;
            }
        }
    }
    
    return true;
  });

  const sortOption = searchParams.get('sort') as string || 'relevance';
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'newest': return new Date(b.id).getTime() - new Date(a.id).getTime();
      case 'rating': return b.rating - a.rating;
      case 'relevance':
      default:
        return b.reviewsCount - a.reviewsCount;
    }
  });

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
  const createSortURL = (sortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortBy);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} className="mb-6" />
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      {query ? (
        <p className="text-muted-foreground mb-8">Showing results for "{query}" ({filteredProducts.length} products found)</p>
      ) : (
        <p className="text-muted-foreground mb-8">Please enter a search term to find products.</p>
      )}
      
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block">
          <ProductFilters products={searchedProducts} />
        </aside>
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filters</Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <ProductFilters products={searchedProducts} />
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortOption} onValueChange={(value) => router.push(createSortURL(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          ) : (
            <div className="pt-16">
              <EmptyState 
                image="no-results"
                title="No Products Found"
                description={query ? "We couldn't find any products matching your search and filters." : "Start by typing in the search bar above."}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
    </Suspense>
  );
}
