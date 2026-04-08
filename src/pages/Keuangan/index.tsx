
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KeuanganIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Transaksi Keuangan page as the default keuangan page
    navigate('/keuangan/transaksi', { replace: true });
  }, [navigate]);

  return null;
}
