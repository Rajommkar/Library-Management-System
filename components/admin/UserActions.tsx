"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateUserRole, updateUserStatus } from "@/lib/actions/admin";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={handleRoleChange}
      >
        Make {user.role === "ADMIN" ? "USER" : "ADMIN"}
      </Button>

      {user.status === "PENDING" && (
        <>
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleStatusChange("APPROVED")}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={loading}
            onClick={() => handleStatusChange("REJECTED")}
          >
            Reject
          </Button>
        </>
      )}
    </div>
  );
};

export default UserActions;
