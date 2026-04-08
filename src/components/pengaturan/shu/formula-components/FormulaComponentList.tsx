
import { FormulaComponent } from "@/types";
import { FormulaComponentItem } from "./FormulaComponentItem";
import { EmptyComponentState } from "./EmptyComponentState";

interface FormulaComponentListProps {
  components: FormulaComponent[];
  onUseComponent: (formula: string) => void;
  onDeleteComponent: (id: string) => void;
}

export function FormulaComponentList({ 
  components, 
  onUseComponent, 
  onDeleteComponent 
}: FormulaComponentListProps) {
  if (!components || components.length === 0) {
    return <EmptyComponentState />;
  }

  return (
    <div className="space-y-2">
      {components.map((component) => (
        <FormulaComponentItem
          key={component.id}
          component={component}
          onUse={onUseComponent}
          onDelete={onDeleteComponent}
        />
      ))}
    </div>
  );
}
