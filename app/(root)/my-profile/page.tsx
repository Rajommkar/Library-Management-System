import React from "react";
import { auth } from "@/auth";
import { getBorrowedBooks } from "@/lib/actions/book";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BookCard from "@/components/BookCard";

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
                    <div className="flex justify-between items-center bg-dark-300 px-3 py-2 rounded-md border border-light-100/10">
                      <p className="text-xs text-light-700 font-semibold">Borrowed</p>
                      <p className="text-xs text-white">{new Date(record.borrow.borrowDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between items-center bg-dark-300 px-3 py-2 rounded-md border border-light-100/10">
                      <p className="text-xs text-light-700 font-semibold">Due</p>
                      <p className="text-xs text-white">{new Date(record.borrow.dueDate).toLocaleDateString()}</p>
                    </div>

                    <Button className="w-full bg-light-300 text-dark-300 hover:bg-light-300/80 font-bebas-neue mt-2">
                      <Image src="/icons/book.svg" alt="receipt" width={20} height={20} className="mr-2" />
                      Download Receipt
                    </Button>
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
