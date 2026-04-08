import { Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Text from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface DemoCredential {
  label: string;
  username: string;
  password: string;
}

interface DemoCredentialsSectionProps {
  demoCredentials: DemoCredential[];
  onDemoLogin: (email: string, password: string) => void;
  role: "admin" | "anggota";
}

export function DemoCredentialsSection({ 
  demoCredentials, 
  onDemoLogin,
  role
}: DemoCredentialsSectionProps) {
  const Icon = role === "admin" ? Shield : User;
  const accentColor = role === "admin" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-emerald-50 text-emerald-600 border-emerald-100";
  const hoverColor = role === "admin" ? "hover:bg-blue-600 hover:text-white" : "hover:bg-emerald-600 hover:text-white";

  return (
    <>
      <div className="relative w-full mb-4 mt-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3">
            <Text.Label>Akses Demo {role === 'admin' ? 'Pengurus' : 'Anggota'}</Text.Label>
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {demoCredentials.map((credential, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onDemoLogin(credential.username, credential.password)}
            className={cn(
              "flex-1 min-w-[120px] rounded-xl text-xs h-10 border transition-all gap-2",
              accentColor,
              hoverColor
            )}
          >
            <Icon size={14} strokeWidth={2.5} />
            <span className="font-bold">{credential.label}</span>
          </Button>
        ))}
      </div>
    </>
  );
}
