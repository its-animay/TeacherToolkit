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
    <div className="min-h-screen flex bg-background">
      {/* Fixed Sidebar - Full viewport height */}
      <div className="fixed left-0 top-0 h-full w-64 z-30 lg:static lg:z-auto">
        <Sidebar />
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area - with left margin to account for fixed sidebar */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Fixed Header - Full width aligned right of sidebar */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-background/80 backdrop-blur-sm border-b">
          <Header onSidebarToggle={toggleSidebar} />
        </div>
        
        {/* Scrollable content area - with top margin to account for fixed header */}
        <div className="flex-1 overflow-auto pt-16">
          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
