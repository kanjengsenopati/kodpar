
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomVariable } from "@/types";
import { FormulaEditor } from "./FormulaEditor";

interface CustomVariableFormProps {
  variable: CustomVariable;
  setVariable: (variable: CustomVariable) => void;
  onSave: () => void;
  onCancel: () => void;
  buttonText: string;
}

const availableVariables = [
  { id: "simpanan_pokok", label: "Simpanan Pokok" },
  { id: "simpanan_wajib", label: "Simpanan Wajib" },
  { id: "simpanan_khusus", label: "Simpanan Khusus" },
  { id: "pinjaman", label: "Pinjaman" },
  { id: "jasa", label: "Jasa" },
  { id: "pendapatan", label: "Pendapatan" },
  { id: "lama_keanggotaan", label: "Lama Keanggotaan" },
  { id: "transaksi_amount", label: "Total Transaksi" },
  { id: "angsuran", label: "Angsuran" },
];

export function CustomVariableForm({ 
  variable, 
  setVariable, 
  onSave, 
  onCancel, 
  buttonText 
}: CustomVariableFormProps) {
  const handleFormulaChange = (formula: string) => {
    setVariable({
      ...variable,
      formula: formula
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="variable-name">Nama Variabel</Label>
              <Input
                id="variable-name"
                value={variable.name}
                onChange={(e) => setVariable({
                  ...variable,
                  name: e.target.value
                })}
                placeholder="Contoh: Bonus Akhir Tahun"
              />
            </div>
            
            <div>
              <Label htmlFor="variable-type">Tipe Nilai</Label>
              <Select
                value={variable.valueType}
                onValueChange={(value: "jumlah" | "persentase") => setVariable({
                  ...variable,
                  valueType: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe nilai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jumlah">Jumlah (Rp)</SelectItem>
                  <SelectItem value="persentase">Persentase (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Description and Value in a grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side - Description and Default Value */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <Label htmlFor="variable-description">Deskripsi</Label>
                <Textarea
                  id="variable-description"
                  value={variable.description}
                  onChange={(e) => setVariable({
                    ...variable,
                    description: e.target.value
                  })}
                  placeholder="Deskripsi singkat tentang variabel ini"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="variable-value">Nilai Default</Label>
                <Input
                  id="variable-value"
                  type="number"
                  value={variable.value.toString()}
                  onChange={(e) => setVariable({
                    ...variable,
                    value: parseFloat(e.target.value) || 0
                  })}
                  placeholder={variable.valueType === 'jumlah' ? "100000" : "5"}
                />
              </div>
            </div>
            
            {/* Right side - Formula Editor */}
            <div className="lg:col-span-2">
              <FormulaEditor
                formula={variable.formula || ""}
                onFormulaChange={handleFormulaChange}
                availableVariables={availableVariables}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button onClick={onSave}>
              {buttonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
