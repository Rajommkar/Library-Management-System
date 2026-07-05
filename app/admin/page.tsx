import React from "react";
import StatCard from "@/components/admin/StatCard";
import { getAdminStats } from "@/lib/actions/admin";
import BookCover from "@/components/BookCover";
import dayjs from "dayjs";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AdminPage = async () => {
  const result = await getAdminStats();
  const stats = result.success ? result.data : null;

  if (!stats) return <div>Failed to load stats</div>;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Books"
          count={stats.totalBooks}
          change={stats.newBooksThisWeek}
          icon="/icons/admin/book.svg"
          color="#25388C"
        />
        <StatCard
          title="Total Users"
          count={stats.totalUsers}
          change={stats.newUsersThisWeek}
          icon="/icons/admin/users.svg"
          color="#027A48"
        />
        <StatCard
          title="Total Borrow Requests"
          count={stats.totalBorrows}
          change={stats.newBorrowsThisWeek}
          icon="/icons/admin/bookmark.svg"
          color="#E27233"
        />
      </div>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-3">
        <div className="col-span-1 flex flex-col rounded-xl bg-white p-5 shadow-sm xl:col-span-2">
          <h3 className="mb-5 text-xl font-semibold text-dark-100">
            Recently Borrowed Books
          </h3>

          <div className="flex flex-col gap-5">
            {stats.recentBorrows.map((record: any) => (
              <div
                key={record.borrow.id}
                className="flex items-center justify-between border-b border-light-400 pb-5 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <BookCover
                    variant="extraSmall"
                    coverColor={record.book.coverColor}
                    coverImage={record.book.coverUrl}
                  />
                  <div>
                    <p className="text-sm font-semibold text-dark-100">
                      {record.book.title}
                    </p>
                    <p className="text-xs text-light-500">
                      by {record.book.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary-admin text-white text-xs">
                      {getInitials(record.user.fullname)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium text-dark-100 hidden sm:block">
                    {record.user.fullname}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-5 text-xl font-semibold text-dark-100">
            Recently Joined Users
          </h3>

          <div className="flex flex-col gap-5">
            {stats.recentUsers.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center gap-4 border-b border-light-400 pb-5 last:border-b-0 last:pb-0"
              >
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary-admin text-white">
                    {getInitials(user.fullname)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-dark-100">
                    {user.fullname}
                  </p>
                  <p className="text-xs text-light-500">{user.email}</p>
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
