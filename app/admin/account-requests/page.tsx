import React from "react";
import { getPendingUsers } from "@/lib/actions/admin";
import dayjs from "dayjs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import AccountRequestActions from "@/components/admin/AccountRequestActions";
import Image from "next/image";

const AccountRequestsPage = async () => {
  const result = await getPendingUsers();
  const users = result.success ? result.data : [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center bg-white p-5 rounded-xl mb-2">
        <h2 className="text-xl font-semibold text-dark-400">Account Registration Requests</h2>
        <div className="flex items-center gap-2 text-sm text-dark-400 font-semibold cursor-pointer bg-light-300 px-3 py-1.5 rounded-md">
          Oldest to Recent
          <Image src="/icons/admin/users.svg" alt="sort" width={16} height={16} className="opacity-60 rotate-180" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-light-400 text-light-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Date Joined</th>
              <th className="px-4 py-3 font-semibold">University ID No</th>
              <th className="px-4 py-3 font-semibold">University ID Card</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
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
                      <p className="font-semibold text-dark-400">{user.fullname}</p>
                      <p className="text-xs text-light-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-dark-400">
                  {dayjs(user.createAt).format("MMM DD YYYY")}
                </td>
                <td className="px-4 py-4 font-semibold text-dark-400">{user.universityId}</td>
                <td className="px-4 py-4">
                  <a
                    href={user.universityCard}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-primary-admin hover:underline text-sm font-semibold"
                  >
                    <Image src="/icons/admin/eye.svg" alt="card" width={16} height={16} />
                    View ID Card
                  </a>
                </td>
                <td className="px-4 py-4 flex justify-center">
                  <AccountRequestActions user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <p className="p-5 text-center text-light-500">No pending account requests.</p>
        )}
      </div>
    </div>
  );
};

export default AccountRequestsPage;
