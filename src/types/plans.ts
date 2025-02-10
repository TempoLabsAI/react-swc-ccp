export interface Price {
  id: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  isRecurring: boolean;
  prices: Price[];
}

export interface PlansResponse {
  items: Product[];
  pagination: {
    totalCount: number;
    maxPage: number;
  };
} 