"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/use-confetti';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressForm } from '@/components/checkout/address-form';
import { PaymentStep } from '@/components/checkout/payment-step';
import { OrderSummary } from '@/components/checkout/order-summary';
import type { ShippingAddress } from '@/lib/types';
import { Check, Truck } from 'lucide-react';

type CheckoutStep = 'address' | 'payment';

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>('address');
  const [shippingAddress, setShippingAddress] = useLocalStorage<ShippingAddress | null>('shipping-address', null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const confetti = useConfetti();

  useEffect(() => {
    if (cartState.items.length === 0 && !isProcessing) {
        router.replace('/cart');
    }
  }, [cartState.items.length, isProcessing, router]);

  const handleAddressSave = (data: ShippingAddress) => {
    setShippingAddress(data);
    setStep('payment');
  };
  
  const handlePlaceOrder = (paymentMethod: 'cod' | 'card') => {
    setIsProcessing(true);
    // Mock processing time
    setTimeout(() => {
      const orderId = `SS-${Date.now()}`;
      toast({
        title: 'Order Placed!',
        description: `Your order #${orderId} has been successfully placed.`,
      });
      confetti.fire();
      cartDispatch({ type: 'CLEAR_CART' });
      router.push(`/order-success?orderId=${orderId}`);
    }, 2000);
  };
  
  if (cartState.items.length === 0) {
      return null; // Render nothing while redirecting
  }

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {step !== 'address' ? <Check className="w-5 h-5"/> : '1'}
                  </div>
                  <span className={`font-medium ${step === 'address' ? 'text-primary' : ''} hidden sm:inline`}>Shipping Address</span>
              </div>
              <div className="flex-1 h-px bg-border"></div>
              <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      2
                  </div>
                  <span className={`font-medium ${step === 'payment' ? 'text-primary' : ''} hidden sm:inline`}>Payment</span>
              </div>
          </div>
          
          {step === 'address' && (
            <Card>
              <CardHeader><CardTitle>Enter your shipping address</CardTitle></CardHeader>
              <CardContent>
                <AddressForm onSave={handleAddressSave} defaultValues={shippingAddress || undefined} />
              </CardContent>
            </Card>
          )}

          {step === 'payment' && (
            <div>
              {shippingAddress && (
                <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Truck className="w-6 h-6"/>
                            <CardTitle>Shipping to</CardTitle>
                        </div>
                        <button onClick={() => setStep('address')} className="text-sm text-primary hover:underline">Change</button>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">{shippingAddress.name}</p>
                        <p className="text-muted-foreground text-sm">{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                        <p className="text-muted-foreground text-sm">Mobile: {shippingAddress.mobile}</p>
                    </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader><CardTitle>Choose payment method</CardTitle></CardHeader>
                <CardContent>
                  <PaymentStep onPlaceOrder={handlePlaceOrder} onBack={() => setStep('address')} isProcessing={isProcessing} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 h-min">
          <OrderSummary />
        </aside>
      </div>
    </div>
  );
}
