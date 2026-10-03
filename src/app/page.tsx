"use client";

import { useEffect, useMemo, useState } from "react";

import { AppHeader } from "@/components/app-header";
import { RequestCard } from "@/components/request-card";
import { RequestFilter, RequestFilters } from "@/components/request-filters";
import { RequestSearch } from "@/components/request-search";
import { SubmitRequestModal } from "@/components/submit-request-modal";
import {
  createFeatureRequest,
  getFeatureRequests,
} from "@/lib/supabase/requests";
import { FeatureRequest } from "@/types/request";

export default function Home() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<RequestFilter>("All");
  const [supportedRequests, setSupportedRequests] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const featureRequests = await getFeatureRequests();

        if (isMounted) {
          setRequests(featureRequests);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load feature requests.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        request.title.toLowerCase().includes(normalizedQuery) ||
        request.description.toLowerCase().includes(normalizedQuery) ||
        request.theme.toLowerCase().includes(normalizedQuery);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Trending" && request.trending) ||
        request.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, requests, searchQuery]);

  function handleSupport(requestId: string) {
    setSupportedRequests((current) => {
      const next = new Set(current);

      if (next.has(requestId)) {
        next.delete(requestId);
      } else {
        next.add(requestId);
      }

      return next;
    });
  }

  async function handleSubmitRequest({
    title,
    details,
  }: {
    title: string;
    details: string;
  }) {
    const newRequest = await createFeatureRequest({
      title,
      description: details,
    });

    setRequests((current) => [newRequest, ...current]);
    setSearchQuery("");
    setActiveFilter("All");
  }

  const totalSupport = requests.reduce(
    (total, request) =>
      total +
      request.supportCount +
      (supportedRequests.has(request.id) ? 1 : 0),
    0,
  );

  const totalThemes = new Set(requests.map((request) => request.theme)).size;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <AppHeader onSubmitRequest={() => setIsSubmitModalOpen(true)} />

      <SubmitRequestModal
        open={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitRequest}
      />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Customer signal workspace
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Turn customer signals into{" "}
                <span className="text-violet-700">product decisions.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Discover what customers are asking for, connect related needs,
                and build a clearer picture of what deserves attention.
              </p>
            </div>

            <div className="mt-9 max-w-3xl">
              <RequestSearch value={searchQuery} onChange={setSearchQuery} />

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Search before submitting — another customer may already be
                describing the same underlying need.
              </p>
            </div>

            <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              <Metric label="Requests" value={String(requests.length)} />
              <Metric label="Customer needs" value="—" />
              <Metric label="Support signals" value={String(totalSupport)} />
              <Metric label="Themes" value={String(totalThemes)} />
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                Customer signals
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Feature requests
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Explore recurring needs and see where customer support is
                building.
              </p>
            </div>

            <RequestFilters
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500" aria-live="polite">
                {isLoading
                  ? "Loading requests..."
                  : `${filteredRequests.length} ${
                      filteredRequests.length === 1 ? "request" : "requests"
                    } found`}
              </p>

              <p className="hidden text-xs text-slate-400 sm:block">
                Ranked by customer signal
              </p>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                <p className="text-sm font-medium text-slate-600">
                  Loading customer signals...
                </p>
              </div>
            ) : loadError ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center"
              >
                <h3 className="text-base font-semibold text-red-900">
                  Unable to load requests
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">
                  {loadError}
                </p>
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    supported={supportedRequests.has(request.id)}
                    onSupport={handleSupport}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <h3 className="text-base font-semibold text-slate-900">
                  No matching requests
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try another search or filter. If the need has not been raised
                  yet, you can submit it as a new request.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </dd>
    </div>
  );
}
