export type TUserProfile = {
  name: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
  isBloodDonor: boolean;
  nid: string;
  passport: string;
};

export type TAddress = {
  id: number;
  label: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

export type TFamilyMember = {
  id: number;
  name: string;
  phone: string;
  relation: string;
  age: string;
  sex: string;
};
