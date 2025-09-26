import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  AlertTriangle, 
  MessageSquare, 
  Share2, 
  TrendingUp,
  Zap,
  Home
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: "overview", label: "Dashboard", icon: Home },
  { id: "charts", label: "Energy Charts", icon: BarChart3 },
  { id: "alerts", label: "Fault Detection", icon: AlertTriangle },
  { id: "chatbot", label: "AI Assistant", icon: MessageSquare },
  { id: "sharing", label: "Energy Sharing", icon: Share2 },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
];

export const Sidebar = ({ activeView, setActiveView, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border/50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">EnergyOS</h2>
                <p className="text-xs text-muted-foreground">v2.1.0</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3 h-12",
                    activeView === item.id && "bg-primary/10 text-primary border border-primary/20"
                  )}
                  onClick={() => {
                    setActiveView(item.id);
                    onClose();
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Status */}
          <div className="p-4 border-t border-border/50">
            <div className="energy-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">System Status</span>
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              </div>
              <p className="text-sm font-medium">All Systems Online</p>
              <p className="text-xs text-muted-foreground mt-1">Last updated: 2s ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};