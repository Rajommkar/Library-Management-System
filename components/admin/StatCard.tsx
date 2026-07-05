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
    <div className="flex flex-1 flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className="flex size-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <Image
            src={icon}
            alt={title}
            width={24}
            height={24}
            style={{
              filter: `invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%)`,
              // Using CSS filter for colored icon, though ideally would use colored SVG
            }}
          />
        </div>

        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
            change >= 0
              ? "bg-green-100 text-green-800"
              : "bg-red-50 text-red-800"
          )}
        >
          {change >= 0 ? "+" : ""}
          {change} from last week
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-dark-100">{count}</h3>
        <p className="text-sm font-medium text-light-500">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
