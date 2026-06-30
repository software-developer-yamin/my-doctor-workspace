"use client";

import { REFERRAL_STATS } from "@/data/referral.data";
import {
  Coupon01Icon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ReferralStats() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="shadow-xs bg-card/60 flex items-center gap-5 rounded-md p-6 backdrop-blur-md">
        <div className="bg-primary/5 text-primary flex h-14 w-14 items-center justify-center rounded-md">
          <HugeiconsIcon icon={UserGroupIcon} size={28} />
        </div>
        <div>
          <h4 className="text-2xl font-black">
            {REFERRAL_STATS.totalInvitations}
          </h4>
          <p className="text-muted-foreground text-micro font-black tracking-widest uppercase opacity-60">
            Total Invitations
          </p>
        </div>
      </div>

      <div className="shadow-xs bg-card/60 flex items-center gap-5 rounded-md p-6 backdrop-blur-md">
        <div className="bg-success/5 text-success flex h-14 w-14 items-center justify-center rounded-md">
          <HugeiconsIcon icon={Coupon01Icon} size={28} />
        </div>
        <div>
          <h4 className="text-2xl font-black">
            {REFERRAL_STATS.registeredFriends}
          </h4>
          <p className="text-muted-foreground text-micro font-black tracking-widest uppercase opacity-60">
            Registered Friends
          </p>
        </div>
      </div>

      <div className="shadow-xs bg-card/60 flex items-center gap-5 rounded-md p-6 backdrop-blur-md">
        <div className="bg-warning/5 text-warning flex h-14 w-14 items-center justify-center rounded-md">
          <HugeiconsIcon icon={Wallet01Icon} size={28} />
        </div>
        <div>
          <h4 className="text-2xl font-black">
            {REFERRAL_STATS.earnedRewards}
          </h4>
          <p className="text-muted-foreground text-micro font-black tracking-widest uppercase opacity-60">
            Total Earned
          </p>
        </div>
      </div>
    </div>
  );
}
