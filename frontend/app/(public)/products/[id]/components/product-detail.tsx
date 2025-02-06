"use client";
import { Button } from "@/components/ui/button";
import Ratings from "@/components/ui/rating";
import { Product } from "@/lib/type";
import Link from "next/link";

export const ProductDetail = (product: Product) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <div className="flex justify-center w-full h-[450px]">
            <img src={product.image} alt="product" className="" />
          </div>
        </div>
        <div className="col-span-1 gap-8 flex flex-col">
          <div className="">
            <Link href={`/shop`}>
              <span>shop</span>
            </Link>
            {" >  "}
            <Link href={`/shop?category=${product.category}`}>
              <span>{product.category}</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold pb-8">{product.title}</h1>
          <p className="text-lg pb-8">{product.description}</p>
          <p className="text-xl font-extrabold">$ {product.price}</p>
          <div className="flex items-center gap-2">
            <Ratings value={product.rating.rate} /> ({product.rating.count}{" "}
            reviews)
          </div>
          <Button
            variant="default"
            className="max-w-32"
            onClick={() => {
              alert("Not implemented yet");
            }}
          >
            Add to cart
          </Button>
        </div>
      </div>
      <div className="mt-8 p-8 border-[1px] border-solid border-black">
        <h2 className="text-xl font-semibold pb-4">Product Overview</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
};
