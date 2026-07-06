"use client";

import React, { useState } from "react";
import { updateBorrowStatus } from "@/lib/actions/admin";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

interface Props {
  borrowId: string;
  currentStatus: "PENDING" | "BORROWED" | "RETURNED" | "REJECTED";
  dueDate: string;
}

const BorrowStatusButton = ({ borrowId, currentStatus, dueDate }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"PENDING" | "BORROWED" | "RETURNED" | "REJECTED">(currentStatus);

  let visualState = status as string;
  if (status === "BORROWED" && dayjs().isAfter(dayjs(dueDate), "day")) {
    visualState = "LATE_RETURN";
  }

  const getBadgeStyle = (state: string) => {
    switch (state) {
      case "PENDING":
        return "bg-orange-100 text-orange-600";
      case "BORROWED":
        return "bg-[#F3E8FF] text-[#9333EA]"; // purple
      case "RETURNED":
        return "bg-[#E0F2FE] text-[#0284C7]"; // blue
      case "LATE_RETURN":
        return "bg-[#FEE2E2] text-[#EF4444]"; // red
      case "REJECTED":
        return "bg-gray-100 text-gray-600"; // gray
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLabel = (state: string) => {
    switch (state) {
      case "PENDING": return "Pending";
      case "BORROWED": return "Borrowed";
      case "RETURNED": return "Returned";
      case "LATE_RETURN": return "Late Return";
      case "REJECTED": return "Rejected";
      default: return state;
    }
  };

  const handleStatusChange = async (value: "PENDING" | "BORROWED" | "RETURNED" | "REJECTED") => {
    if (value === currentStatus) return;
    
    if (value === "RETURNED") {
      if (!window.confirm("Are you sure you want to mark this book as returned?")) {
        return;
      }
    }
    
    if (value === "REJECTED") {
      if (!window.confirm("Are you sure you want to reject this borrow request?")) {
        return;
      }
    }

    setLoading(true);
    setStatus(value); // optimistic update
    
    const res = await updateBorrowStatus(borrowId, value as any);
    
    if (res.success) {
      toast({ title: "Success", description: `Book marked as ${value.toLowerCase()}` });
      window.location.reload();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
      setStatus(currentStatus); // revert on error
    }
    setLoading(false);
  };

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={loading || status === "REJECTED"}>
      <SelectTrigger
        className={`h-8 w-[110px] rounded-full border-none px-4 py-1 text-xs font-semibold focus:ring-0 [&>span>svg]:hidden flex items-center justify-center ${getBadgeStyle(visualState)}`}
      >
        <SelectValue asChild>
          <span>{getLabel(visualState)}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-none shadow-lg p-2 min-w-[140px] z-[100]">
        {status === "PENDING" && (
          <>
            <SelectItem value="PENDING" className="rounded-lg mb-1 text-sm font-semibold cursor-pointer text-orange-600 focus:bg-orange-100 focus:text-orange-600 data-[state=checked]:bg-orange-100">
              Pending
            </SelectItem>
            <SelectItem value="BORROWED" className="rounded-lg mb-1 text-sm font-semibold cursor-pointer text-[#9333EA] focus:bg-[#F3E8FF] focus:text-[#9333EA]">
              Approve (Borrow)
            </SelectItem>
            <SelectItem value="REJECTED" className="rounded-lg text-sm font-semibold cursor-pointer text-gray-600 focus:bg-gray-100 focus:text-gray-600">
              Reject
            </SelectItem>
          </>
        )}
        {(status === "BORROWED" || status === "RETURNED") && (
          <>
            <SelectItem value="BORROWED" className="rounded-lg mb-1 text-sm font-semibold cursor-pointer text-[#9333EA] focus:bg-[#F3E8FF] focus:text-[#9333EA] data-[state=checked]:bg-[#F3E8FF]">
              Borrowed
            </SelectItem>
            <SelectItem value="RETURNED" className="rounded-lg text-sm font-semibold cursor-pointer text-[#0284C7] focus:bg-[#E0F2FE] focus:text-[#0284C7] data-[state=checked]:bg-[#E0F2FE]">
              Returned
            </SelectItem>
          </>
        )}
        {status === "REJECTED" && (
          <SelectItem value="REJECTED" className="rounded-lg text-sm font-semibold cursor-pointer text-gray-600 focus:bg-gray-100 focus:text-gray-600 data-[state=checked]:bg-gray-100">
            Rejected
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default BorrowStatusButton;
