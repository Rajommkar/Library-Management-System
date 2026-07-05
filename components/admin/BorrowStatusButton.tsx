"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateBorrowStatus } from "@/lib/actions/admin";
import { useToast } from "@/hooks/use-toast";

interface Props {
  borrowId: string;
  currentStatus: "BORROWED" | "RETURNED";
}

const BorrowStatusButton = ({ borrowId, currentStatus }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    if (!window.confirm("Are you sure you want to mark this book as returned?")) {
      return;
    }

    setLoading(true);
    const res = await updateBorrowStatus(borrowId, "RETURNED");
    
    if (res.success) {
      toast({ title: "Success", description: "Book marked as returned" });
      window.location.reload();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
    setLoading(false);
  };

  if (currentStatus === "RETURNED") {
    return (
      <span className="text-sm font-medium text-light-500">
        Returned
      </span>
    );
  }

  return (
    <Button
      size="sm"
      disabled={loading}
      onClick={handleReturn}
      className="bg-primary-admin hover:bg-primary-admin/90"
    >
      Mark Returned
    </Button>
  );
};

export default BorrowStatusButton;
