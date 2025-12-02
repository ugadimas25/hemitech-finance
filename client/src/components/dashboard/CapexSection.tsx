import { CapexItem } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatIDR, formatShortIDR } from "@/utils/finance";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

interface CapexSectionProps {
  items: CapexItem[];
}

export function CapexSection({ items }: CapexSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const totalCapex = items.reduce((acc, item) => acc + item.total, 0);
  
  // Group by category for chart
  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.kategori);
    if (existing) {
      existing.value += item.total;
    } else {
      acc.push({ name: item.kategori, value: item.total });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const filteredItems = items.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Allocation by Category</CardTitle>
            <CardDescription>Total CAPEX Distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} interval={0} />
                <Tooltip 
                  formatter={(value: number) => formatShortIDR(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="flex-1 bg-primary text-primary-foreground border-none">
             <CardHeader>
               <CardTitle className="text-primary-foreground/80">Total CAPEX Requirement</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">{formatIDR(totalCapex)}</div>
               <p className="text-primary-foreground/60 mt-2">One-time setup costs and initial investments.</p>
             </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Largest Item</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold truncate">
                    {items.sort((a,b) => b.total - a.total)[0]?.item || "-"}
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {formatShortIDR(items.sort((a,b) => b.total - a.total)[0]?.total || 0)}
                  </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Items</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{items.length}</div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detailed Breakdown</CardTitle>
            <CardDescription>List of all capital expenditure items</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{item.kategori}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{item.description}</TableCell>
                  <TableCell className="text-right">{item.qty}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{formatIDR(item.hargaSatuan)}</TableCell>
                  <TableCell className="text-right font-mono font-medium">{formatIDR(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
