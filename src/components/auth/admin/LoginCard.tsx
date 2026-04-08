
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LoginHeader } from "./LoginHeader";
import { LoginFormFields } from "./LoginFormFields";
import { DemoCredentialsSection } from "./DemoCredentialsSection";
import { adminLoginFormSchema } from "./formSchema";

type FormValues = z.infer<typeof adminLoginFormSchema>;

interface LoginCardProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
  demoCredentials?: Array<{
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
  demoCredentials, 
  onDemoLogin 
}: LoginCardProps) {
  return (
    <Card className="border-0 shadow-lg sm:shadow-2xl bg-white/90 backdrop-blur-sm mx-2 sm:mx-0">
      <LoginHeader />
      
      <CardContent className="px-4 sm:px-6 md:px-8 pb-3 pt-0">
        <LoginFormFields 
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
        
        {demoCredentials && (
          <div className="mt-2">
            <DemoCredentialsSection 
              demoCredentials={demoCredentials}
              onDemoLogin={onDemoLogin}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 md:px-8 pb-4 pt-0">
        <p className="text-xs text-center text-koperasi-gray leading-relaxed w-full">
          Koperasi-ERP @2025 - All rights reserved
        </p>
      </CardFooter>
    </Card>
  );
}
