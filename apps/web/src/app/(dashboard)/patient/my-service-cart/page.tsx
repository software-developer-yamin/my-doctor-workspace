"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_CART_ITEMS } from "@/data/service-cart.data";
import {
  Add01Icon,
  Delete02Icon,
  Home01Icon,
  Remove01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

export default function ServiceCartPage() {
  const [items, setItems] = useState(SERVICE_CART_ITEMS);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className="mx-auto max-w-[1280px] space-y-10 p-4 py-10 lg:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          My Service Cart
        </h1>
        <p className="text-muted-foreground text-sm font-bold">
          Manage healthcare services like home care and lab tests before booking.
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        {/* Items List */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="shadow-xs group border-none bg-card/60 backdrop-blur-md">
              <CardContent className="flex items-center gap-6 p-6">
                <div className="bg-success/5 text-success flex h-20 w-20 shrink-0 items-center justify-center rounded-md">
                  <HugeiconsIcon icon={Home01Icon} size={32} />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="text-lg font-black tracking-tight">{item.name}</h3>
                  <p className="text-muted-foreground text-xs font-bold italic">{item.category}</p>
                  <p className="text-success mt-1 text-sm font-black italic">৳ {item.price}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/20 flex items-center gap-4 rounded-md p-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-white disabled:opacity-30" disabled={item.quantity <= 1}>
                      <HugeiconsIcon icon={Remove01Icon} size={14} />
                    </Button>
                    <span className="text-sm font-black italic">{item.quantity}</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-white">
                      <HugeiconsIcon icon={Add01Icon} size={14} />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:text-error rounded-full">
                    <HugeiconsIcon icon={Delete02Icon} size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center gap-5 italic text-center opacity-40">
              <HugeiconsIcon icon={Wallet01Icon} size={64} />
              <p className="text-lg font-bold">No services in your cart.</p>
              <Button variant="link" className="text-primary font-bold decoration-2">
                Explore Services
              </Button>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <Card className="shadow-xs border-none bg-card/60 w-full backdrop-blur-md lg:w-[400px]">
          <CardContent className="space-y-8 p-8">
            <h3 className="text-xl font-black">Service Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted-foreground italic">Service Subtotal</span>
                <span className="font-black italic">৳ {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted-foreground italic">Home Visit Fee</span>
                <span className="font-black italic">৳ 0</span>
              </div>
              <div className="border-border/10 border-t pt-4">
                <div className="flex justify-between text-lg font-black">
                  <span>Grand Total</span>
                  <span className="text-success italic">৳ {total}</span>
                </div>
              </div>
            </div>

            <Button className="shadow-premium bg-success hover:bg-success-shade h-14 w-full rounded-md text-2xs font-black tracking-widest uppercase">
              Schedule Services
            </Button>
            
            <div className="bg-primary/5 border-primary/10 flex items-center gap-4 rounded-md border p-4">
              <HugeiconsIcon icon={Wallet01Icon} size={24} className="text-primary" />
              <div>
                <p className="text-xs font-black">Pay after service?</p>
                <p className="text-muted-foreground text-micro font-bold">Cash on delivery available.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
