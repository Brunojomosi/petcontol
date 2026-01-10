
import { Species, PaymentMethod } from './types';

export const DEFAULT_EXPENSE_CATEGORIES: string[] = [
  'Alimentação',
  'Petiscos/Úmida',
  'Areia/Higiene',
  'Veterinário',
  'Vacinas',
  'Medicamentos',
  'Banho e Tosa',
  'Acessórios',
  'Transporte',
  'Outros'
];

export const SPECIES_LIST: Species[] = ['Cachorro', 'Gato', 'Pássaro', 'Cavalo', 'Outro'];

export const PAYMENT_METHODS: PaymentMethod[] = ['Crédito', 'Débito', 'Pix', 'Dinheiro', 'Transferência'];

export const SPECIES_EMOJI: Record<Species, string> = {
  'Cachorro': '🐶',
  'Gato': '🐱',
  'Pássaro': '🐦',
  'Cavalo': '🐴',
  'Outro': '🐾'
};

const STATIC_CATEGORY_COLORS: Record<string, string> = {
  'Alimentação': '#4CAF50',
  'Petiscos/Úmida': '#8BC34A',
  'Areia/Higiene': '#CDDC39',
  'Veterinário': '#F44336',
  'Vacinas': '#E91E63',
  'Medicamentos': '#9C27B0',
  'Banho e Tosa': '#2196F3',
  'Acessórios': '#03A9F4',
  'Transporte': '#FF9800',
  'Outros': '#9E9E9E'
};

// Auxiliar para obter a cor de qualquer categoria
export const getCategoryColor = (category: string): string => {
  if (STATIC_CATEGORY_COLORS[category]) {
    return STATIC_CATEGORY_COLORS[category];
  }
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 60%)`;
};