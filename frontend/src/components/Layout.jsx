import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex pt-16 overflow-hidden">
        <Sidebar />
        <main className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64">
          <div className="px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
