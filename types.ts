
export type Species = 'Gato' | 'Cachorro' | 'Pássaro' | 'Cavalo' | 'Outro';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  birthDate?: string;
  photoUrl?: string; // URL ou identificador de placeholder
  status: 'Ativo' | 'Falecido' | 'Doado';
}

export type ExpenseCategory = string;

export type PaymentMethod = 'Crédito' | 'Débito' | 'Dinheiro' | 'Pix' | 'Transferência';

export interface Expense {
  id: string;
  petId: string; // 'all' se compartilhado ou ID específico do pet
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