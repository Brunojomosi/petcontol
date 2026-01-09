import { Species, PaymentMethod } from './types';

export const DEFAULT_EXPENSE_CATEGORIES: string[] = [
  'Food',
  'Wet Food/Treats',
  'Litter/Bedding',
  'Vet',
  'Vaccines',
  'Medicine',
  'Grooming',
  'Accessories',
  'Transport',
  'Other'
];

export const SPECIES_LIST: Species[] = ['Dog', 'Cat', 'Bird', 'Horse', 'Other'];

export const PAYMENT_METHODS: PaymentMethod[] = ['Credit', 'Debit', 'Pix', 'Cash', 'Transfer'];

export const SPECIES_EMOJI: Record<Species, string> = {
  Dog: '🐶',
  Cat: '🐱',
  Bird: '🐦',
  Horse: '🐴',
  Other: '🐾'
};

const STATIC_CATEGORY_COLORS: Record<string, string> = {
  'Food': '#4CAF50',
  'Wet Food/Treats': '#8BC34A',
  'Litter/Bedding': '#CDDC39',
  'Vet': '#F44336',
  'Vaccines': '#E91E63',
  'Medicine': '#9C27B0',
  'Grooming': '#2196F3',
  'Accessories': '#03A9F4',
  'Transport': '#FF9800',
  'Other': '#9E9E9E'
};

// Helper to get color for any category (static or custom)
export const getCategoryColor = (category: string): string => {
  if (STATIC_CATEGORY_COLORS[category]) {
    return STATIC_CATEGORY_COLORS[category];
  }
  // Generate a consistent pastel color string from the category name
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 60%)`;
};