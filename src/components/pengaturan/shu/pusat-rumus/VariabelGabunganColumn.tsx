
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator, Star, Beaker } from "lucide-react";
import { RumusGabunganCRUD } from "./RumusGabunganCRUD";

interface RumusGabungan {
  id: string;
  nama: string;
  deskripsi: string;
  formula: string;
  formulaType: 'shu' | 'thr' | 'general';
  isActive: boolean;
  createdAt: string;
  lastModified: string;
}

interface Variable {
  id: string;
  nama: string;
  deskripsi: string;
  jenisId: string;
  value: number;
}

interface VariabelGabunganColumnProps {
  rumusGabungan: RumusGabungan[];
  variabelAvailable: Variable[];
  onUpdate: (rumus: RumusGabungan[]) => void;
  onSetActiveFormula: (formula: string, formulaType?: 'shu' | 'thr') => void;
}

export function VariabelGabunganColumn({
  rumusGabungan,
  variabelAvailable,
  onUpdate,
  onSetActiveFormula
}: VariabelGabunganColumnProps) {
  const shuFormulas = rumusGabungan.filter(r => r.formulaType === 'shu');
  const thrFormulas = rumusGabungan.filter(r => r.formulaType === 'thr');
  const generalFormulas = rumusGabungan.filter(r => r.formulaType === 'general');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Variabel Gabungan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["shu-formulas", "thr-formulas"]} className="w-full">
          <AccordionItem value="shu-formulas">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Rumus SHU
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <RumusGabunganCRUD
                rumusGabungan={shuFormulas}
                allRumusGabungan={rumusGabungan}
                variabelAvailable={variabelAvailable}
                formulaType="shu"
                onUpdate={onUpdate}
                onSetActiveFormula={onSetActiveFormula}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="thr-formulas">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Rumus THR
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <RumusGabunganCRUD
                rumusGabungan={thrFormulas}
                allRumusGabungan={rumusGabungan}
                variabelAvailable={variabelAvailable}
                formulaType="thr"
                onUpdate={onUpdate}
                onSetActiveFormula={onSetActiveFormula}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="general-formulas">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Rumus Umum
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <RumusGabunganCRUD
                rumusGabungan={generalFormulas}
                allRumusGabungan={rumusGabungan}
                variabelAvailable={variabelAvailable}
                formulaType="general"
                onUpdate={onUpdate}
                onSetActiveFormula={onSetActiveFormula}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
