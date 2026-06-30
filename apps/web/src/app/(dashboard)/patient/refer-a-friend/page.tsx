"use client";

import { ReferralStats } from "@/components/app-patient/refer-friend-page/referral-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Copy01Icon,
  FacebookIcon,
  Link01Icon,
  Share01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ReferFriendPage() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-10 p-4 py-10 lg:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Refer a Friend
        </h1>
        <p className="text-muted-foreground text-sm font-bold">
          Spread the word about My Doctor and earn rewards for every successful referral.
        </p>
      </div>

      <ReferralStats />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Referral Card */}
        <Card className="shadow-xs group relative border-none bg-primary p-8 text-white overflow-hidden sm:p-12">
          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-transform duration-700" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl transition-transform duration-700" />
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                Refer & Get <br />
                <span className="text-white/60 italic underline decoration-white/20 underline-offset-8">Discounts</span>
              </h2>
              <p className="text-sm font-bold opacity-80 sm:text-base">
                Invite your friends and family. Once they sign up, you both get ৳ 500 discount on your next service.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-micro font-black tracking-widest uppercase opacity-60">
                Your Referral Code
              </p>
              <div className="flex bg-white/10 border-white/20 items-center gap-2 rounded-md border p-2 backdrop-blur-md">
                <span className="flex-1 px-4 text-xl font-black tracking-widest uppercase italic">
                  DOCTOR-MIN-2026
                </span>
                <Button className="bg-white text-primary hover:bg-white/90 font-black tracking-widest uppercase">
                  <HugeiconsIcon icon={Copy01Icon} size={18} className="mr-2" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-micro font-black tracking-widest uppercase opacity-60">
                Quick Share
              </p>
              <div className="flex gap-4">
                <Button size="icon" className="bg-white/10 hover:bg-white/20 h-12 w-12 rounded-md border border-white/20">
                  <HugeiconsIcon icon={WhatsappIcon} size={22} />
                </Button>
                <Button size="icon" className="bg-white/10 hover:bg-white/20 h-12 w-12 rounded-md border border-white/20">
                  <HugeiconsIcon icon={FacebookIcon} size={22} />
                </Button>
                <Button size="icon" className="bg-white/10 hover:bg-white/20 h-12 w-12 rounded-md border border-white/20">
                  <HugeiconsIcon icon={Link01Icon} size={22} />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Info / Progress Card */}
        <Card className="shadow-xs border-border/5 bg-card/60 flex flex-col justify-center border-none p-8 backdrop-blur-md sm:p-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black">How it works?</h3>
              <p className="text-muted-foreground text-sm font-bold">
                Follow these simple steps to start earning.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { step: 1, title: "Share Link", desc: "Send your unique link to your friends via social media or email." },
                { step: 2, title: "They Sign Up", desc: "Your friend signs up using your link and completes their first booking." },
                { step: 3, title: "Get Rewarded", desc: "You both receive exciting rewards and discounts in your wallets." },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="bg-primary/5 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-black italic">
                    0{item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black tracking-tight">{item.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed font-bold">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 h-12 w-full gap-2 rounded-md font-black tracking-widest uppercase italic shadow-sm">
              <HugeiconsIcon icon={Share01Icon} size={18} />
              Invite More Friends
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
