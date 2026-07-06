import React from "react";
import { getAllBooks } from "@/lib/actions/book";
import dayjs from "dayjs";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Image from "next/image";

const AdminBooksPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const query = (params?.query as string) || "";
  const sort = (params?.sort as string) || "desc"; // Or "asc"

  const result = await getAllBooks({ page, query, sort });
  const books = result.success ? result.data : [];
  const totalPages = result.metadata?.totalPages || 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm border border-light-400">
        <h2 className="text-xl font-semibold text-dark-400">All Books</h2>
        
        <div className="flex items-center gap-6">
          <Link 
            href={`/admin/books?sort=${sort === "asc" ? "desc" : "asc"}`}
            className="flex items-center gap-2 text-sm font-semibold text-dark-400 hover:text-primary-admin"
          >
            A-Z
            <Image src="/icons/admin/users.svg" alt="sort" width={16} height={16} className="opacity-60" style={{ transform: sort === "asc" ? "rotate(180deg)" : "rotate(0deg)" }} />
          </Link>
          <Link href="/admin/books/new" className="bg-primary-admin hover:bg-primary-admin/90 text-white font-semibold text-sm px-4 py-2 rounded-md transition-colors">
            + Create a New Book
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-6 shadow-sm border border-light-400">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-light-400 text-light-500 pb-4">
            <tr>
              <th className="px-4 pb-4 font-semibold">Book Title</th>
              <th className="px-4 pb-4 font-semibold">Author</th>
              <th className="px-4 pb-4 font-semibold">Genre</th>
              <th className="px-4 pb-4 font-semibold">Date Created</th>
              <th className="px-4 pb-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-400 pt-4">
            {books.map((book: any) => (
              <tr key={book.id} className="text-dark-100 group hover:bg-light-100">
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <BookCover
                      variant="small"
                      coverColor={book.coverColor}
                      coverImage={book.coverUrl}
                    />
                    <p className="font-semibold text-dark-400 text-sm max-w-[200px] line-clamp-2">{book.title}</p>
                  </div>
                </td>
                <td className="px-4 py-5 font-semibold text-dark-400">{book.author}</td>
                <td className="px-4 py-5 font-semibold text-dark-400">{book.genre}</td>
                <td className="px-4 py-5 font-semibold text-dark-400">
                  {dayjs(book.createdAt).format("MMM DD YYYY")}
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/books/${book.id}/edit`}
                      className="p-2 text-blue-100 hover:bg-blue-100/10 rounded-full transition-colors flex items-center justify-center"
                    >
                      <Image src="/icons/admin/edit.svg" alt="edit" width={20} height={20} />
                    </Link>
                    
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center">
                      <Image src="/icons/admin/trash.svg" alt="delete" width={20} height={20} className="filter invert-[40%] sepia-[68%] saturate-[2280%] hue-rotate-[336deg] brightness-[98%] contrast-[95%]" />
                    </button>
                  </div>
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
