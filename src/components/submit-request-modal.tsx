"use client";

import { FormEvent, useEffect, useState } from "react";

interface NewRequest {
  title: string;
  details: string;
}

interface SubmitRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: NewRequest) => Promise<void>;
}

export function SubmitRequestModal({
  open,
  onClose,
  onSubmit,
}: SubmitRequestModalProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose, isSubmitting]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();

    if (!trimmedTitle || !trimmedDetails || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await onSubmit({
        title: trimmedTitle,
        details: trimmedDetails,
      });

      setTitle("");
      setDetails("");
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-request-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
              New customer signal
            </p>

            <h2
              id="submit-request-title"
              className="mt-1 text-xl font-semibold tracking-tight text-slate-950"
            >
              Submit a feature request
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close submission form"
            className="rounded-lg px-2.5 py-1.5 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
            <div className="flex gap-3">
              <div
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-sm font-semibold text-violet-700"
              >
                ✦
              </div>

              <div>
                <p className="text-sm font-semibold text-violet-950">
                  Describe the need, not just the solution
                </p>

                <p className="mt-1 text-xs leading-5 text-violet-700">
                  SignalForge will eventually compare this request with existing
                  customer signals to identify related needs before it reaches
                  the product team.
                </p>
              </div>
            </div>
          </div>

          {submitError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm font-medium text-red-900">
                Request could not be submitted
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                {submitError}
              </p>
            </div>
          )}

          <div className="mt-6">
            <label
              htmlFor="request-title"
              className="text-sm font-medium text-slate-900"
            >
              What do you need?
            </label>

            <input
              id="request-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={120}
              disabled={isSubmitting}
              placeholder="e.g. Export several reports at once"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

            <div className="mt-1.5 text-right text-xs text-slate-400">
              {title.length}/120
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="request-details"
              className="text-sm font-medium text-slate-900"
            >
              Tell us what you&apos;re trying to accomplish
            </label>

            <textarea
              id="request-details"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              required
              rows={5}
              maxLength={600}
              disabled={isSubmitting}
              placeholder="Share the problem, who it affects, and why it matters..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

            <div className="mt-1.5 flex justify-between gap-4 text-xs text-slate-400">
              <span>Specific context helps identify related needs.</span>
              <span className="shrink-0">{details.length}/600</span>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
