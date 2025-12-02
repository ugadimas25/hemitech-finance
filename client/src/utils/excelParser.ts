import * as XLSX from 'xlsx';
import { HemitechData, Summary, CapexItem, OpexItem, Employee, RevenueSummary, RevenueStream } from '@/types/finance';

// Helper to find a cell value by searching for a label in a specific column
const findValueByLabel = (data: any[][], label: string, labelColIndex: number, valueColIndex: number): number => {
  const row = data.find(r => r[labelColIndex] && String(r[labelColIndex]).includes(label));
  return row ? Number(row[valueColIndex]) || 0 : 0;
};

const cleanNumber = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    return Number(val.replace(/[^0-9.-]+/g, "")) || 0;
  }
  return 0;
};

export const parseHemitechExcel = (workbook: XLSX.WorkBook): HemitechData => {
  const sheets = workbook.Sheets;
  
  // --- 1. SUMMARY ---
  const summarySheet = sheets['SUMMARY'];
  const summaryData = XLSX.utils.sheet_to_json(summarySheet, { header: 1 }) as any[][];
  
  // Based on inspection:
  // Row 1 (index 1): [null, "Resource", 1584000000]
  // Row 2 (index 2): [null, "OPEX", 1050000000]
  // Row 3 (index 3): [null, "CAPEX", 404000000]
  // Row 4 (index 4): ["Total Cost", null, 3038000000]
  
  // We'll search for these labels to be safe
  const resourceCost = findValueByLabel(summaryData, "Resource", 1, 2);
  const opexCost = findValueByLabel(summaryData, "OPEX", 1, 2);
  const capexCost = findValueByLabel(summaryData, "CAPEX", 1, 2);
  const totalCost = findValueByLabel(summaryData, "Total Cost", 0, 2);
  const totalIncome = findValueByLabel(summaryData, "Total Income", 0, 2) || findValueByLabel(summaryData, "Total Income", 1, 2) || 0;
  const revenue = findValueByLabel(summaryData, "Revenue", 0, 2) || findValueByLabel(summaryData, "Revenue", 1, 2) || 0;

  const summary: Summary = {
    totalCost: totalCost || (resourceCost + opexCost + capexCost),
    totalIncome,
    revenue,
    resourceCost,
    opexCost,
    capexCost
  };

  // --- 2. CAPEX ---
  const capexSheet = sheets['CAPEX (Setup Awal)'];
  // Headers at row 0: Kategori, Item, Description, Qty, Harga Satuan (Rp), Total (Rp)
  const capexJson = XLSX.utils.sheet_to_json(capexSheet, { header: 0 }) as any[];
  
  const capex: CapexItem[] = capexJson.map((row, idx) => ({
    id: `c-${idx}`,
    kategori: row['Kategori'] || 'Uncategorized',
    item: row['Item'] || 'Unnamed Item',
    description: row['Description'] || '',
    qty: cleanNumber(row['Qty']),
    hargaSatuan: cleanNumber(row['Harga Satuan (Rp)']),
    total: cleanNumber(row['Total (Rp)'])
  })).filter(item => item.total > 0); // Filter out empty rows

  // --- 3. OPEX ---
  const opexSheet = sheets['OPEX (Bulanan & Tahunan)'];
  // Headers at row 0: Kategori, Item, Total Bulanan (Rp), Total Tahunan (Rp)
  const opexJson = XLSX.utils.sheet_to_json(opexSheet, { header: 0 }) as any[];

  const opex: OpexItem[] = opexJson.map((row, idx) => ({
    id: `o-${idx}`,
    kategori: row['Kategori'] || 'Uncategorized',
    item: row['Item'] || 'Unnamed Item',
    totalBulanan: cleanNumber(row['Total Bulanan (Rp)']),
    totalTahunan: cleanNumber(row['Total Tahunan (Rp)'])
  })).filter(item => item.totalBulanan > 0);

  // --- 4. PEGAWAI ---
  const pegawaiSheet = sheets['Pegawai'];
  const pegawaiData = XLSX.utils.sheet_to_json(pegawaiSheet, { header: 1 }) as any[][];
  
  // We inspected and saw data starts roughly at index 2 or 3
  // Headers are messy. Let's assume column indices based on inspection.
  // A(0): Level? B(1): Role? D(3): Qty, E(4): Salary, G(6): Total Year
  // We will skip the first few header rows.
  
  const employees: Employee[] = [];
  let startRowIndex = 0;
  
  // Find the header row that contains "Qty"
  pegawaiData.forEach((row, idx) => {
    if (row.some(cell => String(cell).includes("Qty"))) {
      startRowIndex = idx + 1;
    }
  });

  for (let i = startRowIndex; i < pegawaiData.length; i++) {
    const row = pegawaiData[i];
    if (!row || row.length === 0) continue;

    // Heuristic: Check if Qty (col 3) is a number
    const qty = cleanNumber(row[3]);
    const role = row[1] || row[2]; // Role might be in col 1 or 2 depending on merge
    
    if (qty > 0 && role) {
      employees.push({
        id: `e-${i}`,
        level: row[0] || 'Staff',
        role: String(role),
        qty: qty,
        salaryMonth: cleanNumber(row[4]),
        totalSalaryMonth: cleanNumber(row[5]),
        totalSalaryYear: cleanNumber(row[6]),
        thrBenefit: cleanNumber(row[7])
      });
    }
  }

  // --- 5. REVENUE ---
  const revenueSheet = sheets['Revenue'];
  const revenueData = XLSX.utils.sheet_to_json(revenueSheet, { header: 1 }) as any[][];
  
  // We need to find specific rows.
  // Looking for "Income/month" and "Income/year"
  // And revenue streams.
  
  // Let's try to find the Total rows first
  const totalMonthly = findValueByLabel(revenueData, "Income/month", 0, 1) || 
                       findValueByLabel(revenueData, "Income/month", 1, 2) || 0; // Try different col combos
                       
  const totalYearly = findValueByLabel(revenueData, "Income/year", 0, 1) || 
                      findValueByLabel(revenueData, "Income/year", 1, 2) || 0;

  // For streams, this is tricky without a strict structure. 
  // We'll grab a few known ones if they exist or just use what we found.
  // If totals are 0, we might need to look harder.
  
  // Let's assume a simple structure for streams: anything with a value in the yearly column that isn't a total row
  const streams: RevenueStream[] = [];
  
  // Mocking streams extraction if we can't identify them easily, 
  // or just grabbing rows that look like data.
  // For this specific file, we saw "Payment Gateway Fees" in the logs.
  
  // Simple heuristic: If column A has text and Column B/C has numbers, and it's not "Total"
  revenueData.forEach((row, idx) => {
    const label = String(row[0] || "");
    if (!label || label.includes("Total") || label.includes("Income/")) return;
    
    const val = cleanNumber(row[1]) || cleanNumber(row[2]); // Check col B or C
    if (val > 1000000) { // Assuming meaningful revenue > 1M
       streams.push({
         id: `r-${idx}`,
         name: label,
         monthly: val / 12, // Estimate
         yearly: val
       });
    }
  });
  
  // Fallback if streams empty but we have totals
  if (streams.length === 0 && totalYearly > 0) {
    streams.push({ id: 'r-main', name: 'Main Revenue', monthly: totalMonthly, yearly: totalYearly });
  }

  return {
    summary: {
      ...summary,
      totalIncome: totalYearly || summary.totalIncome, // Prefer revenue sheet calculation for income
      revenue: totalYearly || summary.revenue
    },
    capex,
    opex,
    employees,
    revenue: {
      streams,
      totalMonthly,
      totalYearly
    }
  };
};
