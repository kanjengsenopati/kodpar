
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoCredential {
  label: string;
  username: string;
  password: string;
}

interface DemoCredentialsSectionProps {
  demoCredentials: DemoCredential[];
  onDemoLogin: (email: string, password: string) => void;
}

export function DemoCredentialsSection({ demoCredentials, onDemoLogin }: DemoCredentialsSectionProps) {
  return (
    <>
      <div className="relative w-full my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-koperasi-gray font-medium">
            Akses Demo
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        {demoCredentials.map((credential, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onDemoLogin(credential.username, credential.password)}
            className="flex-1 text-xs h-8 border-koperasi-green/30 bg-koperasi-green/5 hover:bg-koperasi-green/10 text-koperasi-dark hover:text-koperasi-dark transition-all px-2"
          >
            <Shield className="mr-1 h-3 w-3 flex-shrink-0" />
            <span className="truncate">{credential.label}</span>
          </Button>
        ))}
      </div>
    </>
  );
}
