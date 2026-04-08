
interface AnggotaNotFoundProps {
  id?: string;
}

export function AnggotaNotFound({ id }: AnggotaNotFoundProps) {
  return (
    <div className="text-center p-12">
      <h2 className="text-2xl font-bold text-gray-800">Data Anggota tidak ditemukan</h2>
      <p className="text-gray-600 mt-2">
        Anggota dengan ID {id} tidak terdaftar dalam sistem
      </p>
    </div>
  );
}
