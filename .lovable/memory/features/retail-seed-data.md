---
name: Retail seed data
description: Comprehensive retail demo data — ~60 penjualan + ~18 pembelian spanning 6 months, varied payment methods, kasir initialization
type: feature
---
`src/services/retail/seedRetailData.ts` generates demo data on first init:
- ~60 penjualan (8-12/month × 6 months), varied products, payment methods (cash/debit/qris/transfer), kasir
- ~18 pembelian (2-3/month × 6 months), linked to pemasok, with PPN
- Kasir sample data (3 users) if not exists
- Storage keys: `penjualanList`, `koperasi_pembelian`, `koperasi_kasir_data`
- Guard key: `retail_seed_v1_done`
- Called from `seedDataService.ts` → `seedDemoData()`
