
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Settings, Database } from "lucide-react";
import { Pengaturan, CustomVariable } from "@/types";
import { toast } from "sonner";
import { CustomVariableForm } from "@/components/pengaturan/shu/custom-variables/CustomVariableForm";

interface VariableManagerProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

// System variables that are always available
const systemVariables = [
  { id: "simpanan_pokok", label: "Simpanan Pokok", description: "Total simpanan pokok anggota", type: "system" },
  { id: "simpanan_wajib", label: "Simpanan Wajib", description: "Total simpanan wajib anggota", type: "system" },
  { id: "simpanan_khusus", label: "Simpanan Khusus", description: "Total simpanan khusus/sukarela anggota", type: "system" },
  { id: "pinjaman", label: "Pinjaman", description: "Total pinjaman anggota", type: "system" },
  { id: "jasa", label: "Jasa", description: "Jasa dari bunga pinjaman", type: "system" },
  { id: "pendapatan", label: "Pendapatan", description: "Estimasi pendapatan anggota", type: "system" },
  { id: "lama_keanggotaan", label: "Lama Keanggotaan", description: "Lama keanggotaan dalam tahun", type: "system" },
  { id: "transaksi_amount", label: "Total Transaksi", description: "Total nilai transaksi anggota", type: "system" },
  { id: "angsuran", label: "Angsuran", description: "Total angsuran yang dibayar", type: "system" },
];

export function VariableManager({ settings, setSettings }: VariableManagerProps) {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [editingCustom, setEditingCustom] = useState<CustomVariable | null>(null);
  const [newCustomVariable, setNewCustomVariable] = useState<Partial<CustomVariable>>({
    name: "",
    description: "",
    valueType: "jumlah",
    value: 0,
    formula: "" // Added formula field
  });

  const customVariables = settings.shu?.customVariables || [];

  // Add new custom variable
  const handleAddCustomVariable = () => {
    if (!newCustomVariable.name) {
      toast.error("Nama variabel harus diisi");
      return;
    }

    // Generate ID from name
    const id = newCustomVariable.name.toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/^[0-9]/, '_$&');

    // Check if variable already exists
    const exists = customVariables.some(v => v.id === id || v.name === newCustomVariable.name);
    if (exists) {
      toast.error("Variabel dengan nama ini sudah ada");
      return;
    }

    const variable: CustomVariable = {
      id,
      name: newCustomVariable.name!,
      description: newCustomVariable.description || "",
      valueType: newCustomVariable.valueType as "jumlah" | "persentase",
      value: newCustomVariable.value || 0,
      formula: newCustomVariable.formula || "" // Include formula
    };

    const updatedCustomVariables = [...customVariables, variable];
    
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        customVariables: updatedCustomVariables
      }
    });

    // Reset form
    setNewCustomVariable({
      name: "",
      description: "",
      valueType: "jumlah",
      value: 0,
      formula: "" // Reset formula field
    });
    setIsAddingCustom(false);
    toast.success("Variabel custom berhasil ditambahkan");
  };

  // Update custom variable
  const handleUpdateCustomVariable = (updatedVariable: CustomVariable) => {
    const updatedCustomVariables = customVariables.map(v => 
      v.id === updatedVariable.id ? updatedVariable : v
    );
    
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        customVariables: updatedCustomVariables
      }
    });

    setEditingCustom(null);
    toast.success("Variabel custom berhasil diperbarui");
  };

  // Delete custom variable
  const handleDeleteCustomVariable = (id: string) => {
    const updatedCustomVariables = customVariables.filter(v => v.id !== id);
    
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        customVariables: updatedCustomVariables
      }
    });

    toast.success("Variabel custom berhasil dihapus");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Variabel Sistem
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Variabel Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Variabel Sistem</CardTitle>
              <p className="text-sm text-muted-foreground">
                Variabel yang tersedia secara otomatis dari sistem untuk perhitungan SHU dan THR
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {systemVariables.map(variable => (
                  <div key={variable.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {variable.id}
                        </Badge>
                        <span className="font-medium">{variable.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{variable.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Sistem
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Variabel Custom</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Buat variabel khusus dengan formula kustom untuk kebutuhan perhitungan spesifik
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddingCustom(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Variabel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new custom variable form */}
              {isAddingCustom && (
                <CustomVariableForm
                  variable={newCustomVariable as CustomVariable}
                  setVariable={setNewCustomVariable as (variable: CustomVariable) => void}
                  onSave={handleAddCustomVariable}
                  onCancel={() => setIsAddingCustom(false)}
                  buttonText="Simpan Variabel"
                />
              )}

              {/* List of custom variables */}
              <div className="space-y-3">
                {customVariables.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada variabel custom</p>
                    <p className="text-sm">Klik "Tambah Variabel" untuk membuat variabel baru</p>
                  </div>
                ) : (
                  customVariables.map(variable => (
                    <div key={variable.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {variable.id}
                          </Badge>
                          <span className="font-medium">{variable.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {variable.valueType === "jumlah" ? "Rp" : "%"}
                          </Badge>
                          {variable.formula && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              Formula
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{variable.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-muted-foreground">
                            Nilai: {variable.valueType === "jumlah" 
                              ? variable.value.toLocaleString('id-ID')
                              : `${variable.value}%`}
                          </p>
                          {variable.formula && (
                            <p className="text-xs text-blue-600 font-mono">
                              {variable.formula.length > 30 
                                ? `${variable.formula.substring(0, 30)}...` 
                                : variable.formula}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCustom(variable)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCustomVariable(variable.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit custom variable modal/form */}
      {editingCustom && (
        <CustomVariableForm
          variable={editingCustom}
          setVariable={setEditingCustom}
          onSave={() => handleUpdateCustomVariable(editingCustom)}
          onCancel={() => setEditingCustom(null)}
          buttonText="Simpan Perubahan"
        />
      )}
    </div>
  );
}
