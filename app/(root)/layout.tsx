import React, { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Toaster } from "@/components/ui/toaster";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id as string))
    .limit(1);

  if (user) {
    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString() })
      .where(eq(users.id, session?.user?.id as string));
  }

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />

        <div className="mt-20 pb-20">{children}</div>
      </div>
      <Toaster />
    </main>
  );
};

export default Layout;
