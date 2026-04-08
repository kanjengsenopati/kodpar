
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FormulaComponent } from "@/types";
import { useState } from "react";
import { useId } from "react";

interface FormulaComponentFormProps {
  onAddComponent: (component: FormulaComponent) => void;
  onCancel: () => void;
}

export function FormulaComponentForm({ 
  onAddComponent, 
  onCancel 
}: FormulaComponentFormProps) {
  const id = useId();
  const [component, setComponent] = useState<FormulaComponent>({
    id: `component-${id}`,
    name: '',
    formula: '',
    description: ''
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="component-name">Nama Komponen</Label>
            <Input
              id="component-name"
              value={component.name}
              onChange={(e) => setComponent({
                ...component,
                name: e.target.value
              })}
              placeholder="Contoh: Formula Simpanan"
            />
          </div>
          
          <div>
            <Label htmlFor="component-formula">Formula</Label>
            <Input
              id="component-formula"
              value={component.formula}
              onChange={(e) => setComponent({
                ...component,
                formula: e.target.value
              })}
              placeholder="simpanan_khusus * 0.05 + simpanan_wajib * 0.03"
            />
          </div>
          
          <div>
            <Label htmlFor="component-description">Deskripsi</Label>
            <Textarea
              id="component-description"
              value={component.description || ''}
              onChange={(e) => setComponent({
                ...component,
                description: e.target.value
              })}
              placeholder="Deskripsi singkat tentang komponen formula ini"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button 
              onClick={() => onAddComponent(component)}
              disabled={!component.name || !component.formula}
            >
              Tambahkan Komponen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
