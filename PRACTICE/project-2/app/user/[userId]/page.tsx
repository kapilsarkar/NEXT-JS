import { Suspense } from "react";
import Link from "next/link";

type UserIdPageProps = {
    params: Promise<{ userId: string }>;
};

const UserIdContent = async ({ params }: UserIdPageProps) => {
    const { userId } = await params;

    return (
        <div className="my-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                Active User ID
            </span>
            <h2 className="mt-1 font-mono text-2xl font-bold text-indigo-950">
                {userId}
            </h2>
        </div>
    );
};

// Fallback skeleton while params resolve inside Suspense
const UserIdSkeleton = () => (
    <div className="my-6 animate-pulse rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
        <div className="mx-auto h-3 w-24 rounded bg-slate-200" />
        <div className="mx-auto mt-2 h-8 w-36 rounded bg-slate-200" />
    </div>
);

const DynamicUserIdPage = async ({ params }: UserIdPageProps) => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                {/* Header */}
                <div className="text-center">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        Dynamic Route
                    </span>
                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                        Dynamic User ID Page
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        This page is dynamically generated based on the user ID
                        in the URL.
                    </p>
                </div>

                {/* Dynamic Content with Fallback */}
                <Suspense fallback={<UserIdSkeleton />}>
                    <UserIdContent params={params} />
                </Suspense>

                {/* Navigation Action */}
                <div className="mt-6">
                    <Link
                        href="/"
                        className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default DynamicUserIdPage;