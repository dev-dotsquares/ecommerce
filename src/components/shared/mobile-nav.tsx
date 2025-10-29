"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { categories } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { SearchBar } from './search-bar';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
            <SearchBar />
        </div>
        <nav className="mt-8 flex flex-col gap-4">
          <Link href="/" onClick={() => setOpen(false)} className="font-semibold">Home</Link>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories">
                <AccordionTrigger className="font-semibold">Categories</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-2 pl-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {category.name}
                        </Link>
                    ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link href="/cart" onClick={() => setOpen(false)} className="font-semibold">Cart</Link>
          <Link href="/wishlist" onClick={() => setOpen(false)} className="font-semibold">Wishlist</Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
