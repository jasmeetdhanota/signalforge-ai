interface RequestSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function RequestSearch({ value, onChange }: RequestSearchProps) {
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      >
        <path
          d="m21 21-4.35-4.35m2.35-5.15A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search requests, needs, or themes..."
        aria-label="Search feature requests"
        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
    </div>
  );
}
