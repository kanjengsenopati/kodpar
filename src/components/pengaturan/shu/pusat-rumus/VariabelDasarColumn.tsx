
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Database, Variable } from "lucide-react";
import { JenisVariabelCRUD } from "./JenisVariabelCRUD";
import { VariabelCustomCRUD } from "./VariabelCustomCRUD";

interface JenisVariabel {
  id: string;
  nama: string;
  deskripsi: string;
  kategori: "simpanan" | "pinjaman" | "keuangan" | "waktu" | "custom";
  color: string;
}

interface VariabelCustom {
  id: string;
  nama: string;
  deskripsi: string;
  jenisId: string;
  valueType: "number" | "percentage" | "currency";
  value: number;
  unit?: string;
  formula?: string;
  isEditable: boolean;
}

interface BuiltInVariable {
  id: string;
  label: string;
  description: string;
  value: number;
}

interface VariabelDasarColumnProps {
  jenisVariabel: JenisVariabel[];
  variabelCustom: VariabelCustom[];
  builtInVariables: BuiltInVariable[];
  onJenisVariabelUpdate: (jenis: JenisVariabel[]) => void;
  onVariabelCustomUpdate: (variabel: VariabelCustom[]) => void;
  onUseVariable: (variableId: string) => void;
}

export function VariabelDasarColumn({
  jenisVariabel,
  variabelCustom,
  builtInVariables,
  onJenisVariabelUpdate,
  onVariabelCustomUpdate,
  onUseVariable
}: VariabelDasarColumnProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Variabel Dasar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["jenis-variabel", "variabel-custom"]} className="w-full">
          <AccordionItem value="jenis-variabel">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Jenis Variabel
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <JenisVariabelCRUD 
                jenisVariabel={jenisVariabel}
                onUpdate={onJenisVariabelUpdate}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="variabel-custom">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Variable className="h-4 w-4" />
                Variabel Custom
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <VariabelCustomCRUD
                variabelCustom={variabelCustom}
                jenisVariabel={jenisVariabel}
                builtInVariables={builtInVariables}
                onUpdate={onVariabelCustomUpdate}
                onUseVariable={onUseVariable}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
