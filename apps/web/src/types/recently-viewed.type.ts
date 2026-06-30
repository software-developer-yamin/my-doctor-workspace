export interface RecentDoctor {
  id: string;
  slug: string;
  name: string;
  photo: string;
  primarySpecialty: string;
  degrees: string[];
  fee: number;
  experience: string;
}

export interface RecentHospital {
  id: string;
  slug: string;
  name: string;
  thumbnail: string;
  district?: string;
  specialtyStats?: string;
  rating: number;
  feeRange?: string;
}
