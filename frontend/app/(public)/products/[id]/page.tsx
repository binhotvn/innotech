import { getDetailProducts } from "@/hooks/api";
import { ProductDetail } from "./components/product-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "a store",
  description: "",
};
const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const product = await getDetailProducts(id);
  // set metadata tags for seo

  metadata.title = product.title;
  metadata.description = product.description;

  return (
    <div className="container mx-auto py-8">
      <ProductDetail {...product} />
    </div>
  );
};

export default ProductDetailPage;
