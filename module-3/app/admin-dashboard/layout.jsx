const AdminLayout = ({ children, analytics, team }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Top Navigation / Layout Header */}
        <header className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Control Center
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Dashboard Layout
            </h1>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            ● System Online
          </span>
        </header>

        {/* Main Children Slot (Full Width) */}
        <section>{children}</section>

        {/* Side-by-Side Parallel Slots: Analytics & Team */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="h-full">{analytics}</div>
          <div className="h-full">{team}</div>
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;