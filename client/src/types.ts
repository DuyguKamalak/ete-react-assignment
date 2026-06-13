export interface AuthUser {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Company {
  id: number;
  name: string;
  legalNumber: string;
  incorporationCountry: string;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CompanyInput = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>;

export interface Product {
  id: number;
  name: string;
  category: string;
  amount: number;
  amountUnit: string;
  companyId: number;
  company?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = {
  name: string;
  category: string;
  amount: number;
  amountUnit: string;
  companyId: number;
};

export interface DashboardStats {
  totalCompanies: number;
  totalProducts: number;
  distinctCategories: number;
  distinctCountries: number;
  latestCompanies: Company[];
  productsByCategory: { category: string; count: number }[];
  companiesByCountry: { country: string; count: number }[];
}
