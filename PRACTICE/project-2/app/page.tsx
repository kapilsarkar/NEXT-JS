import Link from "next/link";

const userIds = ["1", "2", "3", "4", "5"];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 p-4 text-gray-300">
      <section className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
            Module 3
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
            Welcome to the Home Page
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Select a user profile below to view their dynamically generated route.
          </p>
        </div>

        {/* User Links List */}
        <ul className="mt-6 space-y-2.5">
          {userIds.map((id) => (
            <li key={id}>
              <Link
                href={`/user/${id}`}
                className="group flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/50 px-4 py-3 text-sm font-medium text-gray-200 transition-all hover:border-indigo-500/50 hover:bg-gray-800 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 font-mono text-xs font-bold text-indigo-400">
                    #{id}
                  </span>
                  Visit User {id}
                </span>
                <span className="text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}