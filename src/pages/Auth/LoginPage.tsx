
import { LoginForm } from "@/components/auth/admin/LoginForm";

export default function LoginPage() {
  const demoCredentials = [
    { label: "Super Admin", username: "adminkpri@email.com", password: "password123" },
    { label: "Admin", username: "admin@email.com", password: "password123" },
    { label: "Demo Quick Login", username: "demo@email.com", password: "demo" },
  ];

  return (
    <LoginForm
      title="Koperasi-ERP"
      subtitle="Login Admin - Gunakan demo@email.com/demo untuk akses cepat"
      demoCredentials={demoCredentials}
      onSuccessRedirect="/dashboard"
    />
  );
}
