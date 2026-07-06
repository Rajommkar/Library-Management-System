import React from "react";
import { getAllUsers } from "@/lib/actions/admin";
import dayjs from "dayjs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import UserActions from "@/components/admin/UserActions";
import RoleDropdown from "@/components/admin/RoleDropdown";
import Link from "next/link";
import Image from "next/image";

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const query = (params?.query as string) || "";
  const sort = (params?.sort as string) || "desc"; // Or "asc"

  const result = await getAllUsers({ page, query, sort });
  const users = result.success ? result.data : [];
  const totalPages = result.metadata?.totalPages || 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm border border-light-400">
        <h2 className="text-xl font-semibold text-dark-400">All Users</h2>
        
        <Link 
          href={`/admin/users?sort=${sort === "asc" ? "desc" : "asc"}`}
          className="flex items-center gap-2 text-sm font-semibold text-dark-400 hover:text-primary-admin"
        >
          A-Z
          <Image src="/icons/admin/users.svg" alt="sort" width={16} height={16} className="opacity-60" style={{ transform: sort === "asc" ? "rotate(180deg)" : "rotate(0deg)" }} />
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-6 shadow-sm border border-light-400">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-light-400 text-light-500 pb-4">
            <tr>
              <th className="px-4 pb-4 font-semibold">Name</th>
              <th className="px-4 pb-4 font-semibold">Date Joined</th>
              <th className="px-4 pb-4 font-semibold">Role</th>
              <th className="px-4 pb-4 font-semibold">Books Borrowed</th>
              <th className="px-4 pb-4 font-semibold">University ID No</th>
              <th className="px-4 pb-4 font-semibold">University ID Card</th>
              <th className="px-4 pb-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-400 pt-4">
            {users.map((user: any) => (
              <tr key={user.id} className="text-dark-100 group hover:bg-light-100">
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary-admin text-white font-semibold">
                        {getInitials(user.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-semibold text-dark-400 text-sm">{user.fullname}</p>
                      <p className="text-xs text-light-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 font-semibold text-dark-400">
                  {dayjs(user.createAt).format("MMM DD YYYY")}
                </td>
                <td className="px-4 py-5 relative overflow-visible">
                  <RoleDropdown user={user} />
                </td>
                <td className="px-4 py-5 font-semibold text-dark-400 text-center sm:text-left">
                  {user.booksBorrowed || 0}
                </td>
                <td className="px-4 py-5 font-semibold text-dark-400">
                  {user.universityId}
                </td>
                <td className="px-4 py-5">
                  <a href={user.universityCard} target="_blank" rel="noopener noreferrer" className="text-blue-100 font-semibold flex items-center gap-1">
                    View ID Card
                    <Image src="/icons/admin/bookmark.svg" alt="link" width={14} height={14} className="opacity-80" />
                  </a>
                </td>
                <td className="px-4 py-5">
                  <UserActions user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <p className="p-5 text-center text-light-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
