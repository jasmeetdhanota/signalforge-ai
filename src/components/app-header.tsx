interface AppHeaderProps {
  onSubmitRequest: () => void;
}

export function AppHeader({ onSubmitRequest }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
            SF
          </div>

          <div>
            <p className="font-semibold tracking-tight text-slate-950">
              SignalForge
            </p>
            <p className="text-xs text-slate-500">Feature intelligence</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmitRequest}
          className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Submit request
        </button>
      </div>
    </header>
  );
}
