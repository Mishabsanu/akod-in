import { Bone, GridSkeleton, PageLoading } from "@/components/Skeletons";

/** Home page placeholder: hero stage, trust bar, product grid. */
export default function Loading() {
  return (
    <PageLoading>
      <section className="relative flex h-[72svh] min-h-[480px] items-end justify-center gap-[4%] overflow-hidden border-b border-neutral-200 bg-[radial-gradient(130%_60%_at_50%_100%,#ececec_0%,#f6f6f6_40%,#ffffff_75%)] pb-[22%] lg:h-[calc(100svh-137px)] lg:pb-[10%]">
        <Bone className="aspect-[3/4] w-[12%] max-w-[150px] opacity-60" />
        <Bone className="aspect-[3/4] w-[22%] max-w-[260px]" />
        <Bone className="aspect-[3/4] w-[12%] max-w-[150px] opacity-60" />
      </section>
      <div className="mx-auto max-w-[1440px] px-4 pt-20 sm:px-6 lg:px-10">
        <Bone className="h-8 w-56" />
        <div className="mt-8">
          <GridSkeleton />
        </div>
      </div>
    </PageLoading>
  );
}
