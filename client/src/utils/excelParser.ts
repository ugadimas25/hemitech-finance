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
  
  // --- 1. CAPEX ---
  // Sheet: 'CAPEX (Setup Awal)'
  const capexSheet = sheets['CAPEX (Setup Awal)'];
  const capexJson = XLSX.utils.sheet_to_json(capexSheet, { header: 0 }) as any[];
  
  const capex: CapexItem[] = capexJson.map((row, idx) => ({
    id: `c-${idx}`,
    kategori: row['Kategori'] || 'Uncategorized',
    item: row['Item'] || 'Unnamed Item',
    // Description column is missing in new file, defaulting to empty
    description: '', 
    qty: cleanNumber(row['Qty']),
    hargaSatuan: cleanNumber(row['Harga Satuan (Rp)']),
    total: cleanNumber(row['Total (Rp)'])
  })).filter(item => item.total > 0);

  const totalCapex = capex.reduce((sum, item) => sum + item.total, 0);

  // --- 2. OPEX ---
  // Sheet: 'OPEX (Bulanan & Tahunan)'
  const opexSheet = sheets['OPEX (Bulanan & Tahunan)'];
  const opexJson = XLSX.utils.sheet_to_json(opexSheet, { header: 0 }) as any[];

  const opex: OpexItem[] = opexJson.map((row, idx) => ({
    id: `o-${idx}`,
    kategori: row['Kategori'] || 'Uncategorized',
    item: row['Item'] || 'Unnamed Item',
    totalBulanan: cleanNumber(row['Total Bulanan (Rp)']),
    totalTahunan: cleanNumber(row['Total Tahunan (Rp)'])
  })).filter(item => item.totalBulanan > 0);

  const totalOpexYearly = opex.reduce((sum, item) => sum + item.totalTahunan, 0);

  // --- 3. PEGAWAI ---
  // Sheet: 'Pegawai'
  const pegawaiSheet = sheets['Pegawai'];
  const pegawaiData = XLSX.utils.sheet_to_json(pegawaiSheet, { header: 1 }) as any[][];
  
  const employees: Employee[] = [];
  let startRowIndex = 0;
  
  // Find header row with "Qty"
  pegawaiData.forEach((row, idx) => {
    if (row.some(cell => String(cell).includes("Qty"))) {
      startRowIndex = idx + 1;
    }
  });

  for (let i = startRowIndex; i < pegawaiData.length; i++) {
    const row = pegawaiData[i];
    if (!row || row.length === 0) continue;

    // Heuristic based on new file inspection (similar to old but double checking)
    // We assume the structure is roughly:
    // Col 0: Level? Col 1/2: Role? Col 3: Qty?
    // Let's be defensive and try to find numeric columns if fixed indices fail
    
    const qty = cleanNumber(row[3]); 
    // Role usually in col 1 or 2
    const role = row[1] || row[2]; 
    
    if (qty > 0 && role) {
      employees.push({
        id: `e-${i}`,
        level: row[0] || 'Staff',
        role: String(role),
        qty: qty,
        salaryMonth: cleanNumber(row[4]), // E
        totalSalaryMonth: cleanNumber(row[5]), // F
        totalSalaryYear: cleanNumber(row[6]), // G
        thrBenefit: cleanNumber(row[7]) // H
      });
    }
  }

  const totalEmployeeCostYearly = employees.reduce((sum, item) => sum + item.totalSalaryYear, 0);

  // --- 4. REVENUE ---
  // Sheet: 'Revenue'
  const revenueSheet = sheets['Revenue'];
  // New structure: Data table with headers at row 0
  // "Income type", "Income/month", "Income/year"
  const revenueData = XLSX.utils.sheet_to_json(revenueSheet, { header: 1 }) as any[][];
  
  const streams: RevenueStream[] = [];
  let totalMonthlyRevenue = 0;
  let totalYearlyRevenue = 0;

  // Find header row for Revenue table
  let revHeaderRowIdx = -1;
  revenueData.forEach((row, idx) => {
    if (row.includes("Income type") || row.includes("Income/month")) {
      revHeaderRowIdx = idx;
    }
  });

  if (revHeaderRowIdx !== -1) {
    const headerRow = revenueData[revHeaderRowIdx];
    const typeIdx = headerRow.indexOf("Income type");
    const monthlyIdx = headerRow.indexOf("Income/month");
    const yearlyIdx = headerRow.indexOf("Income/year");

    if (typeIdx !== -1 && monthlyIdx !== -1 && yearlyIdx !== -1) {
      for (let i = revHeaderRowIdx + 1; i < revenueData.length; i++) {
        const row = revenueData[i];
        if (!row || row.length === 0) continue;

        const name = row[typeIdx];
        const monthly = cleanNumber(row[monthlyIdx]);
        const yearly = cleanNumber(row[yearlyIdx]);

        if (name && yearly > 0) {
          streams.push({
            id: `r-${i}`,
            name: String(name),
            monthly,
            yearly
          });
          totalMonthlyRevenue += monthly;
          totalYearlyRevenue += yearly;
        }
      }
    }
  } else {
    // Fallback to old logic if headers not found (unlikely given inspection)
    // But inspection showed headers at row 0:
    // ["Unit/Residence", "Residence", "Income type", "Payment Gateway Fees", "Average transaction/month", "Income/month", "Income/year"]
    // So index 2, 5, 6
    for (let i = 1; i < revenueData.length; i++) {
      const row = revenueData[i];
      if (!row || row.length < 7) continue;
       const name = row[2];
       const monthly = cleanNumber(row[5]);
       const yearly = cleanNumber(row[6]);
       
       if (name && yearly > 0) {
         streams.push({
           id: `r-${i}`,
           name: String(name),
           monthly,
           yearly
         });
         totalMonthlyRevenue += monthly;
         totalYearlyRevenue += yearly;
       }
    }
  }

  // --- 5. SUMMARY CALCULATION ---
  // Since SUMMARY sheet is missing, we calculate
  // Total Cost = Resource(??) + OPEX + CAPEX
  // Resource cost is tricky without the sheet. In the old file, 'Pegawai' sum was ~1.5B, which matched 'Resource' in summary.
  // So we will assume Resource Cost = Employee Cost.
  
  const resourceCost = totalEmployeeCostYearly;
  const calculatedTotalCost = resourceCost + totalOpexYearly + totalCapex;

  // User correction: "Profit = Revenue - Cost"
  // So 'Revenue' here should be the Gross Revenue (Total Income)
  // And the UI will calculate Profit as Revenue - Cost
  
  const summary: Summary = {
    totalCost: calculatedTotalCost,
    totalIncome: totalYearlyRevenue,
    revenue: totalYearlyRevenue, // Gross Revenue
    resourceCost: resourceCost,
    opexCost: totalOpexYearly,
    capexCost: totalCapex
  };

  return {
    summary,
    capex,
    opex,
    employees,
    revenue: {
      streams,
      totalMonthly: totalMonthlyRevenue,
      totalYearly: totalYearlyRevenue
    }
  };
};
