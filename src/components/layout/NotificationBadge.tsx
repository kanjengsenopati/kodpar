
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check } from "lucide-react";
import { 
  getNotifications, 
  getUnreadNotificationsCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  clearAllNotifications,
  NotificationItem 
} from "@/services/notificationService";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBadge() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const refreshNotifications = () => {
    const allNotifications = getNotifications();
    const unreadNotifications = getUnreadNotificationsCount();
    setNotifications(allNotifications);
    setUnreadCount(unreadNotifications);
  };

  useEffect(() => {
    refreshNotifications();
    
    // Refresh notifications every 5 seconds to catch new ones
    const interval = setInterval(refreshNotifications, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
      refreshNotifications();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    refreshNotifications();
  };

  const handleClearAll = () => {
    clearAllNotifications();
    refreshNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return "💰";
      case "accounting":
        return "📊";
      case "system":
        return "⚙️";
      default:
        return "📢";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell size={18} />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifikasi</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} baru
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Tidak ada notifikasi
          </div>
        ) : (
          <>
            <div className="flex gap-2 p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="flex-1"
              >
                <Check size={14} className="mr-1" />
                Tandai Semua
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                className="flex-1"
              >
                Hapus Semua
              </Button>
            </div>
            <DropdownMenuSeparator />
            
            <ScrollArea className="h-96">
              {notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-3 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
