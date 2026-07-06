import React from "react";
import Image from "next/image";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="flex items-center justify-between bg-transparent px-5 py-4 sm:px-10">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          Welcome, {session?.user?.name}
        </h2>
        <p className="text-sm text-light-500 mt-1">
          Monitor all of your projects and tasks here
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-full max-w-[400px] items-center gap-2 rounded-md border border-light-400 bg-white px-4 shadow-sm sm:w-[400px]">
          <Image src="/icons/admin/search.svg" alt="search" width={20} height={20} />
          <input
            type="text"
            placeholder="Search users, books by title, author, or genre."
            className="w-full bg-transparent text-sm font-medium text-dark-100 outline-none placeholder:text-light-500"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
