import React from "react";
import { auth, signOut } from "@/auth";
import { getBorrowedBooks } from "@/lib/actions/book";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BookCard from "@/components/BookCard";
import BookReceipt from "@/components/BookReceipt";
import { IKImage } from "imagekitio-next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ProfilePage = async () => {
  const session = await auth();
  if (!session) return null;

  const result = await getBorrowedBooks(session.user?.id as string);
  const borrowedBooks = result.success ? result.data : [];

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-10">
        <section className="flex flex-col w-full xl:max-w-sm gap-10">
          <div className="relative bg-dark-300 rounded-2xl p-8 pt-12 shadow-lg border border-dark-400">
            {/* The "Clip" at the top center */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-16 bg-dark-400 rounded-b-xl border-b-2 border-dark-500 shadow-md flex items-end justify-center pb-2">
              <div className="w-6 h-2 bg-dark-800 rounded-full" />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <Avatar className="w-16 h-16 border-2 border-dark-400">
                <AvatarFallback className="bg-primary text-dark-100 font-bold text-xl">
                  {session.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <Image src="/icons/verified.svg" alt="verified" width={14} height={14} />
                  <span className="text-xs text-light-200 uppercase font-semibold">Verified Student</span>
                </div>
                <h3 className="text-xl font-bold text-white capitalize">{session.user?.name}</h3>
                <p className="text-sm text-light-200">{session.user?.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 mb-8">
              <div>
                <p className="text-xs text-light-200 mb-1">University</p>
                <p className="text-base font-semibold text-white">JS Mastery Pro</p>
              </div>
              
              <div>
                <p className="text-xs text-light-200 mb-1">Student ID</p>
                <p className="text-base font-semibold text-white">{(session.user as any)?.universityId || "234567856"}</p>
              </div>
            </div>

            <div className="relative w-full aspect-[1.58] rounded-xl overflow-hidden border-2 border-dark-400 shadow-md">
              {(session.user as any)?.universityCard ? (
                <IKImage
                  path={(session.user as any)?.universityCard as string}
                  urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                  alt="University Card"
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/images/no-books.png"
                  alt="No University Card"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-8">
          <h2 className="text-2xl font-semibold text-white">Borrowed books</h2>

          {borrowedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borrowedBooks.map((record: any) => {
                const borrowDate = new Date(record.borrow.borrowDate);
                const dueDate = new Date(record.borrow.dueDate);
                
                // Format: "Dec 31"
                const dateStr = borrowDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                // Calculate days left
                const today = new Date();
                const diffTime = dueDate.getTime() - today.getTime();
                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                // For simplicity, let's just use daysLeft logic
                const isOverdue = daysLeft < 0;
                
                return (
                  <div key={record.borrow.id} className="bg-dark-300 rounded-xl p-4 border border-dark-400 flex flex-col gap-4 relative">
                    {isOverdue && (
                      <div className="absolute top-2 left-2 z-20">
                        <Image src="/icons/warning.svg" alt="warning" width={24} height={24} />
                      </div>
                    )}
                    <BookCard {...record.book} isLoanedBook />
                    
                    <div className="flex flex-col gap-2 mt-2 w-full text-sm">
                      <div className="flex items-center gap-2 text-light-200">
                        <Image src="/icons/book-2.svg" alt="book" width={16} height={16} />
                        <span>Borrowed on {dateStr}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-light-200">
                        <div className="flex items-center gap-2">
                          {isOverdue ? (
                            <>
                              <Image src="/icons/warning.svg" alt="warning" width={16} height={16} />
                              <span className="text-red-500">Overdue Return</span>
                            </>
                          ) : (
                            <>
                              <Image src="/icons/calendar.svg" alt="calendar" width={16} height={16} />
                              <span>{daysLeft.toString().padStart(2, '0')} days left to due</span>
                            </>
                          )}
                        </div>
                        <Image src="/icons/receipt.svg" alt="receipt" width={16} height={16} className="opacity-70 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-dark-300 rounded-xl border border-dark-400">
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
