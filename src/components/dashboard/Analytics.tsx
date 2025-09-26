import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";
import { 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Leaf, 
  DollarSign,
  Calendar,
  BarChart3
} from "lucide-react";

const monthlyData = [
  { month: "Jan", solar: 2800, wind: 1200, battery: 800, grid: 3200, cost: 1200, carbon: 5.2 },
  { month: "Feb", solar: 3100, wind: 1350, battery: 900, grid: 2900, cost: 1050, carbon: 4.8 },
  { month: "Mar", solar: 3800, wind: 1100, battery: 950, grid: 2700, cost: 980, carbon: 4.3 },
  { month: "Apr", solar: 4200, wind: 1400, battery: 1000, grid: 2400, cost: 850, carbon: 3.9 },
  { month: "May", solar: 4800, wind: 1250, battery: 1100, grid: 2200, cost: 780, carbon: 3.4 },
  { month: "Jun", solar: 5200, wind: 1350, battery: 1200, grid: 2000, cost: 720, carbon: 3.1 }
];

const energySourceDistribution = [
  { name: "Solar", value: 45, fill: "hsl(var(--solar))" },
  { name: "Wind", value: 15, fill: "hsl(var(--wind))" },
  { name: "Battery", value: 12, fill: "hsl(var(--battery))" },
  { name: "Grid", value: 28, fill: "hsl(var(--grid))" }
];

const weeklyEfficiency = [
  { day: "Mon", efficiency: 87 },
  { day: "Tue", efficiency: 92 },
  { day: "Wed", efficiency: 89 },
  { day: "Thu", efficiency: 94 },
  { day: "Fri", efficiency: 91 },
  { day: "Sat", efficiency: 88 },
  { day: "Sun", efficiency: 85 }
];

export const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  
  const costChange = ((currentMonth.cost - previousMonth.cost) / previousMonth.cost) * 100;
  const carbonReduction = ((previousMonth.carbon - currentMonth.carbon) / previousMonth.carbon) * 100;
  
  const totalRenewable = currentMonth.solar + currentMonth.wind + currentMonth.battery;
  const totalEnergy = totalRenewable + currentMonth.grid;
  const renewablePercentage = (totalRenewable / totalEnergy) * 100;

  const downloadReport = (format: 'csv' | 'pdf') => {
    // Simulate download
    const filename = `energy-report-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Downloading ${filename}...`);
    // In a real implementation, this would trigger the actual download
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="energy-card border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Leaf className="w-8 h-8 text-success" />
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                +{carbonReduction.toFixed(1)}%
              </Badge>
            </div>
            <div className="text-2xl font-bold">{renewablePercentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Renewable Energy</div>
          </CardContent>
        </Card>

        <Card className="energy-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-primary" />
              <Badge variant="outline" className={`${
                costChange < 0 ? "bg-success/10 text-success border-success/20" : 
                "bg-warning/10 text-warning border-warning/20"
              }`}>
                {costChange > 0 ? '+' : ''}{costChange.toFixed(1)}%
              </Badge>
            </div>
            <div className="text-2xl font-bold">${currentMonth.cost}</div>
            <div className="text-sm text-muted-foreground">Monthly Cost</div>
          </CardContent>
        </Card>

        <Card className="energy-card border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Leaf className="w-8 h-8 text-accent" />
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
            <div className="text-2xl font-bold">{currentMonth.carbon.toFixed(1)}t</div>
            <div className="text-sm text-muted-foreground">CO₂ Emissions</div>
          </CardContent>
        </Card>

        <Card className="energy-card border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-warning" />
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="text-2xl font-bold">92.1%</div>
            <div className="text-sm text-muted-foreground">Avg Efficiency</div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selection */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Analytics Period</span>
            <div className="flex space-x-2">
              <Button
                variant={selectedPeriod === "1month" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("1month")}
              >
                1 Month
              </Button>
              <Button
                variant={selectedPeriod === "6months" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("6months")}
              >
                6 Months
              </Button>
              <Button
                variant={selectedPeriod === "1year" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("1year")}
              >
                1 Year
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Energy Production Trends */}
        <Card className="energy-card">
          <CardHeader>
            <CardTitle>Energy Production Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Line type="monotone" dataKey="solar" stroke="hsl(var(--solar))" strokeWidth={2} />
                  <Line type="monotone" dataKey="wind" stroke="hsl(var(--wind))" strokeWidth={2} />
                  <Line type="monotone" dataKey="battery" stroke="hsl(var(--battery))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Energy Source Distribution */}
        <Card className="energy-card">
          <CardHeader>
            <CardTitle>Current Energy Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={energySourceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {energySourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {energySourceDistribution.map((source) => (
                <div key={source.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: source.fill }}
                  />
                  <span className="text-sm">{source.name}: {source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Analysis */}
        <Card className="energy-card">
          <CardHeader>
            <CardTitle>Cost & Savings Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Efficiency */}
        <Card className="energy-card">
          <CardHeader>
            <CardTitle>Weekly Efficiency Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyEfficiency.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <Progress value={day.efficiency} className="h-2" />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{day.efficiency}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Reports */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Download Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg border-border/50">
              <h4 className="font-medium mb-2">Monthly Energy Report</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive energy usage, production, and efficiency metrics
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => downloadReport('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadReport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg border-border/50">
              <h4 className="font-medium mb-2">Carbon Impact Summary</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Environmental impact and carbon footprint analysis
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => downloadReport('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadReport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};