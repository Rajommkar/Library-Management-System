import React from "react";
import { getAllBooks } from "@/lib/actions/book";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookCover from "@/components/BookCover";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";

const AdminBooksPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const query = (params?.query as string) || "";

  const result = await getAllBooks({ page, query });
  const books = result.success ? result.data : [];
  const totalPages = result.metadata?.totalPages || 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-dark-100">All Books</h2>
        <Link href="/admin/books/new">
          <Button className="bg-primary-admin hover:bg-primary-admin/90">
            + Add New Book
          </Button>
        </Link>
      </div>

      <div className="mb-5 bg-white p-5 rounded-xl">
        <Search />
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-light-400 text-light-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Book</th>
              <th className="px-4 py-3 font-semibold">Author</th>
              <th className="px-4 py-3 font-semibold">Genre</th>
              <th className="px-4 py-3 font-semibold">Availability</th>
              <th className="px-4 py-3 font-semibold">Date Added</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-400">
            {books.map((book: any) => (
              <tr key={book.id} className="text-dark-100 hover:bg-light-300">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <BookCover
                      variant="extraSmall"
                      coverColor={book.coverColor}
                      coverImage={book.coverUrl}
                    />
                    <p className="font-semibold">{book.title}</p>
                  </div>
                </td>
                <td className="px-4 py-4">{book.author}</td>
                <td className="px-4 py-4">{book.genre}</td>
                <td className="px-4 py-4">
                  {book.availableCopies} / {book.totalCopies}
                </td>
                <td className="px-4 py-4">
                  {dayjs(book.createdAt).format("DD MMM YYYY")}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/books/${book.id}/edit`}
                    className="font-medium text-primary-admin hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {books.length === 0 && (
          <p className="p-5 text-center text-light-500">No books found</p>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};

export default AdminBooksPage;
