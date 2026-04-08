
import { FormHeaderProps } from "./types";

export function FormHeader({ isEditMode }: FormHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">
        {isEditMode ? "Edit Pinjaman" : "Pinjaman Baru"}
      </h2>
      <p className="text-muted-foreground">
        {isEditMode
          ? "Edit data pinjaman anggota koperasi"
          : "Tambahkan data pinjaman baru untuk anggota koperasi"}
      </p>
    </div>
  );
}
