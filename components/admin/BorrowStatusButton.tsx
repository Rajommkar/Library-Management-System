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
  currentStatus: "BORROWED" | "RETURNED";
  dueDate: string;
}

const BorrowStatusButton = ({ borrowId, currentStatus, dueDate }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"BORROWED" | "RETURNED">(currentStatus);

  const isLate = currentStatus === "BORROWED" && dayjs().isAfter(dayjs(dueDate), "day");
  
  // Determine visual state
  let visualState = status === "RETURNED" ? "RETURNED" : isLate ? "LATE_RETURN" : "BORROWED";

  const getBadgeStyle = (state: string) => {
    switch (state) {
      case "BORROWED":
        return "bg-[#F3E8FF] text-[#9333EA]"; // purple
      case "RETURNED":
        return "bg-[#E0F2FE] text-[#0284C7]"; // blue
      case "LATE_RETURN":
        return "bg-[#FEE2E2] text-[#EF4444]"; // red
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLabel = (state: string) => {
    switch (state) {
      case "BORROWED": return "Borrowed";
      case "RETURNED": return "Returned";
      case "LATE_RETURN": return "Late Return";
      default: return state;
    }
  };

  const handleStatusChange = async (value: "BORROWED" | "RETURNED") => {
    if (value === currentStatus) return;
    
    if (value === "RETURNED") {
      if (!window.confirm("Are you sure you want to mark this book as returned?")) {
        return;
      }
    }

    setLoading(true);
    setStatus(value); // optimistic update
    
    const res = await updateBorrowStatus(borrowId, value);
    
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
    <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
      <SelectTrigger
        className={`h-8 w-[110px] rounded-full border-none px-4 py-1 text-xs font-semibold focus:ring-0 [&>span>svg]:hidden flex items-center justify-center ${getBadgeStyle(visualState)}`}
      >
        <SelectValue asChild>
          <span>{getLabel(visualState)}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-none shadow-lg p-2 min-w-[140px] z-[100]">
        <SelectItem 
          value="BORROWED" 
          className="rounded-lg mb-1 text-sm font-semibold cursor-pointer text-[#9333EA] focus:bg-[#F3E8FF] focus:text-[#9333EA] data-[state=checked]:bg-[#F3E8FF]"
        >
          Borrowed
        </SelectItem>
        <SelectItem 
          value="RETURNED" 
          className="rounded-lg text-sm font-semibold cursor-pointer text-[#0284C7] focus:bg-[#E0F2FE] focus:text-[#0284C7] data-[state=checked]:bg-[#E0F2FE]"
        >
          Returned
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default BorrowStatusButton;
