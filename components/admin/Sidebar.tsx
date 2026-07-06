"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminSideBarLinks } from "@/constants";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[260px] flex-col justify-between bg-white px-5 py-10 sm:flex border-r border-light-400">
      <div>
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/icons/admin/logo.svg" alt="logo" width={37} height={37} />
          <h1 className="text-2xl font-semibold text-dark-100">
            BookWise
            <span className="ml-2 rounded-sm bg-primary-admin px-2 py-0.5 text-xs text-white">
              ADMIN
            </span>
          </h1>
        </Link>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link
                key={link.route}
                href={link.route}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                  isSelected
                    ? "bg-primary-admin text-white"
                    : "text-dark-400 hover:bg-light-300"
                )}
              >
                <div
                  className={cn(
                    "relative size-5",
                    isSelected ? "brightness-0 invert" : ""
                  )}
                >
                  <Image
                    src={link.img}
                    alt={link.text}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className={cn("font-medium", isSelected ? "font-semibold text-white" : "text-dark-400")}>
                  {link.text}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border border-light-400 rounded-full px-2 py-2 mt-4 bg-light-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary-admin text-white font-semibold">
              {getInitials(session?.user?.name || "IN")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-semibold text-dark-100 truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-light-500 truncate">{session?.user?.email}</p>
          </div>
        </div>

        <button 
          className="p-2 shrink-0" 
          onClick={() => {
            // Action handled outside or add client action
          }}
        >
          <Image src="/icons/logout.svg" alt="logout" width={20} height={20} className="filter invert-[35%] sepia-[75%] saturate-[2229%] hue-rotate-[336deg] brightness-[98%] contrast-[95%]" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
