"use client";

import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/hooks/api";
import { CategorySkeleton } from "./product-skeleton";

interface ProductFilterProps {
  keywords: string;
  priceRange: [number | null, number | null];
  category: string;
  onKeywordsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (value: [number | null, number | null]) => void;
  onCategoryChange: (value: string) => void;
  applyFilter: () => void;
}

const ProductFilter = ({
  keywords,
  priceRange,
  category,
  onKeywordsChange,
  onPriceChange,
  onCategoryChange,
  applyFilter,
}: ProductFilterProps) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{
    [key: string]: { title: string; count: number };
  }>({});
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="px-4">
      <div className="py-2">
        <h2 className="text-lg font-semibold pb-2">Search</h2>
        <div className="flex justify-between">
          <Input
            type="text"
            value={keywords}
            onChange={onKeywordsChange}
            placeholder="Search items"
            //add enter = applyFilter
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilter();
              }
            }}
          />
          <Button variant="default" onClick={applyFilter}>
            <Search size={24} />
          </Button>
        </div>
      </div>
      <div className="py-2">
        <h2 className="text-lg font-semibold pb-2">Price</h2>
        <div className="flex gap-2">
          <Input
            type="text"
            value={priceRange[0] ?? ""}
            onChange={(e) =>
              onPriceChange([Number(e.target.value), priceRange[1]])
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilter();
              }
            }}
            placeholder="Min"
          />
          {"-"}
          <Input
            type="text"
            value={priceRange[1] ?? ""}
            onChange={(e) =>
              onPriceChange([priceRange[0], Number(e.target.value)])
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilter();
              }
            }}
            placeholder="Max"
          />
          <Button variant="default" onClick={applyFilter}>
            <Send size={24} />
          </Button>
        </div>
      </div>
      <div className="py-2">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold pb-2">Category</h2>
          <a
            className="text-sm font-thin cursor-pointer"
            onClick={() => onCategoryChange("")}
          >
            Clear
          </a>
        </div>
        <div className="flex flex-col gap-2">
          {loading && <CategorySkeleton />}
          {Object.keys(categories).map((items) => (
            <a
              className={`hover:underline cursor-pointer ${
                items === category ? "font-semibold" : ""
              }`}
              key={items}
              onClick={() => {
                onCategoryChange(items);
              }}
            >
              {items} ({categories[items].count})
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
