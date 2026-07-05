"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
}

const Pagination = ({ page, totalPages }: Props) => {
  const router = useRouter();

  const handleNavigation = (type: "prev" | "next") => {
    const pageNumber = type === "prev" ? page - 1 : page + 1;
    router.push(`?page=${pageNumber}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div id="pagination" className="mt-8">
      <Button
        className="pagination-btn_dark"
        onClick={() => handleNavigation("prev")}
        disabled={page <= 1}
      >
        Prev
      </Button>

      <p className="text-light-100">
        {page} of {totalPages}
      </p>

      <Button
        className="pagination-btn_dark"
        onClick={() => handleNavigation("next")}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
