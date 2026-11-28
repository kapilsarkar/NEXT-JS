const AdminPage = () => {
  return (
    <div className="rounded-xl border border-amber-200  from-amber-50 to-orange-50 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-amber-950">Admin Dashboard</h2>
          <p className="mt-1 text-sm text-amber-800">
            Welcome to the admin dashboard! Monitor system metrics and manage your team from one place.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="rounded-lg bg-white/80 px-4 py-2 border border-amber-200">
            <span className="block text-xs text-slate-500">Active Users</span>
            <span className="font-bold text-slate-900">1,284</span>
          </div>
          <div className="rounded-lg bg-white/80 px-4 py-2 border border-amber-200">
            <span className="block text-xs text-slate-500">Team Members</span>
            <span className="font-bold text-slate-900">24</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;