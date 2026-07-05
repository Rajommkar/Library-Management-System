import React from "react";
import { auth } from "@/auth";
import { getBorrowedBooks } from "@/lib/actions/book";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BookCard from "@/components/BookCard";
import BookReceipt from "@/components/BookReceipt";
import { IKImage } from "imagekitio-next";

const ProfilePage = async () => {
  const session = await auth();
  if (!session) return null;

  const result = await getBorrowedBooks(session.user?.id as string);
  const borrowedBooks = result.success ? result.data : [];

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-10">
        <section className="flex flex-col w-full xl:max-w-sm gap-10">
          <div className="borrowed-book">
            <h3 className="font-bebas-neue text-2xl text-light-100 uppercase mb-4">
              My Profile
            </h3>
            
            <div className="flex flex-col gap-4 text-white">
              <p>Name: <span className="font-semibold text-primary">{session.user?.name}</span></p>
              <p>Email: <span className="font-semibold text-primary">{session.user?.email}</span></p>
            </div>

            {/* University Card Display */}
            <div className="mt-8">
              <p className="text-sm text-light-500 mb-2">University ID Card:</p>
              <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-dark-300">
                <Image
                  src={(session.user as any)?.universityCard || "/images/no-books.png"}
                  alt="University Card"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-8">
          <h2 className="font-bebas-neue text-4xl text-light-100">
            Borrowed Books
          </h2>

          {borrowedBooks.length > 0 ? (
            <ul className="book-list">
              {borrowedBooks.map((record: any) => (
                <div key={record.borrow.id} className="flex flex-col gap-4">
                  <BookCard {...record.book} isLoanedBook />
                  
                  <div className="flex flex-col gap-2 mt-2 w-full xs:w-52">
                    {/* The receipt component (usually toggled via modal, but we show it inline or hide it behind a button in full version. For now we just render it below the book.) */}
                    <div className="mt-4 scale-[0.6] origin-top-left xl:scale-75">
                      <BookReceipt 
                        title={record.book.title}
                        author={record.book.author}
                        borrowDate={new Date(record.borrow.borrowDate).toDateString()}
                        dueDate={new Date(record.borrow.dueDate).toDateString()}
                        universityId={(session.user as any)?.universityId || 123456}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-dark-300 rounded-xl">
              <Image src="/icons/book.svg" alt="No books" width={50} height={50} className="opacity-50" />
              <p className="text-light-100 mt-4 text-lg">You haven't borrowed any books yet.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ProfilePage;
