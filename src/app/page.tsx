import GridBox from "@/components/GridBox";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-24 pb-10 pl-10">
      <Suspense>
        <GridBox />
      </Suspense>
    </main>
  );
}
