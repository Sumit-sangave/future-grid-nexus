import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

interface ChartData {
  time: string;
  solar: number;
  wind: number;
  battery: number;
  grid: number;
}

const generateChartData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      solar: hour >= 6 && hour <= 18 ? Math.random() * 150 + 50 : Math.random() * 10,
      wind: Math.random() * 80 + 20,
      battery: Math.random() * 100 + 50,
      grid: Math.random() * 200 + 100
    });
  }
  
  return data;
};

export const EnergyCharts = () => {
  const [chartData, setChartData] = useState<ChartData[]>(generateChartData());

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        newData.shift(); // Remove first element
        
        const now = new Date();
        const hour = now.getHours();
        
        newData.push({
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          solar: hour >= 6 && hour <= 18 ? Math.random() * 150 + 50 : Math.random() * 10,
          wind: Math.random() * 80 + 20,
          battery: Math.random() * 100 + 50,
          grid: Math.random() * 200 + 100
        });
        
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentData = chartData[chartData.length - 1];
  
  const barData = [
    { name: 'Solar', value: currentData?.solar || 0, fill: 'hsl(var(--solar))' },
    { name: 'Wind', value: currentData?.wind || 0, fill: 'hsl(var(--wind))' },
    { name: 'Battery', value: currentData?.battery || 0, fill: 'hsl(var(--battery))' },
    { name: 'Grid', value: currentData?.grid || 0, fill: 'hsl(var(--grid))' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Real-time Line Chart */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Real-time Energy Flow</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Live Updates
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Line 
                  type="monotone" 
                  dataKey="solar" 
                  stroke="hsl(var(--solar))" 
                  strokeWidth={2}
                  dot={false}
                  name="Solar"
                />
                <Line 
                  type="monotone" 
                  dataKey="wind" 
                  stroke="hsl(var(--wind))" 
                  strokeWidth={2}
                  dot={false}
                  name="Wind"
                />
                <Line 
                  type="monotone" 
                  dataKey="battery" 
                  stroke="hsl(var(--battery))" 
                  strokeWidth={2}
                  dot={false}
                  name="Battery"
                />
                <Line 
                  type="monotone" 
                  dataKey="grid" 
                  stroke="hsl(var(--grid))" 
                  strokeWidth={2}
                  dot={false}
                  name="Grid"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Current Output Bar Chart */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle>Current Energy Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4">
            {barData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium">{item.value.toFixed(1)} kW</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};