/* eslint-disable @next/next/no-img-element */
import Ratings from "@/components/ui/rating";
import { Product } from "@/lib/type";

export const ProductCard = (product: Product) => {
  return (
    <div
      className="flex flex-col items-center bg-white relative border-[1px] border-solid border-black cursor-pointer"
      onClick={() => {
        window.location.href = `/products/${product.id}`;
      }}
    >
      {/* Image Container */}
      <div className="min-h-[300px] content-center p-8">
        <img
          src={product.image}
          alt={product.title}
          className="rounded-lg max-w-[200px] max-h-[200px] object-cover"
        />
      </div>

      <div className="p-4 flex justify-between w-full mt-2 gap-4">
        <div>
          <div className="flex items-center">
            <Ratings value={product.rating.rate} size={12} variant="yellow" />
            <span className="ml-2 text-xs text-gray-600">
              ({product.rating.count})
            </span>
          </div>

          <p className="text-sm font-semibold cursor-pointer">
            {product.title}
          </p>
          <p className="text-gray-800 text-xs">{product.category}</p>
        </div>
        <div>
          <p className="text-sm">${product.price}</p>
        </div>
      </div>
    </div>
  );
};
