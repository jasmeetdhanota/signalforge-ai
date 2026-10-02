import { FeatureRequest } from "@/types/request";

interface RequestCardProps {
  request: FeatureRequest;
  supported: boolean;
  onSupport: (id: string) => void;
}

const statusStyles = {
  New: "bg-slate-100 text-slate-600",
  "Under Review": "bg-amber-50 text-amber-700",
  Planned: "bg-blue-50 text-blue-700",
  "In Progress": "bg-emerald-50 text-emerald-700",
};

export function RequestCard({
  request,
  supported,
  onSupport,
}: RequestCardProps) {
  const supportCount = request.supportCount + (supported ? 1 : 0);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
              {request.theme}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                statusStyles[request.status]
              }`}
            >
              {request.status}
            </span>

            {request.trending && (
              <span className="text-xs font-medium text-orange-600">
                Trending
              </span>
            )}
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            {request.title}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {request.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            <span>
              {request.relatedCount} related{" "}
              {request.relatedCount === 1 ? "request" : "requests"}
            </span>

            <span aria-hidden="true">•</span>

            <span>
              Submitted{" "}
              {new Date(`${request.submittedAt}T00:00:00`).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                },
              )}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSupport(request.id)}
          aria-pressed={supported}
          className={`flex min-w-24 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            supported
              ? "border-slate-950 bg-slate-950 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
          }`}
        >
          <span aria-hidden="true">↑</span>
          {supportCount}
        </button>
      </div>
    </article>
  );
}
