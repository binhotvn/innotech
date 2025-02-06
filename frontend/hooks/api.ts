import { Product, ProductFilter } from "@/lib/type";
import axios from "axios";

export const getProducts = async (filter: ProductFilter) => {
  console.log("Get all products");

  const url = `https://fakestoreapi.com/products`;
  const headers = { "Content-Type": "application/json" };

  try {
    const response = await axios.get(url, { headers });

    const data = response.data;

    // This whole part is a filter function just for example, most of filter is handling in the backend
    // This is just for example
    const filteredData = data.filter((product: Product) => {
      const matchKeywords = product.title
        .toLowerCase()
        .includes(filter.keywords.toLowerCase());
      const matchPriceRange =
        (filter.priceRange[0] === null ||
          product.price >= filter.priceRange[0]) &&
        (filter.priceRange[1] === null ||
          product.price <= filter.priceRange[1]);
      const matchCategory =
        filter.category === "" || product.category === filter.category;

      return matchKeywords && matchPriceRange && matchCategory;
    });
    // sort by
    if (filter.sort === "new") {
      filteredData.sort((a: Product, b: Product) => {
        return a.id - b.id;
      });
    } else if (filter.sort === "price-asc") {
      filteredData.sort((a: Product, b: Product) => {
        return a.price - b.price;
      });
    } else if (filter.sort === "price-desc") {
      filteredData.sort((a: Product, b: Product) => {
        return b.price - a.price;
      });
    }

    return filteredData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("UNKNOWN_ERROR");
    }
  }
};

export const getDetailProducts = async (id: string) => {
  const url = `https://fakestoreapi.com/products/${id}`;
  const headers = { "Content-Type": "application/json" };

  try {
    const response = await axios.get(url, { headers });

    const data = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("UNKNOWN_ERROR");
    }
  }
};

export const getCategory = async () => {
  const url = `https://fakestoreapi.com/products`;
  const headers = { "Content-Type": "application/json" };

  try {
    const response = await axios.get(url, { headers });

    const data = response.data;
    const categories: { [key: string]: { title: string; count: number } } = {};
    data.map((product: Product) => {
      if (!categories[product.category]) {
        return (categories[product.category] = {
          title: product.category,
          count: 1,
        });
      }
      categories[product.category].count++;
    });
    return categories;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("UNKNOWN_ERROR");
    }
  }
};
