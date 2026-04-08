
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { FileUploader } from "@/components/import/FileUploader";
import { DataTable } from "@/components/import/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { importExcelData, generateDemoTransaksiData, downloadTransaksiTemplate } from "@/services/importService";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileSpreadsheet, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImportTransaksi() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("upload");
  
  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setErrors([]);
    
    try {
      const result = await importExcelData(file);
      setPreviewData(result.data);
      setHeaders(result.headers);
      
      if (result.errors.length > 0) {
        setErrors(result.errors);
      }
    } catch (error) {
      toast.error("Gagal membaca file Excel");
      setErrors([error.message || "Gagal memproses file"]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImport = () => {
    toast.info("Fitur impor transaksi sedang dalam pengembangan");
  };
  
  const handleReset = () => {
    setPreviewData([]);
    setHeaders([]);
    setErrors([]);
  };
  
  const handleLoadDemoData = () => {
    const { data, headers } = generateDemoTransaksiData();
    setPreviewData(data);
    setHeaders(headers);
    setErrors([]);
  };

  const handleDownloadTemplate = () => {
    downloadTransaksiTemplate();
    toast.success("Template berhasil diunduh");
  };
  
  return (
    <Layout pageTitle="Impor Transaksi">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Impor Data Transaksi</h1>
            <p className="text-muted-foreground">
              Upload data transaksi dari file Excel
            </p>
          </div>
          <Button onClick={handleDownloadTemplate} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Unduh Template
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Impor Data Transaksi</CardTitle>
              <CardDescription>
                Upload file Excel atau gunakan data demo untuk melihat pratinjau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="demo">Data Demo</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <FileUploader 
                    accept=".xlsx,.xls"
                    onFileSelect={handleFileSelect}
                  />
                </TabsContent>
                <TabsContent value="demo">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                    <FileSpreadsheet className="h-10 w-10 text-primary mb-4" />
                    <p className="text-lg font-medium mb-1">
                      Data Demo Impor Transaksi
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Gunakan data demo ini untuk melihat bagaimana fitur impor bekerja
                    </p>
                    <Button onClick={handleLoadDemoData} className="bg-primary hover:bg-primary/90">
                      Tampilkan Data Demo
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {!isLoading && previewData.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pratinjau Data</CardTitle>
                  <CardDescription>
                    {previewData.length} baris data ditemukan
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                    Reset
                  </Button>
                  <Button onClick={handleImport} disabled={isLoading}>
                    Lanjutkan Impor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={previewData} 
                  headers={headers}
                />
              </CardContent>
            </Card>
          )}
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Informasi</AlertTitle>
            <AlertDescription>
              Fitur impor transaksi masih dalam tahap pengembangan. Saat ini hanya tersedia pratinjau data.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </Layout>
  );
}
