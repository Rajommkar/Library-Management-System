import React from "react";
import { getBookById } from "@/lib/actions/book";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookCover from "@/components/BookCover";
import BookVideo from "@/components/BookVideo";
import Image from "next/image";

const BookDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const result = await getBookById(id);
  const book = result.success ? result.data : null;

  if (!book) return <div>Book not found</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/books"
          className="flex items-center gap-2 text-dark-400 font-semibold text-sm hover:text-primary-admin"
        >
          <span className="text-xl leading-none mb-[2px]">&lt;</span> Go back
        </Link>
        <Button asChild className="bg-primary-admin hover:bg-primary-admin/90 text-white">
          <Link href={`/admin/books/${id}/edit`}>
            <Image src="/icons/admin/edit.svg" alt="edit" width={16} height={16} className="mr-2 filter brightness-0 invert" />
            Edit Book
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col rounded-xl bg-white p-8 shadow-sm border border-light-400 gap-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <BookCover
              variant="regular"
              coverColor={book.coverColor}
              coverImage={book.coverUrl}
            />
            
            <div className="flex flex-col flex-1 gap-5">
              <div>
                <p className="text-sm font-semibold text-light-500 mb-1">Title</p>
                <h3 className="text-xl font-semibold text-dark-400">{book.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm font-semibold text-light-500 mb-1">Author</p>
                  <p className="font-semibold text-dark-400">{book.author}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-light-500 mb-1">Genre</p>
                  <p className="font-semibold text-dark-400">{book.genre}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-light-500 mb-1">Rating</p>
                  <div className="flex items-center gap-1 font-semibold text-dark-400">
                    <Image src="/icons/star.svg" alt="star" width={16} height={16} />
                    {book.rating} / 5
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-semibold text-light-500 mb-1">Total Copies</p>
                    <p className="font-semibold text-dark-400">{book.totalCopies}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-light-500 mb-1">Available</p>
                    <p className="font-semibold text-dark-400">{book.availableCopies}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-semibold text-dark-400">Description</h4>
            <p className="text-sm text-dark-100 leading-relaxed text-justify">
              {book.description}
            </p>
            <p className="text-sm text-dark-100 leading-relaxed text-justify mt-2">
              {book.summary}
            </p>
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col rounded-xl bg-white p-8 shadow-sm border border-light-400 h-fit gap-6">
          <h4 className="text-lg font-semibold text-dark-400">Video</h4>
          <BookVideo videoUrl={book.videoUrl} />
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
