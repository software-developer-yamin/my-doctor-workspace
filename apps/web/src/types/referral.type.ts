export type TReferralStats = {
  totalInvitations: number;
  registeredFriends: number;
  earnedRewards: string;
};

export type TReferralHistory = {
  id: number;
  name: string;
  date: string;
  status: "joined" | "pending";
};
