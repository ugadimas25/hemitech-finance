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
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100/50 dark:bg-emerald-500/10",
      desc: "Projected yearly income"
    },
    {
      title: "Total Cost",
      value: summary.totalCost,
      icon: TrendingDown,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-100/50 dark:bg-rose-500/10",
      desc: "OPEX + CAPEX + Resources"
    },
    {
      title: "Net Profit",
      value: netProfit,
      icon: Wallet,
      color: isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
      bg: isProfit ? "bg-emerald-100/50 dark:bg-emerald-500/10" : "bg-rose-100/50 dark:bg-rose-500/10",
      desc: "Income - Cost"
    },
    {
      title: "Revenue Gap (Cost - Income)",
      value: summary.revenue,
      icon: DollarSign,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100/50 dark:bg-blue-500/10",
      desc: "Funding needed"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="border-none shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
          <div className={cn("absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity", card.color)}>
             <card.icon className="w-24 h-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn("p-2 rounded-full shadow-sm", card.bg)}>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold tracking-tight">
              {formatShortIDR(card.value)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {card.desc}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
