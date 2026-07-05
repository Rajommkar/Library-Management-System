import React from "react";
import { getAllUsers } from "@/lib/actions/admin";
import dayjs from "dayjs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import UserActions from "@/components/admin/UserActions";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const query = (params?.query as string) || "";

  const result = await getAllUsers({ page, query });
  const users = result.success ? result.data : [];
  const totalPages = result.metadata?.totalPages || 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-dark-100">All Users</h2>
      </div>

      <div className="mb-5 bg-white p-5 rounded-xl">
        <Search />
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-light-400 text-light-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Date Joined</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-400">
            {users.map((user: any) => (
              <tr key={user.id} className="text-dark-100 hover:bg-light-300">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary-admin text-white">
                        {getInitials(user.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.fullname}</p>
                      <p className="text-xs text-light-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {dayjs(user.createAt).format("DD MMM YYYY")}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : user.status === "REJECTED"
                        ? "bg-red-50 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4">
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

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};

export default UsersPage;
