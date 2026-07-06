import React from "react";
import { getAllBooks } from "@/lib/actions/book";
import BookList from "@/components/BookList";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { Book } from "@/types";

const Library = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const query = (params?.query as string) || "";
  const genre = (params?.genre as string) || "";

  const result = await getAllBooks({ page, query, genre });
  const books: Book[] = result.success ? result.data : [];
  const totalPages = result.metadata?.totalPages || 0;

  return (
    <div className="flex flex-col gap-10">
      <div className="library">
        <p className="text-sm font-semibold tracking-widest text-light-200 text-center uppercase mb-2">
          Discover your next great read:
        </p>
        <h1 className="text-4xl md:text-5xl font-bebas-neue text-light-100 text-center leading-tight">
          Explore and Search for<br />
          <span className="text-white">Any Book</span> In Our Library
        </h1>

        <Search />
      </div>

      {books.length > 0 ? (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6 w-full">
            <h2 className="text-2xl font-semibold text-white">Search Results</h2>
            <div className="bg-dark-300 text-light-200 px-4 py-2 rounded-md text-sm border border-dark-400">
              Filter by: <span className="text-white font-medium">Department ▾</span>
            </div>
          </div>
          
          <BookList
            title=""
            books={books}
            containerClassName="w-full"
          />

          <Pagination page={page} totalPages={totalPages} />
        </div>
      ) : (
        <div className="mt-10">
          {query && (
            <h2 className="text-2xl font-semibold text-white mb-10">
              Search Result for <span className="text-primary">{query}</span>
            </h2>
          )}
          
          <div className="flex flex-col items-center justify-center mt-10">
            <Image
              src="/images/no-books.png"
              alt="No books found"
              width={200}
              height={200}
              className="object-contain"
            />
            <h4 className="text-xl font-semibold text-white mt-6">No Results Found</h4>
            <p className="text-light-200 mt-2 max-w-sm text-center text-sm">
              We couldn't find any books matching your search.<br/>
              Try using different keywords or check for typos.
            </p>
            <Link
              href="/library"
              className="mt-8 bg-primary text-dark-100 font-bold uppercase py-3 px-8 rounded-md text-sm hover:bg-primary/90"
            >
              Clear Search
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

import Image from "next/image";
import Link from "next/link";

export default Library;
