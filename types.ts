export type Species = 'Cat' | 'Dog' | 'Bird' | 'Horse' | 'Other';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  birthDate?: string;
  photoUrl?: string; // URL or placeholder identifier
  status: 'Active' | 'Deceased' | 'Rehomed';
}

export type ExpenseCategory = string;

export type PaymentMethod = 'Credit' | 'Debit' | 'Cash' | 'Pix' | 'Transfer';

export interface Expense {
  id: string;
  petId: string; // 'all' if shared or specific pet ID
  amount: number;
  date: string; // ISO String
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  notes?: string;
  isRecurring?: boolean;
}

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  date: string; // ISO String (YYYY-MM-DD)
  isCompleted: boolean;
}

export interface DashboardMetrics {
  totalMonth: number;
  totalYear: number;
  byCategory: { name: string; value: number }[];
  byPet: { name: string; value: number }[];
}