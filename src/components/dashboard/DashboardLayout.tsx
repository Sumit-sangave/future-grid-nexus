import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { EnhancedEnergyOverview } from "./EnhancedEnergyOverview";
import { AlertSystem } from "./AlertSystem";
import { ChatBot } from "./ChatBot";
import { EnhancedEnergySharing } from "./EnhancedEnergySharing";
import { Analytics } from "./Analytics";
import { AIAssistance } from "./AIAssistance";
import { ProfileDialog } from "./ProfileDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, LogOut } from "lucide-react";

export const DashboardLayout = () => {
  const { signOut, profile } = useAuth();
  const [activeView, setActiveView] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <EnhancedEnergyOverview />;
      case "alerts":
        return <AlertSystem />;
      case "chatbot":
        return <ChatBot />;
      case "sharing":
        return <EnhancedEnergySharing />;
      case "analytics":
        return <Analytics />;
      case "ai-insights":
        return <AIAssistance />;
      default:
        return <EnhancedEnergyOverview />;
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Smart Energy Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Government Campus Energy Dashboard • {profile?.role === 'admin' ? 'Administrator' : 'Technician'} View
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ProfileDialog />
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
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