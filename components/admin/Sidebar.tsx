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
    <aside className="sticky top-0 left-0 hidden h-screen w-64 flex-col justify-between bg-white px-5 py-10 shadow-sm sm:flex">
      <div>
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/icons/logo.svg" alt="logo" width={37} height={37} />
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
                <p className={cn("font-medium", isSelected ? "font-semibold" : "")}>
                  {link.text}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-light-400 pt-5">
        <Avatar>
          <AvatarFallback className="bg-primary-admin text-white font-semibold">
            {getInitials(session?.user?.name || "AD")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-dark-100">
            {session?.user?.name}
          </p>
          <p className="text-xs text-light-500">{session?.user?.email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
