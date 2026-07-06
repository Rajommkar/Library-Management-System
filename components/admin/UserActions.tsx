"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateUserRole, updateUserStatus, deleteUser } from "@/lib/actions/admin";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const UserActions = ({ user }: { user: any }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: "APPROVED" | "REJECTED") => {
    setLoading(true);
    const res = await updateUserStatus(user.id, status);
    
    if (res.success) {
      toast({ title: "Success", description: `User status updated to ${status}` });
      window.location.reload();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleRoleChange = async () => {
    setLoading(true);
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const res = await updateUserRole(user.id, newRole);
    
    if (res.success) {
      toast({ title: "Success", description: `User role updated to ${newRole}` });
      window.location.reload();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setLoading(true);
    const res = await deleteUser(user.id);
    
    if (res.success) {
      toast({ title: "Success", description: "User deleted successfully" });
      window.location.reload();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        disabled={loading}
        onClick={handleDeleteUser}
        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
      >
        <Image src="/icons/admin/trash.svg" alt="delete" width={20} height={20} className="filter invert-[40%] sepia-[68%] saturate-[2280%] hue-rotate-[336deg] brightness-[98%] contrast-[95%]" />
      </button>
    </div>
  );
};

export default UserActions;
