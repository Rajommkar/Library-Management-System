import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  count: number;
  change: number;
  icon: string;
  color: string;
}

const StatCard = ({ title, count, change, icon, color }: Props) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm border border-light-400">
      <div className="flex items-center gap-4 text-sm font-semibold text-dark-400">
        <p>{title}</p>
        <div className="flex items-center gap-1">
          {change < 0 ? (
            <span className="text-red-500 font-bold text-lg leading-none mt-[2px]">&#9662;</span> // Down triangle
          ) : (
            <span className="text-green-500 font-bold text-lg leading-none mt-[-2px]">&#9652;</span> // Up triangle
          )}
          <span className={change < 0 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
            {Math.abs(change)}
          </span>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-dark-100">{count}</h3>
    </div>
  );
};

export default StatCard;
