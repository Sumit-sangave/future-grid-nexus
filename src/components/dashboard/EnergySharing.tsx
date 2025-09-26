import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Share2, ArrowRight, CheckCircle, Clock, MapPin, Zap } from "lucide-react";

interface SharingOpportunity {
  id: string;
  target: string;
  type: "hostel" | "campus" | "building";
  distance: number;
  demandKw: number;
  availableKw: number;
  savings: number;
  status: "pending" | "active" | "completed";
  timestamp: Date;
}

interface SharedEnergy {
  id: string;
  target: string;
  amount: number;
  timestamp: Date;
  savings: number;
}

const generateSharingData = () => {
  const opportunities: SharingOpportunity[] = [
    {
      id: "1",
      target: "Engineering Hostel A",
      type: "hostel",
      distance: 0.8,
      demandKw: 45,
      availableKw: 60,
      savings: 12.5,
      status: "pending",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: "2", 
      target: "Administrative Building",
      type: "building",
      distance: 0.3,
      demandKw: 30,
      availableKw: 35,
      savings: 8.2,
      status: "active",
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: "3",
      target: "Medical Campus",
      type: "campus",
      distance: 2.1,
      demandKw: 80,
      availableKw: 85,
      savings: 22.1,
      status: "pending",
      timestamp: new Date(Date.now() - 900000)
    }
  ];

  const shared: SharedEnergy[] = [
    {
      id: "s1",
      target: "Student Hostel B",
      amount: 25,
      timestamp: new Date(Date.now() - 1800000),
      savings: 6.8
    },
    {
      id: "s2",
      target: "Library Complex",
      amount: 18,
      timestamp: new Date(Date.now() - 3600000),
      savings: 4.9
    }
  ];

  return { opportunities, shared };
};

export const EnergySharing = () => {
  const [data, setData] = useState(generateSharingData());
  const [currentExcess, setCurrentExcess] = useState(95);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExcess(85 + Math.random() * 20);
      
      if (Math.random() > 0.7) {
        const newOpportunity: SharingOpportunity = {
          id: `new-${Date.now()}`,
          target: `Building ${Math.floor(Math.random() * 20) + 1}`,
          type: "building",
          distance: Math.random() * 2,
          demandKw: Math.random() * 60 + 20,
          availableKw: Math.random() * 80 + 40,
          savings: Math.random() * 20 + 5,
          status: "pending",
          timestamp: new Date()
        };
        
        setData(prev => ({
          ...prev,
          opportunities: [newOpportunity, ...prev.opportunities.slice(0, 4)]
        }));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const approveSharing = (opportunityId: string) => {
    setData(prev => {
      const opportunity = prev.opportunities.find(o => o.id === opportunityId);
      if (!opportunity) return prev;

      const newShared: SharedEnergy = {
        id: `shared-${Date.now()}`,
        target: opportunity.target,
        amount: Math.min(opportunity.demandKw, opportunity.availableKw),
        timestamp: new Date(),
        savings: opportunity.savings
      };

      return {
        opportunities: prev.opportunities.map(o => 
          o.id === opportunityId ? { ...o, status: "active" as const } : o
        ),
        shared: [newShared, ...prev.shared.slice(0, 9)]
      };
    });
  };

  const totalSharedToday = data.shared.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings = data.shared.reduce((sum, item) => sum + item.savings, 0);

  return (
    <div className="space-y-6">
      {/* Energy Sharing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="energy-card border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-success">{currentExcess.toFixed(1)} kW</div>
              <Zap className="w-8 h-8 text-success" />
            </div>
            <div className="text-sm text-muted-foreground">Available to Share</div>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="energy-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-primary">{totalSharedToday.toFixed(1)} kW</div>
              <Share2 className="w-8 h-8 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Shared Today</div>
            <div className="text-xs text-success mt-1">+15% vs yesterday</div>
          </CardContent>
        </Card>

        <Card className="energy-card border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-accent">${totalSavings.toFixed(1)}</div>
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <div className="text-sm text-muted-foreground">Cost Savings</div>
            <div className="text-xs text-success mt-1">This month</div>
          </CardContent>
        </Card>
      </div>

      {/* Sharing Opportunities */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Energy Sharing Opportunities</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {data.opportunities.filter(o => o.status === "pending").length} Available
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.opportunities.map((opportunity) => (
            <div key={opportunity.id} className="p-4 border rounded-lg border-border/50 bg-card/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    opportunity.type === "hostel" ? "bg-blue-500/10" :
                    opportunity.type === "campus" ? "bg-green-500/10" : "bg-purple-500/10"
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{opportunity.target}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>{opportunity.distance.toFixed(1)} km away</span>
                      <span>Needs: {opportunity.demandKw} kW</span>
                      <span>Available: {opportunity.availableKw} kW</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-success">
                    ${opportunity.savings.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">savings</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant={
                    opportunity.status === "pending" ? "outline" :
                    opportunity.status === "active" ? "default" : "secondary"
                  }>
                    {opportunity.status}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {opportunity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                {opportunity.status === "pending" && (
                  <Button
                    onClick={() => approveSharing(opportunity.id)}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <span>Approve Sharing</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Sharing Activity */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle>Recent Energy Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          {data.shared.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No energy sharing activity yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.shared.map((share) => (
                <div key={share.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <div className="font-medium">Shared {share.amount} kW</div>
                      <div className="text-sm text-muted-foreground">to {share.target}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-success">+${share.savings.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">
                      {share.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};