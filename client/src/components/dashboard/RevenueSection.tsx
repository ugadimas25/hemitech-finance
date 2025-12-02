import { RevenueSummary } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatIDR } from "@/utils/finance";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RevenueSectionProps {
  revenue: RevenueSummary;
}

export function RevenueSection({ revenue }: RevenueSectionProps) {
  const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)'];

  // Prepare data for pie chart
  const pieData = revenue.streams.map((stream, index) => ({
    name: stream.name,
    value: stream.yearly,
    color: COLORS[index % COLORS.length]
  }));

  // Calculate monthly breakdown from yearly targets
  const monthlyBreakdown = revenue.streams.map(stream => {
    const residencePerMonth = (stream.residence || 0) / 12; // 100 residence / 12 months
    const revenuePerMonth = stream.monthly;
    
    // Generate 12 months of data with cumulative
    const months = [];
    let cumulativeRevenue = 0;
    let cumulativeResidence = 0;
    
    for (let i = 1; i <= 12; i++) {
      cumulativeResidence += residencePerMonth;
      cumulativeRevenue += revenuePerMonth;
      months.push({
        month: i,
        monthName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i - 1],
        residenceThisMonth: residencePerMonth,
        cumulativeResidence: cumulativeResidence,
        revenueThisMonth: revenuePerMonth,
        cumulativeRevenue: cumulativeRevenue
      });
    }
    
    return {
      streamName: stream.name,
      totalResidence: stream.residence || 0,
      residencePerMonth: residencePerMonth,
      revenuePerMonth: revenuePerMonth,
      months: months
    };
  });

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

       {/* Detailed Revenue Breakdown Table */}
       <Card>
         <CardHeader>
           <CardTitle>Revenue Details & Calculation</CardTitle>
           <CardDescription>Complete breakdown of revenue streams with unit economics</CardDescription>
         </CardHeader>
         <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead className="w-[180px]">Income Type</TableHead>
                 <TableHead className="text-right">Unit/Residence</TableHead>
                 <TableHead className="text-right">Residence</TableHead>
                 <TableHead className="text-right">Rate</TableHead>
                 <TableHead className="text-right">Avg Transaction</TableHead>
                 <TableHead className="text-right">Income/month</TableHead>
                 <TableHead className="text-right">Income/year</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {revenue.streams.map((stream) => (
                 <TableRow key={stream.id}>
                   <TableCell className="font-medium">
                     <div className="flex items-center gap-2">
                       <div 
                         className="w-3 h-3 rounded-full" 
                         style={{ backgroundColor: COLORS[revenue.streams.indexOf(stream) % COLORS.length] }}
                       />
                       {stream.name}
                     </div>
                   </TableCell>
                   <TableCell className="text-right font-mono">
                     {(stream.unitResidence || 0).toLocaleString('id-ID')}
                   </TableCell>
                   <TableCell className="text-right font-mono">
                     {(stream.residence || 0).toLocaleString('id-ID')}
                   </TableCell>
                   <TableCell className="text-right font-mono">
                     {stream.name === 'Payment Gateway' 
                       ? formatIDR(stream.paymentGateway || 0) 
                       : formatIDR(stream.subscriptionPerMonth || 0)}
                   </TableCell>
                   <TableCell className="text-right font-mono">
                     {stream.avgTransaction || 0}
                   </TableCell>
                   <TableCell className="text-right font-semibold">
                     <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                       {formatIDR(stream.monthly)}
                     </Badge>
                   </TableCell>
                   <TableCell className="text-right font-semibold">
                     <Badge variant="default" className="bg-blue-600">
                       {formatIDR(stream.yearly)}
                     </Badge>
                   </TableCell>
                 </TableRow>
               ))}
               {/* Total Row */}
               <TableRow className="bg-muted/50 font-bold border-t-2">
                 <TableCell colSpan={5} className="text-right">TOTAL</TableCell>
                 <TableCell className="text-right">
                   <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                     {formatIDR(revenue.totalMonthly)}
                   </Badge>
                 </TableCell>
                 <TableCell className="text-right">
                   <Badge variant="default" className="bg-blue-700">
                     {formatIDR(revenue.totalYearly)}
                   </Badge>
                 </TableCell>
               </TableRow>
             </TableBody>
           </Table>

           {/* Calculation Notes */}
           <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
             <h4 className="font-semibold mb-3 text-sm">📊 Calculation Formula:</h4>
             <div className="space-y-2 text-sm text-muted-foreground">
               {revenue.streams.map((stream) => (
                 <div key={stream.id} className="flex items-start gap-2">
                   <div 
                     className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" 
                     style={{ backgroundColor: COLORS[revenue.streams.indexOf(stream) % COLORS.length] }}
                   />
                   <div>
                     <span className="font-medium text-foreground">{stream.name}:</span>
                     {stream.name === 'Payment Gateway' ? (
                       <span className="ml-2">
                         {(stream.unitResidence || 0).toLocaleString('id-ID')} units × {formatIDR(stream.paymentGateway || 0)} × {stream.avgTransaction} transactions/month = {formatIDR(stream.monthly)}/month
                       </span>
                     ) : (
                       <span className="ml-2">
                         {(stream.unitResidence || 0).toLocaleString('id-ID')} units × {formatIDR(stream.subscriptionPerMonth || 0)}/month = {formatIDR(stream.monthly)}/month
                       </span>
                     )}
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </CardContent>
       </Card>

       {/* Monthly Revenue Breakdown - NEW SECTION */}
       <Card>
         <CardHeader>
           <CardTitle>Monthly Revenue Accumulation</CardTitle>
           <CardDescription>
             Breakdown: 100 residence per year = {(100/12).toFixed(2)} residence per month
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div className="space-y-6">
             {monthlyBreakdown.map((breakdown, streamIndex) => (
               <div key={breakdown.streamName} className="space-y-3">
                 <div className="flex items-center gap-3 pb-2 border-b">
                   <div 
                     className="w-4 h-4 rounded-full" 
                     style={{ backgroundColor: COLORS[streamIndex % COLORS.length] }}
                   />
                   <h4 className="font-semibold text-lg">{breakdown.streamName}</h4>
                   <Badge variant="outline" className="ml-auto">
                     {breakdown.totalResidence} residence/year
                   </Badge>
                   <Badge variant="default">
                     ~{breakdown.residencePerMonth.toFixed(2)} residence/month
                   </Badge>
                 </div>

                 <div className="overflow-x-auto">
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead className="w-[100px]">Month</TableHead>
                         <TableHead className="text-right">New Residence</TableHead>
                         <TableHead className="text-right">Cumulative Residence</TableHead>
                         <TableHead className="text-right">Revenue This Month</TableHead>
                         <TableHead className="text-right">Cumulative Revenue</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {breakdown.months.map((month) => (
                         <TableRow key={month.month}>
                           <TableCell className="font-medium">{month.monthName}</TableCell>
                           <TableCell className="text-right font-mono text-sm">
                             {month.residenceThisMonth.toFixed(2)}
                           </TableCell>
                           <TableCell className="text-right font-mono text-sm">
                             <Badge variant="outline">
                               {month.cumulativeResidence.toFixed(2)}
                             </Badge>
                           </TableCell>
                           <TableCell className="text-right font-semibold">
                             {formatIDR(month.revenueThisMonth)}
                           </TableCell>
                           <TableCell className="text-right font-bold">
                             <Badge variant="default" className="bg-emerald-600">
                               {formatIDR(month.cumulativeRevenue)}
                             </Badge>
                           </TableCell>
                         </TableRow>
                       ))}
                       {/* Total Row */}
                       <TableRow className="bg-muted/50 font-bold border-t-2">
                         <TableCell>TOTAL</TableCell>
                         <TableCell className="text-right">
                           {breakdown.totalResidence}
                         </TableCell>
                         <TableCell className="text-right">-</TableCell>
                         <TableCell className="text-right">
                           {formatIDR(breakdown.revenuePerMonth * 12)}
                         </TableCell>
                         <TableCell className="text-right">
                           <Badge variant="default" className="bg-blue-700">
                             {formatIDR(breakdown.revenuePerMonth * 12)}
                           </Badge>
                         </TableCell>
                       </TableRow>
                     </TableBody>
                   </Table>
                 </div>

                 {/* Mini Chart for this stream */}
                 <div className="h-[200px] mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={breakdown.months} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                       <XAxis dataKey="monthName" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                       <YAxis 
                         stroke="hsl(var(--muted-foreground))" 
                         fontSize={10}
                         tickFormatter={(val) => "Rp " + (val/1000000).toFixed(0) + "jt"}
                       />
                       <Tooltip 
                         formatter={(val: number) => formatIDR(val)}
                         contentStyle={{ borderRadius: '6px', fontSize: '12px' }}
                       />
                       <Bar 
                         dataKey="cumulativeRevenue" 
                         fill={COLORS[streamIndex % COLORS.length]} 
                         radius={[4, 4, 0, 0]}
                         name="Cumulative Revenue"
                       />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>

       {/* Charts Row */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Bar Chart */}
         <Card>
           <CardHeader>
             <CardTitle>Revenue Streams Comparison</CardTitle>
             <CardDescription>Yearly revenue by source</CardDescription>
           </CardHeader>
           <CardContent className="h-[350px]">
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

         {/* Pie Chart */}
         <Card>
           <CardHeader>
             <CardTitle>Revenue Distribution</CardTitle>
             <CardDescription>Percentage share by stream</CardDescription>
           </CardHeader>
           <CardContent className="h-[350px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => formatIDR(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
           </CardContent>
         </Card>
       </div>
    </div>
  );
}
