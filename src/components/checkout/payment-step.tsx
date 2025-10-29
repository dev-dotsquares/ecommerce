"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const cardSchema = z.object({
    cardNumber: z.string().regex(/^(?:\d{4} ?){3}\d{4}$/, "Invalid card number."),
    cardName: z.string().min(2, "Name on card is required."),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Invalid expiry date (MM/YY)."),
    cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV."),
});

interface PaymentStepProps {
  onPlaceOrder: (paymentMethod: 'cod' | 'card') => void;
  onBack: () => void;
  isProcessing: boolean;
}

export function PaymentStep({ onPlaceOrder, onBack, isProcessing }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('card');
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  function onSubmit(values: z.infer<typeof cardSchema>) {
    onPlaceOrder('card');
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as 'cod' | 'card')} className="space-y-4">
        <Label htmlFor="card-payment" className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
          <RadioGroupItem value="card" id="card-payment" className="mr-4" />
          <div className="grid gap-1.5">
            <span className="font-semibold">Credit / Debit Card</span>
            <span className="text-sm text-muted-foreground">Pay securely with your card.</span>
          </div>
        </Label>
        <Label htmlFor="cod-payment" className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
          <RadioGroupItem value="cod" id="cod-payment" className="mr-4" />
          <div className="grid gap-1.5">
            <span className="font-semibold">Cash on Delivery (COD)</span>
            <span className="text-sm text-muted-foreground">Pay with cash upon delivery.</span>
          </div>
        </Label>
      </RadioGroup>

      {paymentMethod === 'card' && (
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0000 0000 0000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">Back to Address</Button>
                    <Button type="submit" disabled={isProcessing} className="w-full sm:w-auto">
                        {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {paymentMethod === 'cod' && (
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">Back to Address</Button>
            <Button onClick={() => onPlaceOrder('cod')} disabled={isProcessing} className="w-full sm:w-auto">
                {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>
        </div>
      )}
    </div>
  );
}
