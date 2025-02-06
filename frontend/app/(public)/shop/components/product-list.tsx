"use client";
import { getProducts } from "@/hooks/api";
import { ProductCard } from "./product-card";
import { Product } from "@/lib/type";
import ProductFilter from "./product-filter";
import { useEffect, useState } from "react";
import { ProductSkeleton } from "./product-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { pushToUrl } from "@/lib/utils";

export const ProductList = () => {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState(searchParams.get("sortBy") ?? "new");
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([
    null,
    null,
  ]);

  const handleKeywordsChange = (e: { target: { value: string } }) => {
    setKeywords(e.target.value);
    pushToUrl("q", e.target.value);
  };

  const handlePriceChange = (value: [number | null, number | null]) => {
    setPriceRange(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    pushToUrl("category", value);
  };
  const handleSortChange = (value: string) => {
    setSort(value);
    pushToUrl("sortBy", value);
  };

  const applyFilter = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ keywords, priceRange, category, sort });
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, sort]);

  return (
    <div>
      <div className="flex justify-end pb-4 items-center">
        <span className="text-lg font-semibold px-2">Sort by</span>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="relevant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">new</SelectItem>
            <SelectItem value="price-asc">price: low to high</SelectItem>
            <SelectItem value="price-desc">price: high to low</SelectItem>
            <SelectItem value="rating-desc">rating: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4">
        <div className="col-span-1">
          <ProductFilter
            keywords={keywords}
            priceRange={priceRange}
            category={category}
            onKeywordsChange={handleKeywordsChange}
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
            applyFilter={applyFilter}
          />
        </div>

        <div className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading && <ProductSkeleton />}
            {products.map((product: Product) => (
              <ProductCard key={product.id} {...product} />
            ))}
            {products.length === 0 && !loading && (
              <div className="text-center text-lg">No products found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
