import { Bone, PageLoading } from "@/components/Skeletons";

/** Product page placeholder: photo + details, matching the real layout. */
export default function Loading() {
  return (
    <PageLoading>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <Bone className="h-4 w-64" />
        <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(0,300px)_1fr] lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <Bone className="mx-auto aspect-square w-full max-w-[300px] md:max-w-none" />
          <div className="md:pt-4">
            <Bone className="h-3 w-24" />
            <Bone className="mt-3 h-9 w-3/4" />
            <Bone className="mt-6 h-8 w-40" />
            <div className="mt-8 flex gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Bone key={i} className="h-14 w-20" />
              ))}
            </div>
            <Bone className="mt-8 h-14 w-full max-w-sm rounded-full" />
            <Bone className="mt-8 h-24 w-full" />
          </div>
        </div>
      </div>
    </PageLoading>
  );
}
