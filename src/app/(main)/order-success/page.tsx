"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { useConfetti } from '@/hooks/use-confetti';

function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const confetti = useConfetti();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.replace('/');
    } else {
        confetti.fire();
    }
  }, [orderId, router, confetti]);

  if (!orderId) {
    return null; // or a loading state
  }
  
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-2xl mx-auto">
        <EmptyState
            image="order-success"
            title="Thank You For Your Order!"
            description={`Your order #${orderId} has been placed successfully. We've sent a confirmation to your email.`}
        />
        <div className="text-center mt-8">
            <Button asChild size="lg">
                <Link href="/">Continue Shopping</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccess />
    </Suspense>
  );
}
