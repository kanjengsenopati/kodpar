
import type { PinjamanFormData } from '../types';

export const usePinjamanCalculations = () => {
  const calculateLoanParameters = (
    jumlahNumber: number, 
    tenor: number, 
    bunga: number, 
    tanggal: string
  ) => {
    const totalBunga = jumlahNumber * (bunga / 100) * tenor;
    const totalPengembalian = jumlahNumber + totalBunga;
    const angsuranPerBulan = Math.ceil(totalPengembalian / tenor);
    
    // Calculate jatuh tempo
    const tanggalPinjam = new Date(tanggal);
    const jatuhTempoDate = new Date(tanggalPinjam);
    jatuhTempoDate.setMonth(jatuhTempoDate.getMonth() + tenor);
    
    return {
      totalBunga,
      totalPengembalian,
      angsuranPerBulan,
      jatuhTempo: jatuhTempoDate.toISOString().split('T')[0],
    };
  };

  const handleJumlahChange = (
    value: string, 
    formatted: string, 
    formData: PinjamanFormData,
    setFormData: (data: PinjamanFormData) => void
  ) => {
    const jumlahNumber = parseFloat(value) || 0;
    const calculations = calculateLoanParameters(
      jumlahNumber, 
      formData.tenor, 
      formData.bunga, 
      formData.tanggal
    );
    
    setFormData({
      ...formData,
      jumlah: jumlahNumber,
      jumlahPinjaman: value,
      formattedJumlah: formatted,
      ...calculations,
      angsuran: calculations.angsuranPerBulan,
    });
  };
  
  const handleParameterChange = (
    field: 'tenor' | 'bunga' | 'tanggal', 
    value: number | string,
    formData: PinjamanFormData,
    setFormData: (data: PinjamanFormData) => void
  ) => {
    const updatedData = { ...formData, [field]: value };
    const jumlahNumber = parseFloat(formData.jumlahPinjaman) || 0;
    
    const calculations = calculateLoanParameters(
      jumlahNumber,
      updatedData.tenor as number,
      updatedData.bunga as number,
      updatedData.tanggal as string
    );
    
    setFormData({
      ...updatedData,
      ...calculations,
      angsuran: calculations.angsuranPerBulan,
    });
  };

  return {
    handleJumlahChange,
    handleParameterChange
  };
};
