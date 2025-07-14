import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 fixed top-0 left-0 h-screen overflow-y-auto bg-white border-r z-20">
        <Sidebar />
      </aside>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header + Page Content */}
      <div className="flex flex-col flex-1 ml-64">
        <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b z-30">
          <Header onSidebarToggle={toggleSidebar} />
        </header>

        <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
