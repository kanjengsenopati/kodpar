import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { LoginHeader } from "./LoginHeader";
import { LoginFormFields } from "./LoginFormFields";
import { DemoCredentialsSection } from "./DemoCredentialsSection";
import { adminLoginFormSchema } from "./formSchema";
import { Shield, User } from "lucide-react";

type FormValues = z.infer<typeof adminLoginFormSchema>;

interface LoginCardProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
  adminDemo?: Array<{
    label: string;
    username: string;
    password: string;
  }>;
  anggotaDemo?: Array<{
    label: string;
    username: string;
    password: string;
  }>;
  onDemoLogin: (email: string, password: string) => void;
}

export function LoginCard({ 
  form, 
  onSubmit, 
  isLoading, 
  adminDemo, 
  anggotaDemo,
  onDemoLogin 
}: LoginCardProps) {
  return (
    <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/90 backdrop-blur-sm mx-2 sm:mx-0 rounded-[32px] overflow-hidden">
      <LoginHeader />
      
      <CardContent className="px-4 sm:px-6 md:px-8 pb-3 pt-0">
        <Tabs defaultValue="pengurus" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100/50 p-1 mb-6">
            <TabsTrigger 
              value="pengurus" 
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2"
            >
              <Shield size={16} />
              Pengurus
            </TabsTrigger>
            <TabsTrigger 
              value="anggota" 
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2"
            >
              <User size={16} />
              Anggota
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pengurus" className="mt-0 space-y-4">
            <LoginFormFields 
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
            {adminDemo && (
              <DemoCredentialsSection 
                demoCredentials={adminDemo}
                onDemoLogin={onDemoLogin}
                role="admin"
              />
            )}
          </TabsContent>
          
          <TabsContent value="anggota" className="mt-0 space-y-4">
            <LoginFormFields 
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
            {anggotaDemo && (
              <DemoCredentialsSection 
                demoCredentials={anggotaDemo}
                onDemoLogin={onDemoLogin}
                role="anggota"
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 md:px-8 pb-6 pt-0">
        <p className="text-[11px] text-center font-bold uppercase tracking-widest text-slate-400 w-full">
          Koperasi Digital @2025 - All rights reserved
        </p>
      </CardFooter>
    </Card>
  );
}
