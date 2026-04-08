
import Layout from "@/components/layout/Layout";
import { UserManagementSettings } from "@/components/pengaturan/UserManagementSettings";

export default function PenggunaPenanPage() {
  return (
    <Layout pageTitle="Pengguna dan Peran">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pengguna dan Peran</h1>
          <p className="text-gray-600 mt-2">
            Kelola pengguna sistem dan hak akses peran.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <UserManagementSettings settings={{}} setSettings={() => {}} />
        </div>
      </div>
    </Layout>
  );
}
