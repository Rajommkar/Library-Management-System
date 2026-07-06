import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_TOKEN);

const getEmailLayout = (message: string, footerMessage: string = "Happy reading,") => `
<div style="font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #16191E; color: #D6E0FF; padding: 40px; border-radius: 8px; box-sizing: border-box;">
  <div style="margin-bottom: 24px;">
    <img src="${process.env.NEXT_PUBLIC_APP_URL}/icons/logo.svg" alt="BookWise Logo" width="36" height="36" style="vertical-align: middle; margin-right: 12px; display: inline-block;" />
    <h1 style="color: #FFFFFF; font-size: 24px; margin: 0; display: inline-block; vertical-align: middle; font-weight: 700;">BookWise</h1>
  </div>
  
  <hr style="border: 0; border-top: 1px solid #232839; margin-bottom: 32px;" />
  
  ${message}
  
  <div style="margin-top: 48px;">
    <p style="color: #D6E0FF; font-size: 14px; margin: 0;">${footerMessage}</p>
    <p style="color: #D6E0FF; font-size: 14px; margin: 4px 0 0;">The BookWise Team</p>
  </div>
</div>
`;

const getButton = (text: string, url: string) => `
<div style="margin-top: 32px;">
  <a href="${url}" style="background-color: #E7C9A5; color: #16191E; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px;">
    ${text}
  </a>
</div>
`;

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
    html: message,
  });

  if (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }

  return { success: true, data };
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">Welcome to BookWise, Your Reading<br/>Companion!</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      Welcome to BookWise! We're excited to have you join our community of book enthusiasts. Explore a wide range of books, borrow with ease, and manage your reading journey seamlessly.
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      Get started by logging in to your account:
    </p>
    ${getButton("Login to BookWise", `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`)}
  `;

  return sendEmail({
    email,
    subject: "Welcome to BookWise Email",
    message: getEmailLayout(message, "Happy reading,"),
  });
};

export const sendAccountApprovedEmail = async (email: string, name: string) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">Your BookWise Account Has Been Approved!</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      Congratulations! Your BookWise account has been approved. You can now browse our library, borrow books, and enjoy all the features of your new account.
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      Log in to get started:
    </p>
    ${getButton("Log in to BookWise", `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`)}
  `;

  return sendEmail({
    email,
    subject: "Account Approval Email",
    message: getEmailLayout(message, "Welcome aboard,"),
  });
};

export const sendBorrowConfirmationEmail = async (
  email: string,
  name: string,
  bookTitle: string,
  borrowDate: string,
  dueDate: string
) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">You've Borrowed a Book!</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      You've successfully borrowed ${bookTitle}. Here are the details:
    </p>
    <ul style="color: #D6E0FF; line-height: 1.6; font-size: 14px; padding-left: 20px; margin-top: 12px; margin-bottom: 24px;">
      <li style="margin-bottom: 8px;">Borrowed On: <strong style="color: #E7C9A5;">${borrowDate}</strong></li>
      <li>Due Date: <strong style="color: #E7C9A5;">${dueDate}</strong></li>
    </ul>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      Enjoy your reading, and don't forget to return the book on time!
    </p>
    ${getButton("View Borrowed Books", `${process.env.NEXT_PUBLIC_APP_URL}/my-profile`)}
  `;

  return sendEmail({
    email,
    subject: "Book Borrowed Confirmation Email",
    message: getEmailLayout(message, "Happy reading,"),
  });
};

export const sendDueDateReminderEmail = async (
  email: string,
  name: string,
  bookTitle: string,
  dueDate: string,
  daysLeft: number
) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">Reminder: ${bookTitle} is Due Soon!</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      Just a reminder that <strong style="color: #E7C9A5;">${bookTitle}</strong> is due for return on <strong style="color: #E7C9A5;">${dueDate}</strong>. Kindly return it on time to avoid late fees.
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      If you're still reading, you can renew the book in your account.
    </p>
    ${getButton("Renew Book Now", `${process.env.NEXT_PUBLIC_APP_URL}/my-profile`)}
  `;

  return sendEmail({
    email,
    subject: "Book Due Reminder Email",
    message: getEmailLayout(message, "Keep reading,"),
  });
};

export const sendBookReceiptEmail = async (
  email: string,
  name: string,
  bookTitle: string,
  borrowDate: string,
  dueDate: string
) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">Your Receipt for ${bookTitle} is Ready!</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      Your receipt for borrowing ${bookTitle} has been generated. Here are the details:
    </p>
    <ul style="color: #D6E0FF; line-height: 1.6; font-size: 14px; padding-left: 20px; margin-top: 12px; margin-bottom: 24px;">
      <li style="margin-bottom: 8px;">Borrowed On: <strong style="color: #E7C9A5;">${borrowDate}</strong></li>
      <li>Due Date: <strong style="color: #E7C9A5;">${dueDate}</strong></li>
    </ul>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      You can download the receipt here:
    </p>
    ${getButton("Download Receipt", `${process.env.NEXT_PUBLIC_APP_URL}/my-profile`)}
  `;

  return sendEmail({
    email,
    subject: "Book Receipt Generated Email",
    message: getEmailLayout(message, "Keep the pages turning,"),
  });
};

export const sendPenaltyEmail = async (
  email: string,
  name: string,
  bookTitle: string,
  dueDate: string,
  daysLate: number
) => {
  const message = `
    <h2 style="color: #EF3A4B; margin-top: 0; font-size: 20px; font-weight: 700;">Overdue Penalty Notice ⚠️</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      Our records indicate that <strong style="color: #E7C9A5;">${bookTitle}</strong> is currently 
      <strong style="color: #EF3A4B;">${daysLate} day(s) overdue</strong>.
    </p>
    <div style="margin-top: 24px; padding: 16px; background: #333C5C; border-radius: 8px;">
      <p style="color: #8D8D8D; margin: 0; font-size: 12px;">DUE DATE WAS</p>
      <p style="color: #EF3A4B; margin: 4px 0 0; font-size: 20px; font-weight: bold;">${dueDate}</p>
    </div>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 16px;">
      Please return the book immediately. Additional late fees and account restrictions may apply if the book is not returned promptly.
    </p>
    ${getButton("View Borrowed Books", `${process.env.NEXT_PUBLIC_APP_URL}/my-profile`)}
  `;

  return sendEmail({
    email,
    subject: `Overdue Penalty Notice: "${bookTitle}"`,
    message: getEmailLayout(message, "The BookWise Team"),
  });
};
