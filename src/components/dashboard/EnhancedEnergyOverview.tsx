import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sun, Wind, Battery, Zap, TrendingUp, Leaf, DollarSign, CloudSun, Gauge, Clock, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EnergyData {
  solar: number;
  wind: number;
  battery: number;
  grid: number;
  total: number;
  efficiency: number;
}

interface CampusMetrics {
  co2_saved_kg: number;
  cost_savings_usd: number;
  total_generated_kwh: number;
  total_consumed_kwh: number;
  battery_charge_percent: number;
  battery_runtime_hours: number;
  battery_health_percent: number;
  forecast_generation_kwh: number;
  forecast_demand_kwh: number;
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

// Speedometer component
const Speedometer = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
  const percentage = (value / max) * 100;
  const rotation = (percentage / 100) * 180 - 90;
  
  return (
    <div className="relative w-32 h-16 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 50">
        <path
          d="M 10 40 A 30 30 0 0 1 90 40"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 10 40 A 30 30 0 0 1 90 40"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${percentage * 1.26} 126`}
          className="transition-all duration-1000"
        />
        <circle cx="50" cy="40" r="3" fill={color} />
        <line
          x1="50"
          y1="40"
          x2="50"
          y2="20"
          stroke={color}
          strokeWidth="2"
          transform={`rotate(${rotation} 50 40)`}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <div className="text-lg font-bold">{value.toFixed(1)}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

export const EnhancedEnergyOverview = () => {
  const [data, setData] = useState<EnergyData>(generateMockData());
  const [metrics, setMetrics] = useState<CampusMetrics | null>(null);

  useEffect(() => {
    // Fetch campus metrics
    const fetchMetrics = async () => {
      const { data: metricsData } = await supabase
        .from('campus_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (metricsData) {
        setMetrics(metricsData);
      }
    };

    fetchMetrics();

    // Update real-time energy data
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
      {/* Today's Energy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="energy-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Energy Overview</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {metrics?.total_generated_kwh.toFixed(1) || '0'} kWh
                </div>
                <div className="text-sm text-muted-foreground">Total Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-1">
                  {metrics?.total_consumed_kwh.toFixed(1) || '0'} kWh
                </div>
                <div className="text-sm text-muted-foreground">Total Consumed</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Efficiency</span>
                <span className="font-semibold text-primary">{data.efficiency}%</span>
              </div>
              <Progress value={data.efficiency} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="energy-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CloudSun className="w-5 h-5" />
              <span>Tomorrow's Forecast</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {metrics?.forecast_generation_kwh.toFixed(1) || '0'} kWh
                </div>
                <div className="text-sm text-muted-foreground">Expected Generation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {metrics?.forecast_demand_kwh.toFixed(1) || '0'} kWh
                </div>
                <div className="text-sm text-muted-foreground">Campus Demand</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 text-center">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Sunny & Windy
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental & Financial Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="energy-card border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Leaf className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {metrics?.co2_saved_kg.toFixed(1) || '0'} kg
                  </div>
                  <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-success">+8.5% this month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="energy-card border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    ${metrics?.cost_savings_usd.toFixed(0) || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Cost Savings</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-accent">+12.3% this month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Battery System Status */}
      <Card className="energy-card border-battery/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Battery className="w-5 h-5" />
            <span>Battery System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Speedometer 
                value={metrics?.battery_charge_percent || 78} 
                max={100} 
                label="Charge %" 
                color="hsl(var(--battery))" 
              />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{metrics?.battery_runtime_hours || 12}h</span>
              </div>
              <div className="text-sm text-muted-foreground">Expected Runtime</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="w-5 h-5 text-success mr-2" />
                <span className="text-2xl font-bold text-success">{metrics?.battery_health_percent || 96}%</span>
              </div>
              <div className="text-sm text-muted-foreground">Health Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Energy Generation */}
      <Card className="energy-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Energy Generation</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {data.total} kW Total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {energySources.map((source) => {
              const Icon = source.icon;
              return (
                <Card key={source.name} className={`energy-card ${source.borderColor}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${source.bgColor}`}>
                        <Icon className={`w-4 h-4 ${source.color}`} />
                      </div>
                      <Badge 
                        variant={source.status === "active" || source.status === "high" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {source.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xl font-bold mb-1">
                        {source.value} <span className="text-xs text-muted-foreground">{source.unit}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{source.name}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};