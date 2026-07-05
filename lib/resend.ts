import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_TOKEN);

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: "BookWise <onboarding@resend.dev>",
    to: [email],
    subject,
    html: `
      <div style="font-family: IBM Plex Sans, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #16191E; color: #D6E0FF; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #E7C9A5; font-size: 28px; margin: 0;">BookWise</h1>
          <p style="color: #8D8D8D; font-size: 14px; margin: 4px 0 0;">University Library Management System</p>
        </div>
        <div style="background: #232839; padding: 32px; border-radius: 8px;">
          ${message}
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #8D8D8D; font-size: 12px;">© 2024 BookWise. All rights reserved.</p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }

  return { success: true, data };
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  return sendEmail({
    email,
    subject: "Welcome to BookWise! 📚",
    message: `
      <h2 style="color: #E7C9A5; margin-top: 0;">Welcome, ${name}! 🎉</h2>
      <p style="color: #D6E0FF; line-height: 1.6;">
        Your account has been created successfully. Our admin team will review and approve your account shortly.
      </p>
      <p style="color: #D6E0FF; line-height: 1.6;">
        Once approved, you'll be able to browse our extensive library collection and borrow books.
      </p>
      <div style="margin-top: 24px; padding: 16px; background: #333C5C; border-radius: 8px;">
        <p style="color: #E7C9A5; margin: 0; font-weight: bold;">What happens next?</p>
        <p style="color: #D6E0FF; margin: 8px 0 0;">An administrator will review your university card and approve your account. You'll receive an email notification once approved.</p>
      </div>
    `,
  });
};

export const sendAccountApprovedEmail = async (email: string, name: string) => {
  return sendEmail({
    email,
    subject: "Your BookWise Account Has Been Approved! ✅",
    message: `
      <h2 style="color: #E7C9A5; margin-top: 0;">Great news, ${name}! ✅</h2>
      <p style="color: #D6E0FF; line-height: 1.6;">
        Your BookWise account has been approved! You can now log in and start borrowing books from our library.
      </p>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_API_ENDPOINT}" style="background: #E7C9A5; color: #16191E; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
          Browse the Library
        </a>
      </div>
    `,
  });
};

export const sendBorrowConfirmationEmail = async (
  email: string,
  name: string,
  bookTitle: string,
  dueDate: string
) => {
  return sendEmail({
    email,
    subject: `You've borrowed "${bookTitle}" 📖`,
    message: `
      <h2 style="color: #E7C9A5; margin-top: 0;">Book Borrowed Successfully! 📖</h2>
      <p style="color: #D6E0FF; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #D6E0FF; line-height: 1.6;">
        You have successfully borrowed <strong style="color: #E7C9A5;">"${bookTitle}"</strong>.
      </p>
      <div style="margin-top: 24px; padding: 16px; background: #333C5C; border-radius: 8px;">
        <p style="color: #8D8D8D; margin: 0; font-size: 12px;">DUE DATE</p>
        <p style="color: #E7C9A5; margin: 4px 0 0; font-size: 20px; font-weight: bold;">${dueDate}</p>
      </div>
      <p style="color: #D6E0FF; line-height: 1.6; margin-top: 16px;">
        Please return the book by the due date to avoid any penalties.
      </p>
    `,
  });
};

export const sendDueDateReminderEmail = async (
  email: string,
  name: string,
  bookTitle: string,
  dueDate: string,
  daysLeft: number
) => {
  return sendEmail({
    email,
    subject: `Reminder: "${bookTitle}" is due ${daysLeft === 0 ? "today" : `in ${daysLeft} day(s)`}`,
    message: `
      <h2 style="color: #E7C9A5; margin-top: 0;">Return Reminder ⏰</h2>
      <p style="color: #D6E0FF; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #D6E0FF; line-height: 1.6;">
        This is a friendly reminder that <strong style="color: #E7C9A5;">"${bookTitle}"</strong> is due 
        ${daysLeft === 0 ? "<strong style='color: #EF3A4B;'>today</strong>" : `in <strong style="color: #E7C9A5;">${daysLeft} day(s)</strong>`}.
      </p>
      <div style="margin-top: 24px; padding: 16px; background: #333C5C; border-radius: 8px;">
        <p style="color: #8D8D8D; margin: 0; font-size: 12px;">DUE DATE</p>
        <p style="color: #E7C9A5; margin: 4px 0 0; font-size: 20px; font-weight: bold;">${dueDate}</p>
      </div>
      <p style="color: #D6E0FF; line-height: 1.6; margin-top: 16px;">
        Please return the book to avoid late fees and penalties.
      </p>
    `,
  });
};
