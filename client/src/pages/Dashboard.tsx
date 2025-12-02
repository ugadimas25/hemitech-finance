import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CapexSection } from "@/components/dashboard/CapexSection";
import { OpexSection } from "@/components/dashboard/OpexSection";
import { EmployeesSection } from "@/components/dashboard/EmployeesSection";
import { RevenueSection } from "@/components/dashboard/RevenueSection";
import { CashflowProjectionSection } from "@/components/dashboard/CashflowProjectionSection";
import HousingMap from "@/components/dashboard/HousingMap";
import { FileUpload } from "@/components/common/FileUpload";
import { mockHemitechData } from "@/data/mockHemitechRab";
import { HemitechData } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Download, FileInput, RefreshCw } from "lucide-react";
import { utils, read } from "xlsx";
import { parseHemitechExcel } from "@/utils/excelParser";

export default function Dashboard() {
  const [location] = useLocation();
  const [data, setData] = useState<HemitechData>(mockHemitechData);
  const [loading, setLoading] = useState(true);

  // Fetch data from API on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      
      const apiData = await response.json();
      console.log("Dashboard data from API:", apiData);
      
      // Transform API data to match HemitechData interface
      // Convert string decimals to numbers
      const transformedData = {
        summary: {
          totalCost: Number(apiData.summary.totalCost) || 0,
          totalIncome: Number(apiData.summary.totalIncome) || 0,
          revenue: Number(apiData.summary.revenue) || 0,
          resourceCost: Number(apiData.summary.resourceCost) || 0,
          opexCost: Number(apiData.summary.opexCost) || 0,
          capexCost: Number(apiData.summary.capexCost) || 0,
        },
        capex: apiData.capex.map((item: any) => ({
          id: item.id,
          kategori: item.kategori,
          item: item.item,
          description: item.description || '',
          qty: Number(item.qty) || 0,
          hargaSatuan: Number(item.hargaSatuan) || 0,
          total: Number(item.total) || 0,
        })),
        opex: apiData.opex.map((item: any) => ({
          id: item.id,
          kategori: item.kategori,
          item: item.item,
          totalBulanan: Number(item.totalBulanan) || 0,
          totalTahunan: Number(item.totalTahunan) || 0,
        })),
        employees: apiData.employees.map((item: any) => ({
          id: item.id,
          level: item.level,
          role: item.role,
          qty: Number(item.qty) || 0,
          salaryMonth: Number(item.salaryMonth) || 0,
          totalSalaryMonth: Number(item.totalSalaryMonth) || 0,
          totalSalaryYear: Number(item.totalSalaryYear) || 0,
          thrBenefit: Number(item.thrBenefit) || 0,
        })),
        revenue: {
          streams: apiData.revenue.streams.map((item: any) => ({
            id: item.id,
            name: item.name,
            unitResidence: Number(item.unitResidence || item.unit_residence) || 0,
            residence: Number(item.residence) || 0,
            paymentGateway: Number(item.paymentGateway || item.payment_gateway) || 0,
            avgTransaction: Number(item.avgTransaction || item.avg_transaction) || 0,
            subscriptionPerMonth: Number(item.subscriptionPerMonth || item.subscription_per_month) || 0,
            monthly: Number(item.monthly) || 0,
            yearly: Number(item.yearly) || 0,
          })),
          totalMonthly: Number(apiData.revenue.totalMonthly) || 0,
          totalYearly: Number(apiData.revenue.totalYearly) || 0,
        }
      };
      
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Keep using mock data on error
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch("/attached_assets/Hemitech_RAB_1764669277951.xlsx");
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
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      );
    }

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
                <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </div>
            
            <SummaryCards summary={data.summary} />
            
            {/* Housing Map Section */}
            <HousingMap />
            
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
