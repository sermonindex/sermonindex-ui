import { Link } from '@remix-run/react';

interface ErrorDisplayProps {
  status: number;
  heading: string;
  message: string;
}

export function ErrorDisplay({ status, heading, message }: ErrorDisplayProps) {
  return (
    <div className="flex w-full flex-1 flex-col justify-center items-center gap-6 p-8 text-center">
      {/* Status code */}
      <div className="text-6xl font-bold text-si-accent pt-8 md:text-8xl">
        {status}
      </div>

      {/* Main heading */}
      <h1 className="text-2xl font-semibold text-si-slate dark:text-si-light md:text-4xl">
        {heading}
      </h1>

      {/* Descriptive message */}
      <p className="max-w-md px-4 text-base text-si-rock dark:text-si-gray md:text-lg">
        {message}
      </p>

      {/* Go Home Button */}
      <Link
        to="/"
        className="mt-4 rounded-lg bg-si-main px-6 py-3 text-base text-si-light shadow-md transition-colors hover:bg-si-olive focus:outline-none focus:ring-2 focus:ring-si-accent focus:ring-offset-2 focus:ring-offset-si-slate dark:hover:bg-si-official md:text-lg"
      >
        Go to Homepage
      </Link>

      <p className="text-sm md:text-base text-si-rock dark:text-si-gray pt-6">
        If this seems like a mistake, feel free to{' '}
        <Link
          to="/md/contact"
          className="font-semibold text-si-main underline decoration-si-main/50 transition hover:text-si-olive hover:decoration-si-olive dark:text-si-official-light dark:hover:text-si-accent"
        >
          contact us
        </Link>
        .
      </p>
    </div>
  );
}
