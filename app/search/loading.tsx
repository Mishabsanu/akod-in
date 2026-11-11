import { Bone, GridSkeleton, PageLoading } from "@/components/Skeletons";

export default function Loading() {
  return (
    <PageLoading>
      <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10">
        <Bone className="h-12 w-full max-w-xl" />
        <Bone className="mt-6 h-4 w-40" />
        <div className="mt-8">
          <GridSkeleton count={12} />
        </div>
      </div>
    </PageLoading>
  );
}
