import { OpexItem } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatIDR, formatShortIDR } from "@/utils/finance";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface OpexSectionProps {
  items: OpexItem[];
}

export function OpexSection({ items }: OpexSectionProps) {
  const totalMonthly = items.reduce((acc, item) => acc + item.totalBulanan, 0);
  const totalYearly = items.reduce((acc, item) => acc + item.totalTahunan, 0);

  // Group by category
  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.kategori);
    if (existing) {
      existing.monthly += item.totalBulanan;
      existing.yearly += item.totalTahunan;
    } else {
      acc.push({ name: item.kategori, monthly: item.totalBulanan, yearly: item.totalTahunan });
    }
    return acc;
  }, [] as { name: string; monthly: number; yearly: number }[]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Burn Rate</CardTitle>
            <CardDescription>Operational expenses per month</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold text-rose-600">{formatIDR(totalMonthly)}</div>
             <p className="text-muted-foreground mt-2 text-sm">Recurring monthly costs excluding salaries.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Yearly Projection</CardTitle>
            <CardDescription>Total OPEX for 12 months</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold">{formatIDR(totalYearly)}</div>
             <p className="text-muted-foreground mt-2 text-sm">Impact on annual bottom line.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>Cost Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => formatShortIDR(val)} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(val: number) => formatIDR(val)}
              />
              <Legend />
              <Bar dataKey="monthly" name="Monthly" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="yearly" name="Yearly" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OPEX Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Monthly Cost</TableHead>
                <TableHead className="text-right">Yearly Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.kategori}</TableCell>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="text-right font-mono">{formatIDR(item.totalBulanan)}</TableCell>
                  <TableCell className="text-right font-mono font-medium">{formatIDR(item.totalTahunan)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
