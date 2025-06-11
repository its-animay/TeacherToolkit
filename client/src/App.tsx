import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TeacherProvider } from "@/contexts/TeacherContext";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import TeachersPage from "@/pages/TeachersPage";
import TeacherDetailPage from "@/pages/TeacherDetailPage";
import CreateTeacherPage from "@/pages/CreateTeacherPage";
import SearchPage from "@/pages/SearchPage";
import ChatPage from "@/pages/ChatPage";
import ChatDemoPage from "@/pages/ChatDemoPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import Layout from "@/components/layout/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/teachers" component={TeachersPage} />
      <Route path="/teachers/:id" component={TeacherDetailPage} />
      <Route path="/chat/:id" component={ChatPage} />
      <Route path="/chat" component={ChatDemoPage} />
      <Route path="/create" component={CreateTeacherPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Handle unhandled promise rejections globally
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn('Unhandled promise rejection:', event.reason);
      // Prevent the error from appearing in console
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TeacherProvider>
          <Layout>
            <Toaster />
            <Router />
          </Layout>
        </TeacherProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
