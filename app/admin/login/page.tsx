import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Login | Kenesis Admin",
  description: "Acesse o painel administrativo da Kenesis Imobiliária",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
