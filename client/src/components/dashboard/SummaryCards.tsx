import { Summary } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortIDR } from "@/utils/finance";
import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  summary: Summary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const netProfit = summary.totalIncome - summary.totalCost;
  const isProfit = netProfit >= 0;

  const cards = [
    {
      title: "Total Income",
      value: summary.totalIncome,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      desc: "Projected yearly income"
    },
    {
      title: "Total Cost",
      value: summary.totalCost,
      icon: TrendingDown,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
      desc: "OPEX + CAPEX + Resources"
    },
    {
      title: "Net Profit",
      value: netProfit,
      icon: Wallet,
      color: isProfit ? "text-emerald-600" : "text-rose-600",
      bg: isProfit ? "bg-emerald-500/10" : "bg-rose-500/10",
      desc: "Income - Cost"
    },
    {
      title: "Revenue",
      value: summary.revenue,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      desc: "Gross revenue target"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn("p-2 rounded-full", card.bg)}>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatShortIDR(card.value)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.desc}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
