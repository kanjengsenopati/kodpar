
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface ActionGridProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
  layout?: 'horizontal' | 'grid';
}

export function ActionGrid({ 
  onView, 
  onEdit, 
  onDelete, 
  compact = true,
  layout = 'grid'
}: ActionGridProps) {
  const actions = [
    { 
      key: 'view', 
      handler: onView, 
      icon: Eye, 
      tooltip: 'Lihat Detail',
      className: 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300'
    },
    { 
      key: 'edit', 
      handler: onEdit, 
      icon: Edit, 
      tooltip: 'Edit',
      className: 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300'
    },
    { 
      key: 'delete', 
      handler: onDelete, 
      icon: Trash2, 
      tooltip: 'Hapus',
      className: 'border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300'
    }
  ].filter(action => action.handler);

  if (actions.length === 0) return null;

  // Force 2-column grid layout for compact action buttons
  const containerClass = 'grid grid-cols-2 gap-1 w-fit max-w-[60px]';
  const buttonSize = 'h-6 w-6';
  const iconSize = 'h-3 w-3';

  return (
    <TooltipProvider>
      <div className={containerClass}>
        {actions.map(({ key, handler, icon: Icon, tooltip, className }) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`${buttonSize} p-0 rounded border transition-all duration-200 ${className}`}
                onClick={handler}
              >
                <Icon className={`${iconSize} ${
                  key === 'view' ? 'text-blue-600' :
                  key === 'edit' ? 'text-blue-600' :
                  'text-red-600'
                }`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
