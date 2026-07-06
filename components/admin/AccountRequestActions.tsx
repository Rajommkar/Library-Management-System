"use client";

import React, { useState } from "react";
import { updateUserStatus } from "@/lib/actions/admin";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountRequestActions = ({ user }: { user: any }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [denyOpen, setDenyOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    const res = await updateUserStatus(user.id, "APPROVED");
    
    if (res.success) {
      toast({ title: "Success", description: "Account approved successfully." });
      window.location.reload();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
    setLoading(false);
    setApproveOpen(false);
  };

  const handleDeny = async () => {
    setLoading(true);
    const res = await updateUserStatus(user.id, "REJECTED");
    
    if (res.success) {
      toast({ title: "Success", description: "Account request denied." });
      window.location.reload();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
    setLoading(false);
    setDenyOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogTrigger asChild>
          <button
            disabled={loading}
            className="rounded-md bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            Approve Account
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-md bg-white p-8 text-center sm:rounded-2xl flex flex-col items-center border-none">
          <button onClick={() => setApproveOpen(false)} className="absolute right-4 top-4 text-light-500 hover:text-dark-100">
            <Image src="/icons/admin/close.svg" alt="Close" width={20} height={20} />
          </button>
          
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
              <Image src="/icons/admin/check.svg" alt="check" width={20} height={20} className="filter brightness-0 invert" />
            </div>
          </div>
          <AlertDialogHeader className="mb-6 flex flex-col items-center text-center space-y-0">
            <AlertDialogTitle className="text-xl font-bold text-dark-400">Approve Account Request</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-dark-100 mt-2 max-w-[280px]">
              Approve the student's account request and grant access. A confirmation email will be sent upon approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex-col sm:flex-col gap-2 sm:space-x-0">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="w-full rounded-md bg-[#487355] py-3 text-sm font-bold text-white hover:bg-[#3b5e45] transition-colors disabled:opacity-50"
            >
              {loading ? "Approving..." : "Approve & Send Confirmation"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={denyOpen} onOpenChange={setDenyOpen}>
        <AlertDialogTrigger asChild>
          <button 
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50"
          >
            <Image src="/icons/admin/close.svg" alt="Deny" width={12} height={12} className="filter invert-[35%] sepia-[57%] saturate-[2805%] hue-rotate-[340deg] brightness-[98%] contrast-[92%]" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-md bg-white p-8 text-center sm:rounded-2xl flex flex-col items-center border-none">
          <button onClick={() => setDenyOpen(false)} className="absolute right-4 top-4 text-light-500 hover:text-dark-100">
            <Image src="/icons/admin/close.svg" alt="Close" width={20} height={20} />
          </button>
          
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Image src="/icons/admin/info.svg" alt="warning" width={24} height={24} className="filter invert-[35%] sepia-[57%] saturate-[2805%] hue-rotate-[340deg] brightness-[98%] contrast-[92%]" />
          </div>
          <AlertDialogHeader className="mb-6 flex flex-col items-center text-center space-y-0">
            <AlertDialogTitle className="text-xl font-bold text-dark-400">Deny Account Request</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-dark-100 mt-2 max-w-[280px]">
              Denying this request will notify the student they're not eligible due to unsuccessful ID card verification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex-col sm:flex-col gap-2 sm:space-x-0">
            <button
              onClick={handleDeny}
              disabled={loading}
              className="w-full rounded-md bg-red-400 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Denying..." : "Deny & Notify Student"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountRequestActions;
