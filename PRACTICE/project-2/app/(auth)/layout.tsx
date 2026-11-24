import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">    
    <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-5xl font-bold text-indigo-500">Welcome to Auth Layout</h1>
      {children}
    </div>
    </div>
  );
}

export default AuthLayout;