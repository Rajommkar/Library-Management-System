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
        <h1 className="library-title">Explore Our Collection</h1>
        <p className="library-subtitle mt-5">
          Find your next great read in our extensive library
        </p>

        <Search />
      </div>

      {books.length > 0 ? (
        <div className="mt-10">
          <BookList
            title="Search Results"
            books={books}
            containerClassName="w-full"
          />

          <Pagination page={page} totalPages={totalPages} />
        </div>
      ) : (
        <div id="not-found">
          <Image
            src="/images/no-books.png"
            alt="No books found"
            width={400}
            height={400}
            className="object-contain"
          />
          <h4>No books found</h4>
          <p>We couldn't find any books matching your search. Please try a different query.</p>
        </div>
      )}
    </div>
  );
};

import Image from "next/image";

export default Library;
