"use server";

import { db } from "@/database/drizzle";
import { users, borrowRecords, books } from "@/database/schema";
import { eq, desc, ilike, and, sql, ne } from "drizzle-orm";

export const getAllUsers = async (params: { query?: string; page?: number; sort?: string }) => {
  const { query = "", page = 1, sort = "desc" } = params;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const conditions = query ? [ilike(users.fullname, `%${query}%`)] : [];

    const allUsers = await db
      .select()
      .from(users)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(sort === "asc" ? users.fullname : desc(users.createAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(conditions.length ? and(...conditions) : undefined);

    const usersWithCounts = await Promise.all(
      allUsers.map(async (user) => {
        const [borrowCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(borrowRecords)
          .where(eq(borrowRecords.userId, user.id));
        
        return {
          ...user,
          booksBorrowed: Number(borrowCount.count),
        };
      })
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(usersWithCounts)),
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
    const updatedUser = await db.update(users).set({ status }).where(eq(users.id, userId)).returning();
    
    if (status === "APPROVED" && updatedUser.length > 0) {
      const { sendAccountApprovedEmail } = await import("../resend");
      try {
        await sendAccountApprovedEmail(updatedUser[0].email, updatedUser[0].fullname);
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
      }
    }
    
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
  status: "PENDING" | "BORROWED" | "RETURNED" | "REJECTED"
) => {
  try {
    const record = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.id, borrowId))
      .limit(1);

    if (!record.length) return { success: false, error: "Record not found" };

    if (status === "BORROWED" && record[0].status === "PENDING") {
      const book = await db
        .select()
        .from(books)
        .where(eq(books.id, record[0].bookId))
        .limit(1);

      if (!book.length || book[0].availableCopies <= 0) {
        return { success: false, error: "Book is not available" };
      }

      await db
        .update(books)
        .set({ availableCopies: sql`available_copies - 1` })
        .where(eq(books.id, record[0].bookId));
        
      const { workflowClient } = await import("../workflow");
      try {
        await workflowClient.trigger({
          url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/workflows/borrow`,
          body: {
            borrowId: record[0].id,
          },
        });
      } catch (workflowError) {
        console.error("Workflow trigger error (continuing anyway):", workflowError);
      }
    }

    await db
      .update(borrowRecords)
      .set({
        status,
        returnDate: status === "RETURNED" ? new Date().toDateString() : record[0].returnDate,
      })
      .where(eq(borrowRecords.id, borrowId));

    if (status === "RETURNED" && record[0].status === "BORROWED") {
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

    const recentBooks = await db
      .select()
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(5);

    const accountRequests = await db
      .select()
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(desc(users.createAt))
      .limit(4);

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
        recentBooks: JSON.parse(JSON.stringify(recentBooks)),
        accountRequests: JSON.parse(JSON.stringify(accountRequests)),
      },
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return { success: false, error: "Error fetching stats" };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // Check if user has active borrow records
    const activeBorrows = await db
      .select()
      .from(borrowRecords)
      .where(and(eq(borrowRecords.userId, userId), eq(borrowRecords.status, "BORROWED")))
      .limit(1);

    if (activeBorrows.length > 0) {
      return { success: false, error: "Cannot delete user with active borrowed books" };
    }

    // Delete user's borrow records first to avoid foreign key constraints
    await db.delete(borrowRecords).where(eq(borrowRecords.userId, userId));

    // Delete the user
    await db.delete(users).where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Error deleting user" };
  }
};

export const createUser = async (params: {
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  role: "USER" | "ADMIN";
}) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, params.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" };
    }

    // Because it is created by Admin, we can assume it's approved and generate a random password
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const newUser = await db.insert(users).values({
      fullname: params.fullName,
      email: params.email,
      universityId: params.universityId,
      universityCard: params.universityCard || "https://ik.imagekit.io/jsmastery/default-card.png",
      password: hashedPassword,
      status: "APPROVED",
      role: params.role,
    }).returning();

    return { success: true, data: JSON.parse(JSON.stringify(newUser[0])) };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, error: "Error creating user" };
  }
};
