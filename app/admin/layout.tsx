import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css"; // Ensure admin gets base styles

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen w-full flex-row bg-white">
      <div className="flex w-full flex-row overflow-hidden">
        <Sidebar session={session} />

        <div className="flex w-full flex-1 flex-col bg-white h-screen overflow-y-auto">
          <Header session={session} />

          <div className="flex-1 p-5 sm:p-10">
            {children}
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
};

export default AdminLayout;
