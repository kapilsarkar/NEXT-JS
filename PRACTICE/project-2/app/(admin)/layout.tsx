import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </header>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;