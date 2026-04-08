
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/services/authService";
import { adminLoginFormSchema } from "./formSchema";

type FormValues = z.infer<typeof adminLoginFormSchema>;

interface UseLoginFormProps {
  onSuccessRedirect: string;
}

export function useLoginForm({ onSuccessRedirect }: UseLoginFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    console.log("Login form submitted with values:", values);
    setIsLoading(true);
    
    try {
      const user = await loginUser(values.email, values.password);
      console.log("Login successful, user data:", user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.nama}`,
      });
      
      form.reset();
      console.log("Redirecting to:", onSuccessRedirect);
      navigate(onSuccessRedirect);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Email or password is incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDemoLogin = (email: string, password: string) => {
    console.log("Demo login with:", { email, password });
    form.setValue("email", email);
    form.setValue("password", password);
    
    // Auto-submit the form with demo credentials
    form.handleSubmit(onSubmit)();
  };

  return {
    form,
    onSubmit,
    isLoading,
    handleDemoLogin,
  };
}
