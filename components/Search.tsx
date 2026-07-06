"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }
      
      params.delete("page");
      
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, pathname, searchParams]);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className={isAdmin ? "flex h-12 w-full items-center gap-2 rounded-md border border-light-400 bg-white px-4 shadow-sm" : "search"}>
      <Image
        src={isAdmin ? "/icons/admin/search.svg" : "/icons/search-fill.svg"}
        alt="search"
        width={20}
        height={20}
        className="object-contain"
      />
      
      <Input
        type="text"
        placeholder={isAdmin ? "Search..." : "Search for books..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={isAdmin ? "w-full bg-transparent text-sm font-medium text-dark-100 outline-none placeholder:text-light-500 border-none shadow-none focus-visible:ring-0 px-0" : "search-input"}
      />
    </div>
  );
};

export default Search;
