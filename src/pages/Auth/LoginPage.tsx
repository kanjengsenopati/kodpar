import { LoginForm } from "@/components/auth/admin/LoginForm";

export default function LoginPage() {
  const adminDemo = [
    { label: "Super Admin", username: "adminkpri@email.com", password: "password123" },
    { label: "Manager", username: "admin@email.com", password: "password123" },
  ];

  const anggotaDemo = [
    { label: "Demo Anggota", username: "demo@email.com", password: "demo" },
  ];

  return (
    <LoginForm
      title="Koperasi Digital"
      subtitle="Sistem ERP Koperasi Modern"
      adminDemo={adminDemo}
      anggotaDemo={anggotaDemo}
      onSuccessRedirect="/dashboard"
    />
  );
}
