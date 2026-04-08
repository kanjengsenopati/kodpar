
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, ClipboardList } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getBOMById } from "@/services/manufaktur/bomService";

export default function BOMDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const bom = id ? getBOMById(id) : undefined;

  if (!bom) {
    return (
      <Layout pageTitle="Detail BOM">
        <div className="text-center py-20 text-muted-foreground">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>BOM tidak ditemukan</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/manufaktur/bom")}>Kembali</Button>
        </div>
      </Layout>
    );
  }

  const statusColor = bom.status === "Active" ? "default" : bom.status === "Draft" ? "secondary" : "outline";

  return (
    <Layout pageTitle={`BOM - ${bom.code}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/manufaktur/bom")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
          </Button>
          <Button size="sm" onClick={() => navigate(`/manufaktur/bom/${bom.id}/edit`)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{bom.productName}</CardTitle>
              <Badge variant={statusColor}>{bom.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Kode BOM</p>
              <p className="font-mono font-medium">{bom.code}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Kode Produk</p>
              <p className="font-medium">{bom.productCode || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Kategori</p>
              <p className="font-medium">{bom.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Output</p>
              <p className="font-medium">{bom.outputQuantity} {bom.outputUnit}</p>
            </div>
            {bom.description && (
              <div className="col-span-2 sm:col-span-4">
                <p className="text-muted-foreground">Deskripsi</p>
                <p>{bom.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Material ({bom.items.length} item)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead className="text-right">Harga/Unit</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bom.items.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.materialName}</TableCell>
                      <TableCell className="font-mono text-sm">{item.materialCode || "-"}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right">Rp {item.unitCost.toLocaleString("id-ID")}</TableCell>
                      <TableCell className="text-right font-medium">Rp {item.totalCost.toLocaleString("id-ID")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Biaya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm max-w-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Material</span>
                <span className="font-medium">Rp {bom.totalMaterialCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Overhead</span>
                <span className="font-medium">Rp {bom.overheadCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Tenaga Kerja</span>
                <span className="font-medium">Rp {bom.laborCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total Biaya Produksi</span>
                <span className="font-bold text-primary text-lg">Rp {bom.totalCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Biaya per Unit</span>
                <span>Rp {Math.round(bom.totalCost / bom.outputQuantity).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
