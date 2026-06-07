export type ScheduleItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
};

export type Company = {
  id: string;
  name: string;
  industry: string;
  progress: string;
  priority: string;
  url: string;
  schedule: ScheduleItem[];

  country?: string;
  prefecture?: string;
  city?: string;
  address?: string;

  foreignCountry: string;
  foreignCity: string;
  workLocation: string;
  employees: string;

  culture: string;
  strengths: string;

  memo: string;
  logo?: string;
};