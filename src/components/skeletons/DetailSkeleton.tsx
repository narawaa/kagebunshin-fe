import { Card, CardContent, CardFooter } from "../ui/card";

export function AnimeDetailSkeleton() {
  return (
    <Card>
      <CardContent>
        <div className="flex gap-4 animate-pulse px-32">
          {/* LEFT THUMB */}
          <div className="shrink-0 w-60 h-80 bg-slate-200 rounded-lg" />

          {/* RIGHT CONTENT */}
          <div className="flex flex-col flex-1 gap-4">
            
            {/* DESCRIPTION */}
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-slate-300 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>

            {/* GENRES */}
            <div className="mt-4">
              <div className="h-4 bg-slate-300 rounded w-24 mb-3" />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-slate-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* PRODUCERS */}
            <div className="mt-4">
              <div className="h-4 bg-slate-300 rounded w-28 mb-3" />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-24 bg-slate-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* THEMES */}
            <div className="mt-4">
              <div className="h-4 bg-slate-300 rounded w-24 mb-3" />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-slate-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* CHARACTERS */}
            <div className="mt-4">
              <div className="h-4 bg-slate-300 rounded w-28 mb-3" />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 w-28 bg-slate-200 rounded-lg" />
                ))}
              </div>
            </div>

          </div>
        </div>
      </CardContent>

      <CardFooter />
    </Card>
  );
}
