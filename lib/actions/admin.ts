"use server";

import { db } from "@/database/drizzle";
import { users, borrowRecords, books } from "@/database/schema";
import { eq, desc, ilike, and, sql, ne } from "drizzle-orm";

export const getAllUsers = async (params: { query?: string; page?: number }) => {
  const { query = "", page = 1 } = params;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const conditions = query ? [ilike(users.fullname, `%${query}%`)] : [];

    const allUsers = await db
      .select()
      .from(users)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(users.createAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(conditions.length ? and(...conditions) : undefined);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(allUsers)),
      metadata: {
        totalPages: Math.ceil(Number(totalCount[0].count) / limit),
      },
    };
  } catch (error) {
    console.error("Get users error:", error);
    return { success: false, error: "Error fetching users" };
  }
};

export const updateUserStatus = async (
  userId: string,
  status: "APPROVED" | "REJECTED"
) => {
  try {
    await db.update(users).set({ status }).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    console.error("Update user status error:", error);
    return { success: false, error: "Error updating status" };
  }
};

export const updateUserRole = async (userId: string, role: "USER" | "ADMIN") => {
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    console.error("Update user role error:", error);
    return { success: false, error: "Error updating role" };
  }
};

export const getPendingUsers = async () => {
  try {
    const pending = await db
      .select()
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(desc(users.createAt));

    return { success: true, data: JSON.parse(JSON.stringify(pending)) };
  } catch (error) {
    return { success: false, error: "Error fetching pending users" };
  }
};

export const getAllBorrowRecords = async (params: {
  query?: string;
  page?: number;
}) => {
  const { query = "", page = 1 } = params;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const records = await db
      .select({
        borrow: borrowRecords,
        book: books,
        user: users,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(query ? ilike(users.fullname, `%${query}%`) : undefined)
      .orderBy(desc(borrowRecords.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(query ? ilike(users.fullname, `%${query}%`) : undefined);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(records)),
      metadata: {
        totalPages: Math.ceil(Number(totalCount[0].count) / limit),
      },
    };
  } catch (error) {
    console.error("Get borrow records error:", error);
    return { success: false, error: "Error fetching borrow records" };
  }
};

export const updateBorrowStatus = async (
  borrowId: string,
  status: "BORROWED" | "RETURNED"
) => {
  try {
    const record = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.id, borrowId))
      .limit(1);

    if (!record.length) return { success: false, error: "Record not found" };

    await db
      .update(borrowRecords)
      .set({
        status,
        returnDate: status === "RETURNED" ? new Date().toDateString() : null,
      })
      .where(eq(borrowRecords.id, borrowId));

    if (status === "RETURNED") {
      await db
        .update(books)
        .set({ availableCopies: sql`available_copies + 1` })
        .where(eq(books.id, record[0].bookId));
    }

    return { success: true };
  } catch (error) {
    console.error("Update borrow status error:", error);
    return { success: false, error: "Error updating borrow status" };
  }
};

export const getAdminStats = async () => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [totalBooks] = await db.select({ count: sql<number>`count(*)` }).from(books);
    const [totalBorrows] = await db.select({ count: sql<number>`count(*)` }).from(borrowRecords);

    const [newUsersThisWeek] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`create_at >= ${oneWeekAgo}`);

    const [newBooksThisWeek] = await db
      .select({ count: sql<number>`count(*)` })
      .from(books)
      .where(sql`created_at >= ${oneWeekAgo}`);

    const [newBorrowsThisWeek] = await db
      .select({ count: sql<number>`count(*)` })
      .from(borrowRecords)
      .where(sql`created_at >= ${oneWeekAgo}`);

    const recentBorrows = await db
      .select({ borrow: borrowRecords, book: books, user: users })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .orderBy(desc(borrowRecords.createdAt))
      .limit(5);

    const recentUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createAt))
      .limit(5);

    return {
      success: true,
      data: {
        totalUsers: Number(totalUsers.count),
        totalBooks: Number(totalBooks.count),
        totalBorrows: Number(totalBorrows.count),
        newUsersThisWeek: Number(newUsersThisWeek.count),
        newBooksThisWeek: Number(newBooksThisWeek.count),
        newBorrowsThisWeek: Number(newBorrowsThisWeek.count),
        recentBorrows: JSON.parse(JSON.stringify(recentBorrows)),
        recentUsers: JSON.parse(JSON.stringify(recentUsers)),
      },
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return { success: false, error: "Error fetching stats" };
  }
};
