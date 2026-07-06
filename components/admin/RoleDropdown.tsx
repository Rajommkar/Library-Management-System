"use client";

import React, { useState } from "react";
import { updateUserRole } from "@/lib/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const RoleDropdown = ({ user }: { user: any }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: "USER" | "ADMIN") => {
    if (user.role === newRole) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const res = await updateUserRole(user.id, newRole);
    
    if (res.success) {
      toast({ title: "Success", description: `User role updated to ${newRole === 'ADMIN' ? 'Admin' : 'User'}` });
      window.location.reload();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity",
          user.role === "ADMIN" ? "bg-green-100 text-green-800" : "bg-red-50 text-red-500"
        )}
      >
        {user.role === "ADMIN" ? "Admin" : "User"}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-20 flex flex-col gap-1 rounded-xl bg-white p-2 shadow-lg ring-1 ring-light-400 min-w-[120px]">
            <button
              onClick={() => handleRoleChange("USER")}
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold hover:bg-light-100 w-full"
            >
              <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full w-full text-left">User</span>
              {user.role !== "ADMIN" && <span className="ml-2 text-dark-400">✓</span>}
            </button>
            <button
              onClick={() => handleRoleChange("ADMIN")}
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold hover:bg-light-100 w-full"
            >
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full w-full text-left">Admin</span>
              {user.role === "ADMIN" && <span className="ml-2 text-dark-400">✓</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleDropdown;
