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
  const confidencePercentage = request.intelligence
    ? Math.round(request.intelligence.confidence * 100)
    : null;

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

          {request.intelligence && (
            <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-xs font-semibold text-violet-700"
                  >
                    ✦
                  </span>

                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
                    AI intelligence
                  </p>
                </div>

                {confidencePercentage !== null && (
                  <span className="text-xs font-medium text-violet-700">
                    {confidencePercentage}% confidence
                  </span>
                )}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Underlying customer need
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-800">
                    {request.intelligence.customerNeed}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Suggested theme
                  </p>

                  <div className="mt-2">
                    <span className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-xs font-medium text-violet-700">
                      {request.intelligence.suggestedTheme}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-violet-100 pt-4">
                <p className="text-xs font-medium text-slate-500">
                  Why SignalForge connected it
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {request.intelligence.reasoning}
                </p>
              </div>
            </div>
          )}
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
