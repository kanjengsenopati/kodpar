
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface SecurityAlertProps {
  type?: 'info' | 'warning';
  title?: string;
  message: string;
  className?: string;
}

export function SecurityAlert({ 
  type = 'info', 
  title, 
  message, 
  className = "" 
}: SecurityAlertProps) {
  const isWarning = type === 'warning';
  
  return (
    <Alert 
      variant={isWarning ? "destructive" : "default"} 
      className={`border-l-4 ${isWarning ? 'border-l-orange-500' : 'border-l-blue-500'} ${className}`}
    >
      {isWarning ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Shield className="h-4 w-4" />
      )}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
