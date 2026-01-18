import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import VerificationDetails from "@/pages/VerificationDetails";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import HowItWorks from "@/pages/HowItWorks";
import Documentation from "@/pages/Documentation";
import ApiReference from "@/pages/ApiReference";
import Blog from "@/pages/Blog";
import Careers from "@/pages/Careers";
import About from "@/pages/About";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/how-it-works">
        <ProtectedRoute>
          <HowItWorks />
        </ProtectedRoute>
      </Route>
      <Route path="/docs">
        <ProtectedRoute>
          <Documentation />
        </ProtectedRoute>
      </Route>
      <Route path="/api-docs">
        <ProtectedRoute>
          <ApiReference />
        </ProtectedRoute>
      </Route>
      <Route path="/blog">
        <ProtectedRoute>
          <Blog />
        </ProtectedRoute>
      </Route>
      <Route path="/careers">
        <ProtectedRoute>
          <Careers />
        </ProtectedRoute>
      </Route>
      <Route path="/about">
        <ProtectedRoute>
          <About />
        </ProtectedRoute>
      </Route>
      <Route path="/verification/:id">
        <ProtectedRoute>
          <VerificationDetails />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
