import Link from "next/link";

const TeamPage = () => {
  return (
    <div className="h-full flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-indigo-500">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            Team Workspace
          </span>
          <span className="text-xs text-slate-400">6 Active</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Team Dashboard
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Welcome to the team dashboard. Here you can manage your team members, view analytics, and access team resources.
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">Internal documentation & SOPs</span>
        <Link
          href="/admin-dashboard/team-docs"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          Go To Team Docs →
        </Link>
      </div>
    </div>
  );
};

export default TeamPage;