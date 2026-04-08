
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Lock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { logoutUser, getCurrentUser } from "@/services/authService";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import "@/styles/form-styles.css";

type AnggotaLayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

export default function AnggotaLayout({ children, pageTitle }: AnggotaLayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Set document title when page changes
  document.title = `${pageTitle} | Profil Anggota`;
  
  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/anggota-login");
    setIsMenuOpen(false);
  };
  
  const handleChangePassword = () => {
    navigate("/anggota/change-password");
    setIsMenuOpen(false);
  };
  
  const MobileMenuContent = () => (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex items-center space-x-3 pb-4 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-white">
            {currentUser?.nama?.charAt(0) || 'A'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">{currentUser?.nama}</h3>
          <p className="text-xs text-muted-foreground">ID: {currentUser?.anggotaId}</p>
        </div>
      </div>
      
      <Button
        variant="outline"
        className="justify-start"
        onClick={handleChangePassword}
      >
        <Lock className="mr-2 h-4 w-4" />
        Ubah Password
      </Button>
      
      <Button
        variant="ghost"
        className="justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Keluar
      </Button>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-3 sm:py-4 px-4 sm:px-6 mb-4 sm:mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white text-xs sm:text-sm">
                {currentUser?.nama?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-base sm:text-lg font-medium truncate">{currentUser?.nama}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">ID: {currentUser?.anggotaId}</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handleChangePassword}
            >
              <Lock className="mr-1 h-4 w-4" />
              Ubah Password
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Keluar
            </Button>
          </div>
          
          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <MobileMenuContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{pageTitle}</h2>
        {children}
      </main>
      
      <footer className="bg-white border-t py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-500 mt-8">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Koperasi-ERP. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
