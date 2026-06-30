import { TUserProfile, TAddress, TFamilyMember } from "@/types/profile.type";

export const INITIAL_PROFILE: TUserProfile = {
  name: "Foysal Ahmed",
  phone: "+8801950601811",
  email: "foysalahmedmin@gmail.com",
  gender: "Male",
  dob: "12 Oct 1995",
  isBloodDonor: true,
  nid: "1995123456789",
  passport: "BE0123456",
};

export const INITIAL_ADDRESSES: TAddress[] = [
  {
    id: 1,
    label: "Home",
    phone: "+8801950601811",
    address: "Block-B, Road-04, Banasree, Rampura, Dhaka-1219",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    phone: "+8801700000000",
    address: "Level-4, Software Park, Karwan Bazar, Dhaka",
    isDefault: false,
  },
];

export const INITIAL_FAMILY: TFamilyMember[] = [
  {
    id: 1,
    name: "Rahima Begum",
    phone: "+8801800000000",
    relation: "Mother",
    age: "52",
    sex: "Female",
  },
];
