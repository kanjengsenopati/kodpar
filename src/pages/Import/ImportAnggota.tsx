
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { FileUploader } from "@/components/import/FileUploader";
import { DataTable } from "@/components/import/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { importExcelData, importAnggotaData, generateDemoAnggotaData, downloadAnggotaTemplate } from "@/services/importService";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Anggota } from "@/types";
import { AlertCircle, CheckCircle, FileSpreadsheet, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImportAnggota() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
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
      
      setIsPreviewMode(true);
    } catch (error) {
      toast.error("Gagal membaca file Excel");
      setErrors([error.message || "Gagal memproses file"]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImport = async () => {
    if (!previewData.length) {
      toast.error("Tidak ada data untuk diimpor");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Transform data to Anggota format
      const anggotaData = previewData.map((row) => {
        return {
          nama: row.Nama || row.nama || "",
          nip: row.NIP || row.nip || "",
          alamat: row.Alamat || row.alamat || "",
          noHp: row.NoHP || row.noHp || row["No HP"] || "",
          jenisKelamin: parseJenisKelamin(row["Jenis Kelamin"] || row.JenisKelamin || row.jenisKelamin || "L"),
          agama: row.Agama || row.agama || "ISLAM",
          status: row.Status || row.status || "active",
          unitKerja: row["Unit Kerja"] || row.UnitKerja || row.unitKerja || "",
          email: row.Email || row.email || ""
        } as Partial<Anggota>;
      });
      
      const result = await importAnggotaData(anggotaData);
      
      if (result.success > 0) {
        toast.success(`${result.success} anggota berhasil diimpor`);
      }
      
      if (result.errors > 0) {
        setErrors(result.errorMessages);
        toast.error(`${result.errors} anggota gagal diimpor`);
      }
      
      setIsPreviewMode(false);
      
      // Clear preview data if all imported successfully
      if (result.errors === 0) {
        setPreviewData([]);
        setHeaders([]);
      }
      
    } catch (error) {
      toast.error("Gagal mengimpor data");
      setErrors([error.message || "Gagal mengimpor data"]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to parse Jenis Kelamin values
  const parseJenisKelamin = (value: string): 'L' | 'P' => {
    if (!value) return 'L';
    const normalizedValue = value.trim().toUpperCase();
    return normalizedValue === 'P' ? 'P' : 'L';
  };
  
  const handleReset = () => {
    setPreviewData([]);
    setHeaders([]);
    setErrors([]);
    setIsPreviewMode(true);
  };
  
  const handleLoadDemoData = () => {
    const { data, headers } = generateDemoAnggotaData();
    setPreviewData(data);
    setHeaders(headers);
    setErrors([]);
    setIsPreviewMode(true);
  };

  const handleDownloadTemplate = () => {
    downloadAnggotaTemplate();
    toast.success("Template berhasil diunduh");
  };
  
  return (
    <Layout pageTitle="Impor Anggota">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Impor Data Anggota</h1>
            <p className="text-muted-foreground">
              Upload data anggota dari file Excel
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
              <CardTitle>Impor Data Anggota</CardTitle>
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
                    <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-1">
                      Data Demo Impor Anggota
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Gunakan data demo ini untuk melihat bagaimana fitur impor bekerja
                    </p>
                    <Button onClick={handleLoadDemoData}>
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
                  <Button onClick={handleImport} disabled={isLoading || !isPreviewMode}>
                    {isPreviewMode ? "Lanjutkan Impor" : "Data Sudah Diimpor"}
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
          
          {!isLoading && !isPreviewMode && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Impor Selesai</AlertTitle>
              <AlertDescription>
                Data anggota berhasil diimpor ke database
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </Layout>
  );
}
