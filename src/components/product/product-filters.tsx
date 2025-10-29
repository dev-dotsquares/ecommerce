"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '../ui/button';

interface ProductFiltersProps {
  products: Product[];
}

const RATING_FILTERS = [
  { value: 4, label: '4★ & above' },
  { value: 3, label: '3★ & above' },
  { value: 2, label: '2★ & above' },
  { value: 1, label: '1★ & above' },
];

const DISCOUNT_FILTERS = [
  { value: 50, label: '50% or more' },
  { value: 30, label: '30% or more' },
  { value: 10, label: '10% or more' },
];

export function ProductFilters({ products }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.getAll(name);
      
      if (currentValues.includes(value)) {
        // If it's a multi-select filter (like brand) and the value is already there, remove it
        const newValues = currentValues.filter(v => v !== value);
        params.delete(name);
        newValues.forEach(v => params.append(name, v));
      } else if (name === 'brand' || name.startsWith('attributes.')) {
        // Multi-select: add new value
        params.append(name, value);
      } else {
        // Single-select: set new value
        params.set(name, value);
      }
      
      params.set('page', '1'); // Reset to first page on filter change
      return params.toString();
    },
    [searchParams]
  );

  const clearFilter = useCallback((name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    params.set('page', '1');
    return params.toString();
  }, [searchParams]);
  
  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value), { scroll: false });
  };
  
  const handleClearFilter = (name: string) => {
    router.push(pathname + '?' + clearFilter(name), { scroll: false });
  };

  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  }, [products]);

  const availableAttributes = useMemo(() => {
    const attributes: Record<string, Set<string>> = {};
    products.forEach(p => {
      for (const key in p.attributes) {
        if (!attributes[key]) {
          attributes[key] = new Set();
        }
        attributes[key].add(p.attributes[key]);
      }
    });
    return Object.fromEntries(
      Object.entries(attributes).map(([key, valueSet]) => [key, Array.from(valueSet).sort()])
    );
  }, [products]);
  
  const maxPrice = useMemo(() => Math.ceil(Math.max(...products.map(p => p.mrp)) / 100) * 100, [products]);
  const priceRange = searchParams.get('price')?.split(',').map(Number) || [0, maxPrice];

  const handlePriceChange = (value: number[]) => {
     const params = new URLSearchParams(searchParams.toString());
     params.set('price', value.join(','));
     params.set('page', '1');
     router.push(pathname + '?' + params.toString(), { scroll: false });
  };

  return (
    <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto pr-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="link" className="p-0 h-auto" onClick={() => router.push(pathname, { scroll: false })}>Clear All</Button>
      </div>
      <Accordion type="multiple" defaultValue={['price', 'brand', 'rating']} className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className="pt-4">
            <Slider
              min={0}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueCommit={handlePriceChange}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableBrands.map(brand => (
                <div key={brand} className="flex items-center gap-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={searchParams.getAll('brand').includes(brand)}
                    onCheckedChange={() => handleFilterChange('brand', brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="font-normal">{brand}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        {Object.entries(availableAttributes).map(([key, values]) => (
          <AccordionItem key={key} value={`attr-${key}`}>
            <AccordionTrigger>{key}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {values.map(value => (
                  <div key={value} className="flex items-center gap-2">
                    <Checkbox
                      id={`attr-${key}-${value}`}
                      checked={searchParams.getAll(`attributes.${key}`).includes(value)}
                      onCheckedChange={() => handleFilterChange(`attributes.${key}`, value)}
                    />
                    <Label htmlFor={`attr-${key}-${value}`} className="font-normal">{value}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        <AccordionItem value="rating">
          <AccordionTrigger>Customer Ratings</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={searchParams.get('rating') || undefined}
              onValueChange={(value) => handleFilterChange('rating', value)}
            >
              <div className="space-y-2">
                {RATING_FILTERS.map(rating => (
                  <div key={rating.value} className="flex items-center gap-2">
                    <RadioGroupItem value={String(rating.value)} id={`rating-${rating.value}`} />
                    <Label htmlFor={`rating-${rating.value}`} className="font-normal">{rating.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {searchParams.has('rating') && <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => handleClearFilter('rating')}>Clear</Button>}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="discount">
          <AccordionTrigger>Discount</AccordionTrigger>
          <AccordionContent>
             <RadioGroup
                value={searchParams.get('discount') || undefined}
                onValueChange={(value) => handleFilterChange('discount', value)}
              >
                <div className="space-y-2">
                  {DISCOUNT_FILTERS.map(discount => (
                    <div key={discount.value} className="flex items-center gap-2">
                      <RadioGroupItem value={String(discount.value)} id={`discount-${discount.value}`} />
                      <Label htmlFor={`discount-${discount.value}`} className="font-normal">{discount.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              {searchParams.has('discount') && <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => handleClearFilter('discount')}>Clear</Button>}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <Switch 
                id="in-stock"
                checked={searchParams.get('stock') === 'true'}
                onCheckedChange={(checked) => handleFilterChange('stock', String(checked))}
              />
              <Label htmlFor="in-stock">In Stock Only</Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
