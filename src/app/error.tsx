'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Captured Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl max-w-lg mx-auto my-12" role="alert" aria-label="Application error fallback interface">
      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Something went wrong!</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
        {error.message || 'An unexpected rendering or API failure occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all font-semibold cursor-pointer shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Retry loading application"
      >
        Try again
      </button>
    </div>
  );
}
