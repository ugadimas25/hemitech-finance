import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CapexSection } from "@/components/dashboard/CapexSection";
import { OpexSection } from "@/components/dashboard/OpexSection";
import { EmployeesSection } from "@/components/dashboard/EmployeesSection";
import { RevenueSection } from "@/components/dashboard/RevenueSection";
import { CashflowProjectionSection } from "@/components/dashboard/CashflowProjectionSection";
import { FileUpload } from "@/components/common/FileUpload";
import { mockHemitechData } from "@/data/mockHemitechRab";
import { HemitechData } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Download, FileInput } from "lucide-react";
import { utils, read } from "xlsx";
import { parseHemitechExcel } from "@/utils/excelParser";

export default function Dashboard() {
  const [location] = useLocation();
  const [data, setData] = useState<HemitechData>(mockHemitechData);

  // Simple mapping to determine current view
  const currentView = location === "/" ? "overview" 
    : location.slice(1); // remove leading slash

  const handleDataLoaded = (parsedData: HemitechData) => {
    console.log("Data received in Dashboard:", parsedData);
    setData(parsedData);
    
    // If we are on the overview page, maybe show a toast?
    // For now just updating state is enough
  };

  const loadDemoFile = async () => {
    try {
      const response = await fetch("/attached_assets/Hemitech_RAB_1764668067466.xlsx");
      if (!response.ok) throw new Error("Demo file not found");
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = read(arrayBuffer);
      const parsedData = parseHemitechExcel(workbook);
      
      setData(parsedData);
      // alert("Demo Hemitech RAB file loaded!"); // Silent load is better for UX sometimes
    } catch (error) {
      console.error("Failed to load demo file", error);
      alert("Could not load demo file automatically. Please upload it manually.");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <p className="text-muted-foreground">High-level financial summary and KPIs.</p>
              </div>
              <div className="flex gap-2">
                 {/* <Button variant="outline" size="sm">
                   <Download className="mr-2 h-4 w-4" />
                   Export Report
                 </Button> */}
              </div>
            </div>
            
            <SummaryCards summary={data.summary} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Data Source</h3>
                    <Button variant="outline" size="sm" onClick={loadDemoFile}>
                      <FileInput className="mr-2 h-4 w-4" />
                      Load Hemitech RAB
                    </Button>
                 </div>
                 <FileUpload onDataLoaded={handleDataLoaded} />
               </div>
               
               {/* Add a mini chart or quick stats here if needed */}
            </div>
          </div>
        );
      case "capex":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Capital Expenditure</h2>
              <p className="text-muted-foreground">Setup costs and one-time investments.</p>
            </div>
            <CapexSection items={data.capex} />
          </div>
        );
      case "opex":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Operational Expenditure</h2>
              <p className="text-muted-foreground">Recurring monthly and yearly costs.</p>
            </div>
            <OpexSection items={data.opex} />
          </div>
        );
      case "employees":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Human Resources</h2>
              <p className="text-muted-foreground">Staffing, salaries, and benefits.</p>
            </div>
            <EmployeesSection employees={data.employees} />
          </div>
        );
      case "revenue":
        return (
          <div className="space-y-6">
             <div>
              <h2 className="text-3xl font-bold tracking-tight">Revenue</h2>
              <p className="text-muted-foreground">Income streams and targets.</p>
            </div>
            <RevenueSection revenue={data.revenue} />
          </div>
        );
      case "projection":
        return (
          <div className="space-y-6">
             <div>
              <h2 className="text-3xl font-bold tracking-tight">Cashflow Projection</h2>
              <p className="text-muted-foreground">Interactive financial forecasting model.</p>
            </div>
            <CashflowProjectionSection 
              initialParams={{
                baseRevenue: data.revenue.totalYearly,
                baseCost: data.summary.totalCost, // Using total cost as base for simplicity
                revenueGrowth: 20,
                costGrowth: 10,
                years: 5
              }} 
            />
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <AppLayout>
      {renderContent()}
    </AppLayout>
  );
}
