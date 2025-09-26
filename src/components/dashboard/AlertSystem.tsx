import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, Clock, Bell, BellOff } from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  source: "solar" | "wind" | "battery" | "grid" | "system";
  timestamp: Date;
  acknowledged: boolean;
}

const generateRandomAlerts = (): Alert[] => {
  const alertTypes = [
    {
      type: "critical" as const,
      title: "Battery System Critical",
      message: "Battery charge level below 15%. Immediate attention required.",
      source: "battery" as const
    },
    {
      type: "warning" as const,
      title: "Solar Panel Efficiency Drop",
      message: "Solar panel output 20% below expected. Check for obstructions.",
      source: "solar" as const
    },
    {
      type: "warning" as const,
      title: "Grid Connection Unstable",
      message: "Intermittent grid connection detected. Monitoring situation.",
      source: "grid" as const
    },
    {
      type: "info" as const,
      title: "Wind Turbine Maintenance Due",
      message: "Scheduled maintenance window approaching in 2 days.",
      source: "wind" as const
    }
  ];

  return alertTypes.map((alert, index) => ({
    id: `alert-${index}`,
    ...alert,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    acknowledged: Math.random() > 0.7
  }));
};

export const AlertSystem = () => {
  const [alerts, setAlerts] = useState<Alert[]>(generateRandomAlerts());
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: Math.random() > 0.5 ? "warning" : "info",
          title: "System Update",
          message: "New energy optimization parameters applied.",
          source: "system",
          timestamp: new Date(),
          acknowledged: false
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case "critical":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "info":
        return <CheckCircle className="w-5 h-5 text-primary" />;
    }
  };

  const getAlertBadgeVariant = (type: Alert['type']) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      case "info":
        return "outline";
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.type === "critical" && !alert.acknowledged);
  const warningAlerts = alerts.filter(alert => alert.type === "warning" && !alert.acknowledged);

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="energy-card border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-destructive">{criticalAlerts.length}</div>
                <div className="text-sm text-muted-foreground">Critical Alerts</div>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="energy-card border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-warning">{warningAlerts.length}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="energy-card border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-success">98.2%</div>
                <div className="text-sm text-muted-foreground">System Health</div>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Settings */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Alert Settings</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center space-x-2"
            >
              {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span>{soundEnabled ? "Disable" : "Enable"} Sounds</span>
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Active Alerts */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle>Active Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
              <p>No active alerts. All systems operating normally.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.acknowledged ? 'opacity-60 bg-muted/20' : 'bg-card'
              } ${
                alert.type === 'critical' ? 'border-destructive/20' :
                alert.type === 'warning' ? 'border-warning/20' : 'border-border'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant={getAlertBadgeVariant(alert.type)} className="text-xs">
                          {alert.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.source}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};