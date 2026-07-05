import React from "react";
import BookForm from "@/components/admin/BookForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBookById } from "@/lib/actions/book";
import { redirect } from "next/navigation";

const EditBook = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const result = await getBookById(id);
  
  if (!result.success || !result.data) {
    redirect("/admin/books");
  }

  const book = result.data;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-dark-100">Edit Book</h2>
          <p className="text-light-500 mt-1">Update details for "{book.title}"</p>
        </div>
        <Link href="/admin/books">
          <Button variant="outline">Back to Books</Button>
        </Link>
      </div>

      <div className="bg-white p-5 sm:p-10 rounded-xl shadow-sm max-w-4xl">
        <BookForm type="update" book={book} />
      </div>
    </div>
  );
};

export default EditBook;
