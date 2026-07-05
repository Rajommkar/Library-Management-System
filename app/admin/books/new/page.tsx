import React from "react";
import BookForm from "@/components/admin/BookForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AddNewBook = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-dark-100">Add New Book</h2>
          <p className="text-light-500 mt-1">Fill in the details to add a new book to the library.</p>
        </div>
        <Link href="/admin/books">
          <Button variant="outline">Back to Books</Button>
        </Link>
      </div>

      <div className="bg-white p-5 sm:p-10 rounded-xl shadow-sm max-w-4xl">
        <BookForm type="create" />
      </div>
    </div>
  );
};

export default AddNewBook;
