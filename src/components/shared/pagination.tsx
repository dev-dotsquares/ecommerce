"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    // Show first page, last page, and pages around current page
    const pageNumbers = new Set([1, currentPage, totalPages]);
    
    if (currentPage > 2) pageNumbers.add(currentPage - 1);
    if (currentPage < totalPages - 1) pageNumbers.add(currentPage + 1);

    const sortedPages = Array.from(pageNumbers).sort((a,b) => a-b).filter(p => p > 0 && p <= totalPages);
    
    let lastPage = 0;
    for (const page of sortedPages) {
      if (page > lastPage + 1) {
        pages.push(<span key={`ellipsis-start-${page}`} className="px-4 py-2">...</span>);
      }
      pages.push(
        <Button
          key={page}
          asChild
          variant={page === currentPage ? 'default' : 'outline'}
          size="icon"
          className="h-10 w-10"
        >
          <Link href={createPageURL(page)}>{page}</Link>
        </Button>
      );
      lastPage = page;
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <Button
        asChild
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        className="h-10 w-10"
      >
        <Link href={createPageURL(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Link>
      </Button>
      {renderPageNumbers()}
      <Button
        asChild
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        className="h-10 w-10"
      >
        <Link href={createPageURL(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Link>
      </Button>
    </div>
  );
}
