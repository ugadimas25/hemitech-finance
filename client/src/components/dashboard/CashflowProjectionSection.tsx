import { useState, useMemo } from "react";
import { CashflowProjectionParams } from "@/types/finance";
import { calculateProjection, formatShortIDR, formatIDR } from "@/utils/finance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, ComposedChart 
} from "recharts";

interface CashflowProjectionSectionProps {
  initialParams: CashflowProjectionParams;
}

export function CashflowProjectionSection({ initialParams }: CashflowProjectionSectionProps) {
  const [params, setParams] = useState<CashflowProjectionParams>(initialParams);

  const projections = useMemo(() => calculateProjection(params), [params]);

  const handleChange = (field: keyof CashflowProjectionParams, value: number) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Projection Parameters</CardTitle>
            <CardDescription>Adjust assumptions to see impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Revenue Growth (Yearly %)</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[params.revenueGrowth]} 
                  min={0} 
                  max={200} 
                  step={1} 
                  onValueChange={(vals) => handleChange("revenueGrowth", vals[0])} 
                  className="flex-1"
                />
                <span className="w-12 font-mono text-right">{params.revenueGrowth}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cost Growth (Yearly %)</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[params.costGrowth]} 
                  min={0} 
                  max={100} 
                  step={1} 
                  onValueChange={(vals) => handleChange("costGrowth", vals[0])} 
                  className="flex-1"
                />
                <span className="w-12 font-mono text-right">{params.costGrowth}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Projection Period (Years)</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[params.years]} 
                  min={3} 
                  max={10} 
                  step={1} 
                  onValueChange={(vals) => handleChange("years", vals[0])} 
                  className="flex-1"
                />
                <span className="w-12 font-mono text-right">{params.years}y</span>
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-4">
               <div>
                 <Label className="text-xs text-muted-foreground">Base Revenue (Year 0)</Label>
                 <div className="font-mono font-medium">{formatIDR(params.baseRevenue)}</div>
               </div>
               <div>
                 <Label className="text-xs text-muted-foreground">Base Cost (Year 0)</Label>
                 <div className="font-mono font-medium">{formatIDR(params.baseCost)}</div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cashflow Forecast</CardTitle>
            <CardDescription>Revenue vs Cost vs Net Cashflow</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projections} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }} />
                <YAxis tickFormatter={(val) => formatShortIDR(val)} width={80} />
                <Tooltip 
                  labelFormatter={(val) => `Year ${val}`}
                  formatter={(val: number) => formatIDR(val)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" fill="var(--color-chart-2)" stroke="var(--color-chart-2)" fillOpacity={0.1} />
                <Area type="monotone" dataKey="cost" name="Cost" fill="var(--color-chart-3)" stroke="var(--color-chart-3)" fillOpacity={0.1} />
                <Line type="monotone" dataKey="netCashflow" name="Net Cashflow" stroke="var(--color-primary)" strokeWidth={3} dot={{r: 4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cumulative Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Cash Position</CardTitle>
          <CardDescription>Total cash accumulation over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projections} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(val) => formatShortIDR(val)} width={80} />
              <Tooltip 
                 labelFormatter={(val) => `Year ${val}`}
                 formatter={(val: number) => formatIDR(val)}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="cumulativeCash" name="Cumulative Cash" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorCumulative)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projection Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Year</th>
                  <th className="py-2 px-4">Revenue</th>
                  <th className="py-2 px-4">Cost</th>
                  <th className="py-2 px-4">Net Cashflow</th>
                  <th className="py-2 px-4">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p) => (
                  <tr key={p.year} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="text-left py-2 px-4 font-medium">Year {p.year}</td>
                    <td className="py-2 px-4 text-emerald-600">{formatIDR(p.revenue)}</td>
                    <td className="py-2 px-4 text-rose-600">{formatIDR(p.cost)}</td>
                    <td className={p.netCashflow >= 0 ? "py-2 px-4 font-bold text-emerald-600" : "py-2 px-4 font-bold text-rose-600"}>
                      {formatIDR(p.netCashflow)}
                    </td>
                    <td className="py-2 px-4 font-mono">{formatIDR(p.cumulativeCash)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
