export type ProductFilter = {
  keywords: string;
  priceRange: [number | null, number | null];
  category: string;
  sort: string;
};
export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};
