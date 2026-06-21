'use client';

import { useEffect } from 'react';

export default function TrackerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Tracker segment error:', error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-label="Tracker page error"
      className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center"
    >
      <h2 className="text-xl font-semibold text-red-400 mb-2">Analysis Failed</h2>
      <p className="text-zinc-400 text-sm mb-6">{error.message}</p>
      <button
        onClick={reset}
        aria-label="Retry tracker analysis"
        className="px-5 py-2 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-white transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
