import { YearlyProjection, CashflowProjectionParams } from "@/types/finance";

export const formatIDR = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatShortIDR = (value: number): string => {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "M";
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "jt";
  }
  return formatIDR(value);
};

export const calculateProjection = (params: CashflowProjectionParams): YearlyProjection[] => {
  const projections: YearlyProjection[] = [];
  let currentRevenue = params.baseRevenue;
  let currentCost = params.baseCost;
  let cumulativeCash = 0;

  for (let i = 1; i <= params.years; i++) {
    // Simple compound growth
    currentRevenue = currentRevenue * (1 + params.revenueGrowth / 100);
    currentCost = currentCost * (1 + params.costGrowth / 100);
    
    const netCashflow = currentRevenue - currentCost;
    cumulativeCash += netCashflow;

    projections.push({
      year: i,
      revenue: currentRevenue,
      cost: currentCost,
      netCashflow,
      cumulativeCash,
    });
  }

  return projections;
};
