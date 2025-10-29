"use client";

import { useCart } from "@/context/cart-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface OrderSummaryProps {
  appliedCoupon?: { code: string; discount: number };
  shippingCost?: number;
}

export function OrderSummary({ appliedCoupon, shippingCost = 0 }: OrderSummaryProps) {
  const { state } = useCart();
  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const total = subtotal - (appliedCoupon?.discount || 0) + shippingCost;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {state.items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-bl-md w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span className="text-muted-foreground">Discount ({appliedCoupon.code})</span>
              <span>-${appliedCoupon.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
