import { Category } from '../common/types';

export const categoriesData: Category[] = [
  {
    id: 'bus-cat',
    name: { 'en-US': 'Bus' },
    key: 'bus',
    productKeys: [
      'rush-rio',
      'rush-priora',
      'rush-focus',
      'rush-kalina',
      'rush-luxury',
      'rush-vesta',
    ],
  },
  {
    id: 'pickup-cat',
    name: { 'en-US': 'Pickup' },
    key: 'pickup',
    productKeys: [
      'rush-TTA8X5',
      'rush-T400',
      'rush-X7',
      'rush-FXX',
      'rush-one',
      'rush-4x4',
    ],
  },
  {
    id: 'sedan-cat',
    name: { 'en-US': 'Sedan' },
    key: 'sedan',
    productKeys: ['rush-gt4', 'rush-x99', 'rush-gallardo', 'rush-gto'],
  },
  {
    id: 'sports-cat',
    name: { 'en-US': 'Sports' },
    key: 'sports',
    productKeys: ['rush-aventador', 'rush-elise'],
  },
];
