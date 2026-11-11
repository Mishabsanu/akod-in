import { Bone, GridSkeleton, PageLoading } from "@/components/Skeletons";

export default function Loading() {
  return (
    <PageLoading>
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14">
          <Bone className="h-4 w-40" />
          <Bone className="mt-5 h-12 w-72" />
          <Bone className="mt-4 h-4 w-96 max-w-full" />
        </div>
      </section>
      <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10">
        <GridSkeleton count={8} cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" />
      </div>
    </PageLoading>
  );
}
