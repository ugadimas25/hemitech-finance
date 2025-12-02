import { Employee } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatIDR, formatShortIDR } from "@/utils/finance";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Users } from "lucide-react";

interface EmployeesSectionProps {
  employees: Employee[];
}

export function EmployeesSection({ employees }: EmployeesSectionProps) {
  const totalEmployees = employees.reduce((acc, emp) => acc + emp.qty, 0);
  const totalSalaryYear = employees.reduce((acc, emp) => acc + emp.totalSalaryYear, 0);
  const totalMonthlyWageBill = employees.reduce((acc, emp) => acc + emp.totalSalaryMonth, 0);

  // Chart data: Cost by Role
  const costByRole = employees.map(emp => ({
    name: emp.role,
    value: emp.totalSalaryYear
  }));

  const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Headcount</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{totalEmployees}</div>
             <p className="text-xs text-muted-foreground">Full-time employees</p>
           </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Monthly Wage Bill</CardTitle>
             <div className="h-4 w-4 text-muted-foreground font-mono">Rp</div>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{formatShortIDR(totalMonthlyWageBill)}</div>
             <p className="text-xs text-muted-foreground">Basic salary total</p>
           </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Yearly Cost</CardTitle>
             <div className="h-4 w-4 text-muted-foreground font-mono">Rp</div>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{formatShortIDR(totalSalaryYear)}</div>
             <p className="text-xs text-muted-foreground">Including THR & Benefits</p>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Staff Directory & Compensation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Monthly Salary</TableHead>
                  <TableHead className="text-right">Total Yearly</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.role}</TableCell>
                    <TableCell className="text-muted-foreground">{emp.level}</TableCell>
                    <TableCell className="text-right">{emp.qty}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{formatIDR(emp.salaryMonth)}</TableCell>
                    <TableCell className="text-right font-mono">{formatIDR(emp.totalSalaryYear)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Cost Distribution</CardTitle>
            <CardDescription>Salary Budget Allocation</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByRole}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => formatShortIDR(val)} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
