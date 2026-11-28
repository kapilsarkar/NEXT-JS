import Link from "next/link";

const TeamDocsPage = () => {
  return (
    <div className="h-full flex flex-col justify-between rounded-xl border border-rose-200 bg-rose-50/40 p-6 shadow-sm border-t-4 border-t-rose-500">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center rounded-md bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
            Documentation
          </span>
          <span className="text-xs text-slate-500">/team-docs</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Team Docs Page
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Browse onboarding guides, engineering standards, and shared team playbooks.
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-rose-200/60 flex items-center justify-between">
        <span className="text-xs text-slate-500">Parallel slot sub-route active</span>
        <Link
          href="/admin-dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
        >
          ← Back to Team Overview
        </Link>
      </div>
    </div>
  );
};

export default TeamDocsPage;