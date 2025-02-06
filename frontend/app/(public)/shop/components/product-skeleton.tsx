import { Skeleton } from "@/components/ui/skeleton";
const NUM_SKELETONS = 12;
export const ProductSkeleton = () => {
  const skeletons = Array.from({ length: NUM_SKELETONS }).map((_, i) => (
    <div key={i} className="flex flex-col items-center bg-white relative">
      <Skeleton className="h-[300px] w-full content-center p-8" />

      <div className="p-4 flex justify-between w-full mt-2">
        <div>
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-48 mb-2" />

          <Skeleton className="h-3 w-24" />
        </div>
        <div>
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  ));
  return <>{skeletons}</>;
};

export const CategorySkeleton = () => {
  const skeletons = Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex items-center">
      <Skeleton className="h-4 w-full" />
    </div>
  ));
  return <>{skeletons}</>;
};
