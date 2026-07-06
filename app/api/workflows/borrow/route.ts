import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import {
  sendBorrowConfirmationEmail,
  sendDueDateReminderEmail,
  sendPenaltyEmail,
} from "@/lib/resend";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

type BorrowData = {
  borrowId: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const { POST } = serve<BorrowData>(async (context) => {
  const { borrowId } = context.requestPayload;

  // Fetch record, user, and book
  const { record, user, book } = await context.run("get-borrow-data", async () => {
    const records = await db
      .select({
        borrow: borrowRecords,
        book: books,
        user: users,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.id, borrowId))
      .limit(1);

    if (records.length === 0) {
      throw new Error("Borrow record not found");
    }
    return { record: records[0].borrow, user: records[0].user, book: records[0].book };
  });

  // Step 1: Send confirmation email
  await context.run("send-borrow-confirmation", async () => {
    await sendBorrowConfirmationEmail(
      user.email,
      user.fullname,
      book.title,
      dayjs(record.dueDate).format("DD MMM YYYY")
    );
  });

  const dueDate = new Date(record.dueDate);
  const now = new Date();
  
  const timeToTwoDaysBefore = dueDate.getTime() - (2 * ONE_DAY_IN_MS) - now.getTime();
  
  if (timeToTwoDaysBefore > 0) {
    await context.sleep("wait-2-days-before-due", timeToTwoDaysBefore);
  }

  // Step 2: Reminder 2 days before due date
  const isReturned2DaysBefore = await context.run("check-return-status-2-days", async () => {
    const res = await db.select().from(borrowRecords).where(eq(borrowRecords.id, borrowId));
    return res[0]?.status === "RETURNED";
  });

  if (isReturned2DaysBefore) return;

  await context.run("send-reminder-2-days", async () => {
    await sendDueDateReminderEmail(
      user.email,
      user.fullname,
      book.title,
      dayjs(record.dueDate).format("DD MMM YYYY"),
      2
    );
  });

  const timeToDueDate = dueDate.getTime() - new Date().getTime();
  if (timeToDueDate > 0) {
    await context.sleep("wait-for-due-date", timeToDueDate);
  }

  // Step 3: Due today reminder
  const isReturnedDueToday = await context.run("check-return-status-due-date", async () => {
    const res = await db.select().from(borrowRecords).where(eq(borrowRecords.id, borrowId));
    return res[0]?.status === "RETURNED";
  });

  if (isReturnedDueToday) return;

  await context.run("send-due-today-reminder", async () => {
    await sendDueDateReminderEmail(
      user.email,
      user.fullname,
      book.title,
      dayjs(record.dueDate).format("DD MMM YYYY"),
      0
    );
  });

  // Step 4: Penalty check after due date (every day for a few days, let's just do 1 day after)
  await context.sleep("wait-1-day-past-due", ONE_DAY_IN_MS);

  const isReturnedPastDue = await context.run("check-return-status-past-due", async () => {
    const res = await db.select().from(borrowRecords).where(eq(borrowRecords.id, borrowId));
    return res[0]?.status === "RETURNED";
  });

  if (isReturnedPastDue) return;

  await context.run("send-penalty-notice", async () => {
    await sendPenaltyEmail(
      user.email,
      user.fullname,
      book.title,
      dayjs(record.dueDate).format("DD MMM YYYY"),
      1
    );
  });
});
