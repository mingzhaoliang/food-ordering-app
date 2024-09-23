import Modal from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

export default function Loading() {
  return (
    <Modal className="w-full max-sm:max-w-96 sm:w-3/4 lg:w-3/5 2xl:w-1/2 h-full sm:h-120 bg-stone-50">
      <div className="p-2 sm:p-4 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-12 2xl:grid-cols-5">
        <Skeleton className="w-full max-sm:h-64 max-sm:aspect-video sm:h-112 lg:col-span-5 2xl:col-span-2 object-cover" />
        <div className="flex-1 lg:col-span-7 2xl:col-span-3 max-sm:p-2 sm:px-4 lg:px-6 flex flex-col justify-between gap-2">
          <div className="pt-2 space-y-2">
            <Skeleton className="w-full h-8" />
            <div className="space-x-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="inline-block size-icon-3" />
              ))}
            </div>
          </div>
          <Skeleton className="flex-1 w-full h-16" />
          <Skeleton className="w-20 h-6" />
        </div>
      </div>
    </Modal>
  );
}
