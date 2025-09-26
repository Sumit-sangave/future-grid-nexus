import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Wind, Battery, Zap, TrendingUp, TrendingDown } from "lucide-react";

interface EnergyData {
  solar: number;
  wind: number;
  battery: number;
  grid: number;
  total: number;
  efficiency: number;
}

const generateMockData = (): EnergyData => {
  const hour = new Date().getHours();
  const solar = hour >= 6 && hour <= 18 ? Math.random() * 150 + 50 : 0;
  const wind = Math.random() * 80 + 20;
  const battery = Math.random() * 100 + 50;
  const grid = Math.random() * 200 + 100;
  
  return {
    solar: Number(solar.toFixed(1)),
    wind: Number(wind.toFixed(1)),
    battery: Number(battery.toFixed(1)),
    grid: Number(grid.toFixed(1)),
    total: Number((solar + wind + battery + grid).toFixed(1)),
    efficiency: Number((85 + Math.random() * 10).toFixed(1))
  };
};

export const EnergyOverview = () => {
  const [data, setData] = useState<EnergyData>(generateMockData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const energySources = [
    {
      name: "Solar",
      value: data.solar,
      icon: Sun,
      color: "text-solar",
      bgColor: "bg-solar/10",
      borderColor: "border-solar/20",
      unit: "kW",
      status: data.solar > 0 ? "active" : "inactive"
    },
    {
      name: "Wind",
      value: data.wind,
      icon: Wind,
      color: "text-wind",
      bgColor: "bg-wind/10",
      borderColor: "border-wind/20", 
      unit: "kW",
      status: "active"
    },
    {
      name: "Battery",
      value: data.battery,
      icon: Battery,
      color: "text-battery",
      bgColor: "bg-battery/10",
      borderColor: "border-battery/20",
      unit: "kW",
      status: data.battery > 70 ? "high" : data.battery > 30 ? "medium" : "low"
    },
    {
      name: "Grid",
      value: data.grid,
      icon: Zap,
      color: "text-grid",
      bgColor: "bg-muted/50",
      borderColor: "border-grid/20",
      unit: "kW",
      status: "connected"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Total Energy Card */}
      <Card className="energy-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total Energy Output</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="text-4xl font-bold text-primary mb-2">
                {data.total} <span className="text-xl text-muted-foreground">kW</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-success">+12.5%</span>
                <span className="text-muted-foreground">vs last hour</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{data.efficiency}%</div>
              <div className="text-sm text-muted-foreground">Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {energySources.map((source) => {
          const Icon = source.icon;
          return (
            <Card key={source.name} className={`energy-card ${source.borderColor}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${source.bgColor}`}>
                    <Icon className={`w-5 h-5 ${source.color}`} />
                  </div>
                  <Badge 
                    variant={source.status === "active" || source.status === "high" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {source.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">
                    {source.value} <span className="text-sm text-muted-foreground">{source.unit}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{source.name} Power</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};