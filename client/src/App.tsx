import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TeacherProvider } from "@/contexts/TeacherContext";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/userSlice";
import { getUserFromStorage } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import TeachersPage from "@/pages/TeachersPage";
import InstructorsPage from "@/pages/InstructorsPage";
import TeacherDetailPage from "@/pages/TeacherDetailPage";
import CreateTeacherPage from "@/pages/CreateTeacherPage";
import SearchPage from "@/pages/SearchPage";
import ChatPage from "@/pages/ChatPage";
import ChatDemoPage from "@/pages/ChatDemoPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import TutoringPlatformPage from "@/pages/TutoringPlatformPage";
import VoiceChatPage from "@/pages/VoiceChatPage";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function AuthenticatedRouter() {
  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/teachers" component={TeachersPage} />
      <Route path="/teachers/:id" component={TeacherDetailPage} />
      <Route path="/chat/:id" component={ChatPage} />
      <Route path="/chat" component={ChatDemoPage} />
      <Route path="/create" component={CreateTeacherPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/tutoring" component={TutoringPlatformPage} />
      <Route path="/voice-chat" component={VoiceChatPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppRouter() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser && !user) {
      dispatch(setUser(storedUser));
    }
  }, [dispatch, user]);

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/teachers">
        <ProtectedRoute>
          <Layout>
            <TeachersPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/instructors">
        <ProtectedRoute>
          <Layout>
            <InstructorsPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/teachers/:id">
        <ProtectedRoute>
          <Layout>
            <TeacherDetailPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/chat/:id">
        <ProtectedRoute>
          <Layout>
            <ChatPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/chat">
        <ProtectedRoute>
          <Layout>
            <ChatDemoPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/create">
        <ProtectedRoute>
          <Layout>
            <CreateTeacherPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/create-ai-teacher/:instructorId">
        <ProtectedRoute>
          <Layout>
            <CreateTeacherPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/search">
        <ProtectedRoute>
          <Layout>
            <SearchPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/analytics">
        <ProtectedRoute>
          <Layout>
            <AnalyticsPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/settings">
        <ProtectedRoute>
          <Layout>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/tutoring">
        <ProtectedRoute>
          <Layout>
            <TutoringPlatformPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/voice-chat">
        <ProtectedRoute>
          <Layout>
            <VoiceChatPage />
          </Layout>
        </ProtectedRoute>
      </Route>
      
      {/* Root redirect */}
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
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
          <Toaster />
          <AppRouter />
        </TeacherProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
