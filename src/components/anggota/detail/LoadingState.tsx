
import Layout from "@/components/layout/Layout";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Memuat data anggota..." }: LoadingStateProps) {
  return (
    <div className="flex justify-center items-center h-64">
      <p>{message}</p>
    </div>
  );
}
