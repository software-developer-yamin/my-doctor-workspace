import { TReferralStats, TReferralHistory } from "@/types/referral.type";

export const REFERRAL_STATS: TReferralStats = {
  totalInvitations: 45,
  registeredFriends: 12,
  earnedRewards: "৳ 1,200",
};

export const REFERRAL_HISTORY: TReferralHistory[] = [
  { id: 1, name: "Foysal Ahmed", date: "08 April, 2026", status: "joined" },
  { id: 2, name: "Min Ahmed", date: "07 April, 2026", status: "pending" },
  { id: 3, name: "Sakib Khan", date: "05 April, 2026", status: "joined" },
];
