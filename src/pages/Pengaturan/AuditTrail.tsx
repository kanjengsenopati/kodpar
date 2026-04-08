
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, Download, Trash2, Eye, Monitor, Smartphone, Tablet } from "lucide-react";
import { 
  getAuditTrail, 
  getAuditTrailByUser, 
  getAuditTrailByResource, 
  getAuditTrailByDateRange,
  clearAuditTrail,
  getActionDescription,
  AuditEntry 
} from "@/services/auditService";
import { toast } from "@/components/ui/use-toast";

export default function AuditTrail() {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedResource, setSelectedResource] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadAuditEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [auditEntries, searchTerm, selectedUser, selectedResource, selectedAction, startDate, endDate]);

  const loadAuditEntries = () => {
    const entries = getAuditTrail();
    setAuditEntries(entries);
  };

  const filterEntries = () => {
    let filtered = [...auditEntries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.ipAddress.includes(searchTerm)
      );
    }

    // User filter
    if (selectedUser !== "all") {
      filtered = filtered.filter(entry => entry.userId === selectedUser);
    }

    // Resource filter
    if (selectedResource !== "all") {
      filtered = filtered.filter(entry => entry.resource === selectedResource);
    }

    // Action filter
    if (selectedAction !== "all") {
      filtered = filtered.filter(entry => entry.action === selectedAction);
    }

    // Date range filter
    if (startDate && endDate) {
      filtered = getAuditTrailByDateRange(startDate, endDate);
    }

    setFilteredEntries(filtered);
  };

  const handleClearAudit = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua log audit? Tindakan ini tidak dapat dibatalkan.")) {
      clearAuditTrail();
      loadAuditEntries();
      toast({
        title: "Log Audit Dibersihkan",
        description: "Semua log audit telah dihapus dari sistem",
      });
    }
  };

  const exportAuditLog = () => {
    const csvContent = [
      ["Timestamp", "User", "Action", "Resource", "Details", "IP Address", "Device", "Browser", "OS"].join(","),
      ...filteredEntries.map(entry => [
        entry.timestamp,
        entry.username,
        entry.action,
        entry.resource,
        `"${entry.details}"`,
        entry.ipAddress,
        entry.device,
        entry.browser,
        entry.os
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-trail-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Log Audit Diekspor",
      description: "File CSV telah berhasil diunduh",
    });
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Mobile": return <Smartphone className="h-4 w-4" />;
      case "Tablet": return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-green-100 text-green-800";
      case "UPDATE": return "bg-blue-100 text-blue-800";
      case "DELETE": return "bg-red-100 text-red-800";
      case "VIEW": return "bg-gray-100 text-gray-800";
      case "LOGIN": return "bg-purple-100 text-purple-800";
      case "LOGOUT": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const uniqueUsers = [...new Set(auditEntries.map(entry => entry.username))];
  const uniqueResources = [...new Set(auditEntries.map(entry => entry.resource))];
  const uniqueActions = [...new Set(auditEntries.map(entry => entry.action))];

  return (
    <Layout pageTitle="Audit Trail">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Audit Trail System
            </CardTitle>
            <CardDescription>
              Monitor dan lacak semua aktivitas CRUD dalam sistem koperasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari aktivitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua User</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedResource} onValueChange={setSelectedResource}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Resource</SelectItem>
                  {uniqueResources.map(resource => (
                    <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Action</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Tanggal Mulai"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Tanggal Selesai"
              />
              <div className="flex gap-2">
                <Button onClick={exportAuditLog} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handleClearAudit} variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{filteredEntries.length}</div>
                  <p className="text-xs text-muted-foreground">Total Aktivitas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{uniqueUsers.length}</div>
                  <p className="text-xs text-muted-foreground">Unique Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {filteredEntries.filter(e => e.action === "CREATE").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Create Actions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {filteredEntries.filter(e => e.action === "DELETE").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Delete Actions</p>
                </CardContent>
              </Card>
            </div>

            {/* Audit Table */}
            <ScrollArea className="h-96 w-full border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-xs">
                        {format(new Date(entry.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: id })}
                      </TableCell>
                      <TableCell className="font-medium">{entry.username}</TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(entry.action)}>
                          {entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.resource}</TableCell>
                      <TableCell className="max-w-xs truncate">{entry.details}</TableCell>
                      <TableCell className="text-xs">{entry.ipAddress}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(entry.device)}
                          <span className="text-xs">{entry.device}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{entry.browser} / {entry.os}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data audit trail yang ditemukan
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
