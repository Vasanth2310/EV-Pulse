import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar, { MobileHeader } from "@/components/dashboard/Sidebar";
import OverviewPage from "@/pages/OverviewPage";
import CountryPage from "@/pages/CountryPage";
import PowertrainPage from "@/pages/PowertrainPage";
import VehicleModePage from "@/pages/VehicleModePage";
import ProjectionsPage from "@/pages/ProjectionsPage";
import OptimizationPage from "@/pages/OptimizationPage";
import DataEntryPage from "@/pages/DataEntryPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Sidebar />
          <MobileHeader />
          <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/country" element={<CountryPage />} />
              <Route path="/powertrain" element={<PowertrainPage />} />
              <Route path="/vehicle-mode" element={<VehicleModePage />} />
              <Route path="/projections" element={<ProjectionsPage />} />
              <Route path="/optimization" element={<OptimizationPage />} />
              <Route path="/data-entry" element={<DataEntryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
