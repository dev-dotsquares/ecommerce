"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { coupons } from '@/lib/data';
import { EmptyState } from '@/components/shared/empty-state';
import { Breadcrumb } from '@/components/shared/breadcrumb';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string; } | null>(null);

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string, name: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast({
      title: 'Item removed',
      description: `${name} has been removed from your cart.`,
      variant: 'destructive',
    });
  };

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (coupon) {
      if (coupon.type === 'percentage') {
        const discount = (subtotal * coupon.value) / 100;
        setAppliedCoupon({ ...coupon, discount });
      } else if (coupon.type === 'flat') {
        setAppliedCoupon({ ...coupon, discount: coupon.value });
      } else {
         setAppliedCoupon({ ...coupon, discount: 0, type: 'shipping' });
      }
      toast({
        title: 'Coupon Applied!',
        description: coupon.description,
      });
    } else {
      toast({
        title: 'Invalid Coupon',
        description: 'The coupon code you entered is not valid.',
        variant: 'destructive',
      });
    }
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast({
      title: 'Coupon removed.',
    });
  }

  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCost = appliedCoupon?.type === 'shipping' ? 0 : (subtotal > 0 ? 10 : 0); // Example shipping logic
  const discountAmount = appliedCoupon?.type !== 'shipping' ? appliedCoupon?.discount || 0 : 0;
  const total = subtotal - discountAmount + shippingCost;
  
  if (state.items.length === 0) {
    return (
        <div className="container py-12">
            <EmptyState
                image="empty-cart"
                title="Your Cart is Empty"
                description="Looks like you haven't added anything to your cart yet. Let's find something for you!"
                ctaLabel="Continue Shopping"
                ctaHref="/"
            />
        </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} className="mb-6" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Cart ({totalItems} items)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {state.items.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-lg self-center sm:self-start"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/product/${item.id}`} className="font-semibold hover:underline">{item.name}</Link>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                        <p className="text-lg font-bold mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id, item.name)}>
                            <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6 lg:sticky lg:top-24 h-min">
          <Card>
            <CardHeader>
                <CardTitle>Apply Coupon</CardTitle>
            </CardHeader>
            <CardContent>
                {appliedCoupon ? (
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-green-600">Applied: {appliedCoupon.code}</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveCoupon}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter coupon code" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button onClick={handleApplyCoupon} disabled={!couponCode}>Apply</Button>
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Price Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                 {appliedCoupon && appliedCoupon.type !== 'shipping' && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
