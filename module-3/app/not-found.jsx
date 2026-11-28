import Image from 'next/image';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 px-4 text-center">
      <Image
        src="/not-found.svg"
        alt="Page not found"
        width={420}
        height={420}
        priority
        className="max-w-full h-auto mb-6"
      />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-200 tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="mt-3 text-base text-zinc-400 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition-colors"
      >
        Go To Home
      </Link>
    </div>
  );
};

export default NotFoundPage;