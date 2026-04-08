
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, AlertTriangle } from "lucide-react";
import { Pengaturan } from "@/types";
import { toast } from "sonner";

interface NotificationSettingsProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function NotificationSettings({ settings, setSettings }: NotificationSettingsProps) {
  const notificationSettings = settings.notifications || {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    transactionAlerts: true,
    dueDateReminders: true,
    systemUpdates: false,
    marketingEmails: false,
    reminderTiming: "3", // days before due date
    emailFrequency: "immediate"
  };

  const updateNotificationSettings = (key: string, value: any) => {
    const updatedSettings = {
      ...settings,
      notifications: {
        ...notificationSettings,
        [key]: value
      }
    };
    setSettings(updatedSettings);
  };

  const handleSave = () => {
    // Save to localStorage through pengaturanService
    import('@/services/pengaturanService').then(({ savePengaturan }) => {
      savePengaturan(settings);
      toast.success("Pengaturan notifikasi berhasil disimpan");
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Saluran Notifikasi
          </CardTitle>
          <CardDescription>
            Pilih cara Anda ingin menerima notifikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
              </div>
            </div>
            <Switch
              checked={notificationSettings.emailEnabled}
              onCheckedChange={(checked) => updateNotificationSettings('emailEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-green-500" />
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Terima notifikasi push di browser</p>
              </div>
            </div>
            <Switch
              checked={notificationSettings.pushEnabled}
              onCheckedChange={(checked) => updateNotificationSettings('pushEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Terima notifikasi melalui SMS</p>
              </div>
            </div>
            <Switch
              checked={notificationSettings.smsEnabled}
              onCheckedChange={(checked) => updateNotificationSettings('smsEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Jenis Notifikasi
          </CardTitle>
          <CardDescription>
            Pilih jenis notifikasi yang ingin Anda terima
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Peringatan Transaksi</Label>
              <p className="text-sm text-muted-foreground">Notifikasi untuk transaksi baru</p>
            </div>
            <Switch
              checked={notificationSettings.transactionAlerts}
              onCheckedChange={(checked) => updateNotificationSettings('transactionAlerts', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Pengingat Jatuh Tempo</Label>
              <p className="text-sm text-muted-foreground">Pengingat untuk angsuran yang akan jatuh tempo</p>
            </div>
            <Switch
              checked={notificationSettings.dueDateReminders}
              onCheckedChange={(checked) => updateNotificationSettings('dueDateReminders', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Update Sistem</Label>
              <p className="text-sm text-muted-foreground">Notifikasi tentang update dan maintenance</p>
            </div>
            <Switch
              checked={notificationSettings.systemUpdates}
              onCheckedChange={(checked) => updateNotificationSettings('systemUpdates', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Email Marketing</Label>
              <p className="text-sm text-muted-foreground">Newsletter dan promosi</p>
            </div>
            <Switch
              checked={notificationSettings.marketingEmails}
              onCheckedChange={(checked) => updateNotificationSettings('marketingEmails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Timing */}
      <Card>
        <CardHeader>
          <CardTitle>Waktu Pengingat</CardTitle>
          <CardDescription>
            Atur kapan Anda ingin menerima pengingat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pengingat Jatuh Tempo</Label>
            <Select
              value={notificationSettings.reminderTiming}
              onValueChange={(value) => updateNotificationSettings('reminderTiming', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih waktu pengingat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hari sebelumnya</SelectItem>
                <SelectItem value="3">3 hari sebelumnya</SelectItem>
                <SelectItem value="7">7 hari sebelumnya</SelectItem>
                <SelectItem value="14">14 hari sebelumnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Frekuensi Email</Label>
            <Select
              value={notificationSettings.emailFrequency}
              onValueChange={(value) => updateNotificationSettings('emailFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih frekuensi email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Segera</SelectItem>
                <SelectItem value="hourly">Setiap Jam</SelectItem>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-6">
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
