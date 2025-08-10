import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import { InstallPrompt } from "@/components/InstallPrompt";
import Index from "./pages/Index";
import Accounts from "./pages/Accounts";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CardPage from "./pages/Card";
import Send from "./pages/payments/Send";
import Transfer from "./pages/payments/Transfer";
import Bills from "./pages/payments/Bills";
import Deposit from "./pages/payments/Deposit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/send" element={<Send />} />
          <Route path="/payments/transfer" element={<Transfer />} />
          <Route path="/payments/bills" element={<Bills />} />
          <Route path="/payments/deposit" element={<Deposit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/card" element={<CardPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <InstallPrompt />
      <PWAUpdatePrompt />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
