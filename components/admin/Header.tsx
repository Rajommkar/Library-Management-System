import React from "react";
import Image from "next/image";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="flex items-center justify-between border-b border-light-400 bg-white px-5 py-4 sm:px-10">
      <div>
        <h2 className="text-2xl font-semibold text-dark-100">
          Welcome, {session?.user?.name}
        </h2>
        <p className="text-sm text-light-500">
          Monitor all library activities from here
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-10 w-64 items-center gap-2 rounded-full border border-light-400 bg-light-300 px-4">
          <Image src="/icons/search.svg" alt="search" width={20} height={20} />
          <input
            type="text"
            placeholder="Search users, books..."
            className="w-full bg-transparent text-sm font-medium text-dark-100 outline-none placeholder:text-light-500"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
