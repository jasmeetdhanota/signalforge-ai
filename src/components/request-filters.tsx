export type RequestFilter =
  | "All"
  | "Trending"
  | "Under Review"
  | "Planned"
  | "In Progress";

interface RequestFiltersProps {
  activeFilter: RequestFilter;
  onChange: (filter: RequestFilter) => void;
}

const filters: RequestFilter[] = [
  "All",
  "Trending",
  "Under Review",
  "Planned",
  "In Progress",
];

export function RequestFilters({
  activeFilter,
  onChange,
}: RequestFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Filter feature requests">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={isActive}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
