"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { navigationLinks } from "@/constants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

interface Props {
  session: Session;
}

const Header = ({ session }: Props) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        {navigationLinks.map(({ href, label, img, selectedImg }) => {
          const isSelected = pathname === href;
          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "text-base cursor-pointer capitalize",
                  isSelected ? "text-[#EED1AC]" : "text-[#D6E0FF]"
                )}
              >
                {img ? (
                  <Image
                    src={isSelected && selectedImg ? selectedImg : img}
                    alt={label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                ) : (
                  label
                )}
              </Link>
            </li>
          );
        })}

        <li>
          <Link href="/my-profile" className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback className="bg-[#232839] text-[#D6E0FF] font-semibold">
                {getInitials(session?.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-medium capitalize max-sm:hidden">
              {session?.user?.name?.split(" ")[0]}
            </span>
          </Link>
        </li>
        <li>
          <button 
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            className="flex items-center"
          >
            <Image src="/icons/logout.svg" alt="Logout" width={24} height={24} className="opacity-70 hover:opacity-100 transition-opacity" />
          </button>
        </li>
      </ul>
    </header>
  );
};

export default Header;
