export type GradeSystem = 'font' | 'v';

export interface GradeRange {
  min: string;
  max?: string;
  system: GradeSystem;
}

export interface Boulder {
  id: string;
  name: string;
  imageUrl: string;
  fontGrade: string; // Range string like "6A-6B" or "7A"
  vGrade: string;    // Range string like "V3-V5" or "V10"
  date: string;      // ISO format YYYY-MM-DD
}
