import React from "react";
import { getAllBorrowRecords } from "@/lib/actions/admin";
import dayjs from "dayjs";
import BookCover from "@/components/BookCover";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import BorrowStatusButton from "@/components/admin/BorrowStatusButton";

const BorrowRecordsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const query = (params?.query as string) || "";

  const result = await getAllBorrowRecords({ page, query });
  const records = result.success ? result.data : [];
  const totalPages = result.metadata?.totalPages || 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-dark-100">Borrow Records</h2>
      </div>

      <div className="mb-5 bg-white p-5 rounded-xl">
        <Search />
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-light-400 text-light-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Book</th>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Borrow Date</th>
              <th className="px-4 py-3 font-semibold">Due Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-400">
            {records.map((record: any) => (
              <tr key={record.borrow.id} className="text-dark-100 hover:bg-light-300">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <BookCover
                      variant="extraSmall"
                      coverColor={record.book.coverColor}
                      coverImage={record.book.coverUrl}
                    />
                    <p className="font-semibold max-w-[150px] truncate" title={record.book.title}>{record.book.title}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary-admin text-white text-xs">
                        {getInitials(record.user.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{record.user.fullname}</p>
                      <p className="text-xs text-light-500 max-w-[150px] truncate" title={record.user.email}>{record.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {dayjs(record.borrow.borrowDate).format("DD MMM YYYY")}
                </td>
                <td className="px-4 py-4">
                  {dayjs(record.borrow.dueDate).format("DD MMM YYYY")}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      record.borrow.status === "RETURNED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.borrow.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <BorrowStatusButton
                    borrowId={record.borrow.id}
                    currentStatus={record.borrow.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {records.length === 0 && (
          <p className="p-5 text-center text-light-500">No borrow records found</p>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};

export default BorrowRecordsPage;
