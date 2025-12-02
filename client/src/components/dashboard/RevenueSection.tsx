import { RevenueSummary } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatIDR } from "@/utils/finance";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface RevenueSectionProps {
  revenue: RevenueSummary;
}

export function RevenueSection({ revenue }: RevenueSectionProps) {
  const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="bg-emerald-500/5 border-emerald-200 dark:border-emerald-800">
           <CardHeader>
             <CardTitle className="text-emerald-700 dark:text-emerald-400">Total Monthly Revenue</CardTitle>
             <CardDescription>Projected Recurring Revenue</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">{formatIDR(revenue.totalMonthly)}</div>
           </CardContent>
         </Card>
         <Card className="bg-blue-500/5 border-blue-200 dark:border-blue-800">
           <CardHeader>
             <CardTitle className="text-blue-700 dark:text-blue-400">Total Yearly Revenue</CardTitle>
             <CardDescription>Annual Run Rate</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold text-blue-700 dark:text-blue-400">{formatIDR(revenue.totalYearly)}</div>
           </CardContent>
         </Card>
       </div>

       <Card>
         <CardHeader>
           <CardTitle>Revenue Streams</CardTitle>
           <CardDescription>Breakdown by source (Yearly)</CardDescription>
         </CardHeader>
         <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue.streams} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => "Rp " + (val/1000000).toFixed(0) + "jt"} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   formatter={(val: number) => formatIDR(val)}
                />
                <Bar dataKey="yearly" radius={[8, 8, 0, 0]} barSize={60}>
                  {revenue.streams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
         </CardContent>
       </Card>
    </div>
  );
}
