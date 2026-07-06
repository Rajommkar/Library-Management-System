import React from "react";
import StatCard from "@/components/admin/StatCard";
import { getAdminStats } from "@/lib/actions/admin";
import BookCover from "@/components/BookCover";
import dayjs from "dayjs";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";

const AdminPage = async () => {
  const result = await getAdminStats();
  const stats = result.success ? result.data : null;

  if (!stats) return <div>Failed to load stats</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Borrowed Books"
          count={stats.totalBorrows}
          change={-stats.newBorrowsThisWeek} // Mocking the negative sign as per design
          icon="" color=""
        />
        <StatCard
          title="Total Users"
          count={stats.totalUsers}
          change={stats.newUsersThisWeek}
          icon="" color=""
        />
        <StatCard
          title="Total Books"
          count={stats.totalBooks}
          change={stats.newBooksThisWeek}
          icon="" color=""
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Borrow Requests */}
          <div className="flex flex-col rounded-xl bg-white p-6 shadow-sm border border-light-400">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-400">Borrow Requests</h3>
              <Link href="/admin/borrow-records" className="text-sm font-medium text-primary-admin bg-light-100 px-4 py-2 rounded-md">
                View all
              </Link>
            </div>

            {stats.recentBorrows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Image src="/icons/admin/bookmark.svg" alt="empty" width={60} height={60} className="mb-4 opacity-50" />
                <h4 className="text-lg font-semibold text-dark-400">No Pending Book Requests</h4>
                <p className="text-sm text-light-500 text-center max-w-xs mt-2">
                  There are no borrow book requests awaiting your review at this time.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {stats.recentBorrows.map((record: any) => (
                  <div key={record.borrow.id} className="flex items-center justify-between border-b border-light-400 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <BookCover variant="small" coverColor={record.book.coverColor} coverImage={record.book.coverUrl} />
                      <div className="flex flex-col">
                        <h4 className="text-base font-semibold text-dark-400">{record.book.title}</h4>
                        <p className="text-sm text-light-500">By {record.book.author} • {record.book.genre}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="bg-primary-admin text-white text-[10px]">
                              {getInitials(record.user.fullname)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-dark-100">{record.user.fullname}</p>
                          <span className="text-light-500 text-sm flex items-center gap-1">
                            <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                            {dayjs(record.borrow.createdAt).format("MM/DD/YY")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="flex size-10 items-center justify-center rounded-full bg-light-100">
                       <Image src="/icons/admin/eye.svg" alt="view" width={20} height={20} className="opacity-60" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Requests */}
          <div className="flex flex-col rounded-xl bg-white p-6 shadow-sm border border-light-400">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-400">Account Requests</h3>
              <Link href="/admin/account-requests" className="text-sm font-medium text-primary-admin bg-light-100 px-4 py-2 rounded-md">
                View all
              </Link>
            </div>

            {stats.accountRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Image src="/icons/admin/user.svg" alt="empty" width={60} height={60} className="mb-4 opacity-50" />
                <h4 className="text-lg font-semibold text-dark-400">No Pending Account Requests</h4>
                <p className="text-sm text-light-500 text-center max-w-xs mt-2">
                  There are currently no account requests awaiting approval.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stats.accountRequests.map((user: any) => (
                  <div key={user.id} className="flex flex-col items-center justify-center p-4 rounded-xl border border-light-400 text-center">
                    <Avatar className="size-12 mb-3">
                      <AvatarFallback className="bg-primary-admin text-white font-semibold">
                        {getInitials(user.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="text-sm font-semibold text-dark-400 line-clamp-1">{user.fullname}</h4>
                    <p className="text-xs text-light-500 line-clamp-1">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 flex flex-col rounded-xl bg-white p-6 shadow-sm border border-light-400 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-dark-400">Recently Added Books</h3>
            <Link href="/admin/books" className="text-sm font-medium text-primary-admin bg-light-100 px-4 py-2 rounded-md">
              View all
            </Link>
          </div>

          <Link href="/admin/books/new" className="flex items-center justify-center gap-2 w-full py-4 mb-6 rounded-lg border border-dashed border-primary-admin text-primary-admin font-semibold bg-light-100 hover:bg-light-300 transition-colors">
            <span className="text-xl leading-none">+</span> Add New Book
          </Link>

          <div className="flex flex-col gap-6">
            {stats.recentBooks.map((book: any) => (
              <div key={book.id} className="flex items-start gap-4">
                <BookCover variant="small" coverColor={book.coverColor} coverImage={book.coverUrl} />
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold text-dark-400 line-clamp-2">{book.title}</h4>
                  <p className="text-xs text-light-500 mt-1">By {book.author} • {book.genre}</p>
                  <span className="text-light-500 text-xs flex items-center gap-1 mt-2">
                    <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                    {dayjs(book.createdAt).format("MM/DD/YY")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
