
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EmailInput } from "./EmailInput";
import { adminLoginFormSchema } from "./formSchema";

type FormValues = z.infer<typeof adminLoginFormSchema>;

interface LoginFormFieldsProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

export function LoginFormFields({ form, onSubmit, isLoading }: LoginFormFieldsProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-koperasi-dark/80 font-medium text-sm">Email</FormLabel>
              <FormControl>
                <EmailInput field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-koperasi-dark/80 font-medium text-sm">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-koperasi-gray" />
                  <input
                    type="password"
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-koperasi-green/50 focus:border-koperasi-green transition-all"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full h-10 text-sm bg-gradient-to-r from-koperasi-blue to-koperasi-green hover:from-koperasi-blue/90 hover:to-koperasi-green/90 transition-all duration-300 shadow-md font-semibold" 
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </Form>
  );
}
