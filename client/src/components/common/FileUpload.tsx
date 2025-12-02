import React, { useRef, useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { read, utils } from "xlsx";

interface FileUploadProps {
  onDataLoaded: (data: any) => void; // We'll type this properly later or use the generic 'any' for the raw excel dump
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    setStatus("loading");
    setFileName(file.name);
    setMessage("Parsing Excel file...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      
      // Simple validation - check if expected sheets exist
      const expectedSheets = ["SUMMARY", "CAPEX (Setup Awal)", "OPEX (Bulanan & Tahunan)", "Pegawai", "Revenue"];
      const missingSheets = expectedSheets.filter(sheet => !workbook.SheetNames.includes(sheet));

      if (missingSheets.length > 0) {
        throw new Error(`Missing sheets: ${missingSheets.join(", ")}`);
      }

      // For now, we just simulate success and maybe log the raw data
      // In a real implementation, we'd parse each sheet here using utils.sheet_to_json
      console.log("Workbook loaded:", workbook.SheetNames);
      
      // Simulating parsing delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setStatus("success");
      setMessage("File processed successfully!");
      onDataLoaded(workbook); // Pass the workbook up
      
    } catch (error: any) {
      console.error("Error processing file:", error);
      setStatus("error");
      setMessage(error.message || "Failed to process file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      processFile(file);
    } else {
      setStatus("error");
      setMessage("Please upload a valid Excel file (.xlsx)");
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-2 border-dashed transition-all duration-200 p-8 flex flex-col items-center justify-center text-center gap-4",
        isDragging ? "border-primary bg-primary/5" : "border-border bg-card",
        status === "success" && "border-green-500/50 bg-green-500/5",
        status === "error" && "border-destructive/50 bg-destructive/5"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className={cn(
        "h-16 w-16 rounded-full flex items-center justify-center transition-colors",
        status === "success" ? "bg-green-100 text-green-600" : 
        status === "error" ? "bg-red-100 text-red-600" : 
        "bg-primary/10 text-primary"
      )}>
        {status === "success" ? <CheckCircle2 className="h-8 w-8" /> :
         status === "error" ? <AlertCircle className="h-8 w-8" /> :
         <FileSpreadsheet className="h-8 w-8" />}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-lg">
          {status === "success" ? "Data Loaded" : "Upload Excel File"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {message || "Drag and drop your Hemitech RAB file here, or click to browse."}
        </p>
      </div>

      {status !== "success" && (
        <Button 
          variant={status === "error" ? "destructive" : "default"} 
          onClick={() => fileInputRef.current?.click()}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Processing..." : "Select File"}
          <Upload className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      {fileName && status === "success" && (
        <p className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
          {fileName}
        </p>
      )}
    </Card>
  );
}
