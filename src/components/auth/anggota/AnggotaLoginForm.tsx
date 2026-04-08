
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Key, Shield } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loginWithAnggotaId } from "@/services/authService";
import { PasswordInput } from "@/components/auth/anggota/PasswordInput";
import { anggotaFormSchema } from "@/components/auth/anggota/formSchema";

type FormValues = z.infer<typeof anggotaFormSchema>;

export function AnggotaLoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(anggotaFormSchema),
    defaultValues: {
      anggotaId: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    
    try {
      const user = await loginWithAnggotaId(values.anggotaId, values.password);
      
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${user.nama}`,
      });
      
      // Clear form after successful login
      form.reset();
      
      // Redirect to anggota profile
      navigate(`/anggota/${user.anggotaId}`);
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message || "ID Anggota atau password salah",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle demo login
  const handleDemoLogin = () => {
    form.setValue("anggotaId", "AG0001");
    form.setValue("password", "password123");
    
    // Auto-submit the form with demo credentials
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md shadow-lg sm:shadow-xl border-0 overflow-hidden relative mx-2 sm:mx-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 z-0"></div>
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
        
        <CardHeader className="space-y-1 text-center pb-2 relative z-10 px-4 sm:px-6 pt-6 sm:pt-8">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            Koperasi-ERP
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Login Anggota
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 px-4 sm:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <FormField
                control={form.control}
                name="anggotaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 text-sm">ID Anggota</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Input
                          placeholder="Masukkan ID Anggota"
                          className="pl-9 sm:pl-10 h-10 sm:h-12 border-muted/30 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                          {...field}
                        />
                      </div>
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
                    <FormLabel className="text-foreground/80 text-sm">Password</FormLabel>
                    <FormControl>
                      <PasswordInput field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md mt-4 sm:mt-6" 
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 pt-0 relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="relative w-full my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/40"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Demo
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleDemoLogin}
            className="w-full text-xs sm:text-sm h-8 sm:h-10 border-muted/30 bg-white/30 backdrop-blur-sm hover:bg-white/50"
          >
            <Shield className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Demo Login Anggota
          </Button>
          
          <div className="flex justify-center w-full mt-3 sm:mt-4">
            <Link to="/login" className="text-xs sm:text-sm text-blue-600 hover:underline">
              Login sebagai Admin/Superadmin
            </Link>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-3 sm:mt-4 leading-relaxed">
            Enterprise Resource Planning Koperasi
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
