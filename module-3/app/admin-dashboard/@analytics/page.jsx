const AnalyticsPage = () => {
  return (
    <div className="h-full flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-emerald-500">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Analytics
          </span>
          <span className="text-xs text-slate-400">Last 30 days</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Welcome to the analytics dashboard. Here you can view various metrics and insights about your application.
        </p>
      </div>

      {/* Quick Metric Preview */}
      <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Page Views</p>
          <p className="text-lg font-bold text-slate-900">48.2K</p>
          <span className="text-xs font-medium text-emerald-600">+12.4%</span>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Conversion</p>
          <p className="text-lg font-bold text-slate-900">4.6%</p>
          <span className="text-xs font-medium text-emerald-600">+1.2%</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;