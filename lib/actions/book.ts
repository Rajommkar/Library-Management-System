"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, and, desc, ilike, or, sql } from "drizzle-orm";
import { auth } from "@/auth";
import dayjs from "dayjs";
import { BookParams, BorrowBookParams } from "@/types";

export const borrowBook = async (params: BorrowBookParams) => {
  const { bookId, userId } = params;

  try {
    const book = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return { success: false, error: "Book is not available for borrowing" };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();
    const borrowDate = new Date().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      borrowDate,
      dueDate,
      status: "BORROWED",
    }).returning();

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return { success: true, data: JSON.parse(JSON.stringify(record[0])) };
  } catch (error: any) {
    console.error("Borrow error:", error);
    return { success: false, error: "An error occurred while borrowing" };
  }
};

export const getAllBooks = async (params: {
  query?: string;
  genre?: string;
  sort?: string;
  page?: number;
}) => {
  const { query = "", genre = "", sort = "newest", page = 1 } = params;
  const limit = 12;
  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    if (query) conditions.push(ilike(books.title, `%${query}%`));
    if (genre) conditions.push(ilike(books.genre, `%${genre}%`));

    const allBooks = await db
      .select()
      .from(books)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(sort === "oldest" ? books.createdAt : desc(books.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(books)
      .where(conditions.length ? and(...conditions) : undefined);

    const total = Number(totalCount[0].count);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(allBooks)),
      metadata: {
        totalPages: Math.ceil(total / limit),
        hasNextPage: offset + limit < total,
      },
    };
  } catch (error) {
    console.error("Get all books error:", error);
    return { success: false, error: "Error fetching books" };
  }
};

export const getBookById = async (bookId: string) => {
  try {
    const book = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length) return { success: false, error: "Book not found" };

    return { success: true, data: JSON.parse(JSON.stringify(book[0])) };
  } catch (error) {
    console.error("Get book error:", error);
    return { success: false, error: "Error fetching book" };
  }
};

export const getBorrowedBooks = async (userId: string) => {
  try {
    const borrowed = await db
      .select({
        borrow: borrowRecords,
        book: books,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.userId, userId))
      .orderBy(desc(borrowRecords.createdAt));

    return { success: true, data: JSON.parse(JSON.stringify(borrowed)) };
  } catch (error) {
    console.error("Get borrowed books error:", error);
    return { success: false, error: "Error fetching borrowed books" };
  }
};

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db.insert(books).values({
      ...params,
      availableCopies: params.totalCopies,
    }).returning();

    return { success: true, data: JSON.parse(JSON.stringify(newBook[0])) };
  } catch (error) {
    console.error("Create book error:", error);
    return { success: false, error: "Error creating book" };
  }
};

export const updateBook = async (bookId: string, params: Partial<BookParams>) => {
  try {
    const updated = await db
      .update(books)
      .set(params)
      .where(eq(books.id, bookId))
      .returning();

    return { success: true, data: JSON.parse(JSON.stringify(updated[0])) };
  } catch (error) {
    console.error("Update book error:", error);
    return { success: false, error: "Error updating book" };
  }
};
