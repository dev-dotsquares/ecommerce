"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        // In a real app, you might show suggestions here.
      }
    }, 300); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for products, brands, and more"
        className="w-full pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
