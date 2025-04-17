
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { User } from "./lib/types";
import { getCurrentUser, getCurrentUserSync, updateCurrentUserInStorage } from "./lib/authService"; 
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import SendFax from "./pages/SendFax";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get from sync storage for immediate response
        let currentUser = getCurrentUserSync();
        
        // Then asynchronously verify and update
        const fetchedUser = await getCurrentUser();
        
        if (fetchedUser) {
          setUser(fetchedUser);
          setAuthorized(true);
          // Update storage with fresh data
          updateCurrentUserInStorage(fetchedUser);
        } else {
          setUser(null);
          setAuthorized(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthorized(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const user = await getCurrentUser();
          if (user) {
            setUser(user);
            setAuthorized(true);
            updateCurrentUserInStorage(user);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAuthorized(false);
          localStorage.removeItem('faxo_user');
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  if (authorized === null) {
    // Still checking auth status
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return authorized ? <>{children}</> : <Navigate to="/auth" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/send-fax" element={
            <ProtectedRoute>
              <SendFax />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/inbox" element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
