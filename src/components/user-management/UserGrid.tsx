
import { User } from "@/types/user";
import { getRoleById } from "@/services/userManagementService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { UserDetail } from "./UserDetail";

interface UserGridProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UserGrid({ users, onEdit, onDelete }: UserGridProps) {
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  if (users.length === 0) {
    return (
      <div className="text-center p-10 border rounded-md">
        <p className="text-muted-foreground">Tidak ada data pengguna</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => {
          const role = getRoleById(user.roleId);
          
          return (
            <Card key={user.id} className="overflow-hidden">
              <div className="bg-blue-50 p-4 flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.foto} alt={user.nama} />
                  <AvatarFallback className="text-2xl">
                    {user.nama.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold truncate">{user.nama}</h3>
                    {user.aktif ? (
                      <Badge className="bg-green-500">Aktif</Badge>
                    ) : (
                      <Badge variant="destructive">Nonaktif</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.username}</p>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">Jabatan:</span> {user.jabatan || "-"}
                    </div>
                    <div>
                      <span className="font-medium">Hak Akses:</span> {role?.name || "-"}
                    </div>
                    <div className="truncate">
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div>
                      <span className="font-medium">No. HP:</span> {user.noHP || "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleViewDetail(user)}>
                  <Eye className="h-4 w-4 mr-1" /> Detail
                </Button>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => onDelete(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <UserDetail 
        user={selectedUser} 
        isOpen={showUserDetail} 
        onClose={() => setShowUserDetail(false)}
      />
    </>
  );
}
