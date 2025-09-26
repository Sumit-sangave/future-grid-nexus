import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { EnergyOverview } from "./EnergyOverview";
import { EnergyCharts } from "./EnergyCharts";
import { AlertSystem } from "./AlertSystem";
import { ChatBot } from "./ChatBot";
import { EnergySharing } from "./EnergySharing";
import { Analytics } from "./Analytics";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const DashboardLayout = () => {
  const [activeView, setActiveView] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="space-y-6">
            <EnergyOverview />
            <EnergyCharts />
          </div>
        );
      case "alerts":
        return <AlertSystem />;
      case "chatbot":
        return <ChatBot />;
      case "sharing":
        return <EnergySharing />;
      case "analytics":
        return <Analytics />;
      default:
        return (
          <div className="space-y-6">
            <EnergyOverview />
            <EnergyCharts />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-card/80 backdrop-blur-sm border-border/50"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Energy Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Government Campus Energy Dashboard
            </p>
          </div>
          
          {renderContent()}
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};