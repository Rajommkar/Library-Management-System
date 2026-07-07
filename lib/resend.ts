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

export const sendAccountRejectedEmail = async (email: string, name: string) => {
  const message = `
    <h2 style="color: #EF3A4B; margin-top: 0; font-size: 20px; font-weight: 700;">Account Request Update</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      We regret to inform you that your BookWise account request could not be approved at this time. This is usually due to an unverified or invalid University ID card.
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      If you believe this is a mistake, please reach out to the administration office with a clear copy of your valid University ID.
    </p>
  `;

  return sendEmail({
    email,
    subject: "Account Request Update",
    message: getEmailLayout(message, "Best regards,"),
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
  bookTitle: string,
  bookAuthor: string,
  bookGenre: string,
  borrowDate: string,
  dueDate: string,
  duration: number,
  receiptId: string
) => {
  const dateIssued = new Date().toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });
  const message = `
    <div style="font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #16191E; color: #D6E0FF; padding: 40px; border-radius: 8px; box-sizing: border-box;">
      <div style="margin-bottom: 24px;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/icons/logo.svg" alt="BookWise Logo" width="36" height="36" style="vertical-align: middle; margin-right: 12px; display: inline-block;" />
        <h1 style="color: #FFFFFF; font-size: 24px; margin: 0; display: inline-block; vertical-align: middle; font-weight: 700;">BookWise</h1>
      </div>
      
      <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700; margin-bottom: 8px;">Borrow Receipt</h2>
      <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin: 0;">Receipt ID: <strong style="color: #E7C9A5;">#${receiptId.substring(0, 8)}</strong></p>
      <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin: 4px 0 0;">Date Issued: <strong style="color: #E7C9A5;">${dateIssued}</strong></p>
      
      <hr style="border: 0; border-top: 1px solid #232839; margin: 24px 0;" />
      
      <h3 style="color: #FFFFFF; margin-top: 0; font-size: 16px; font-weight: 700;">Book Details:</h3>
      <ul style="color: #D6E0FF; line-height: 1.6; font-size: 14px; padding-left: 20px; margin-top: 12px; margin-bottom: 0;">
        <li style="margin-bottom: 8px;">Title: <strong style="color: #FFFFFF;">${bookTitle}</strong></li>
        <li style="margin-bottom: 8px;">Author: <strong style="color: #FFFFFF;">${bookAuthor}</strong></li>
        <li style="margin-bottom: 8px;">Genre: <strong style="color: #FFFFFF;">${bookGenre}</strong></li>
        <li style="margin-bottom: 8px;">Borrowed On: <strong style="color: #FFFFFF;">${borrowDate}</strong></li>
        <li style="margin-bottom: 8px;">Due Date: <strong style="color: #FFFFFF;">${dueDate}</strong></li>
        <li>Duration: <strong style="color: #FFFFFF;">${duration} Days</strong></li>
      </ul>

      <hr style="border: 0; border-top: 1px solid #232839; margin: 24px 0;" />
      
      <h3 style="color: #FFFFFF; margin-top: 0; font-size: 16px; font-weight: 700;">Terms</h3>
      <ul style="color: #D6E0FF; line-height: 1.6; font-size: 14px; padding-left: 20px; margin-top: 12px; margin-bottom: 24px;">
        <li style="margin-bottom: 4px;">Please return the book by the due date.</li>
        <li>Lost or damaged books may incur replacement costs.</li>
      </ul>
      
      <div style="margin-top: 48px;">
        <p style="color: #D6E0FF; font-size: 14px; margin: 0;">Thank you for using <strong style="color: #FFFFFF;">BookWise</strong>!</p>
        <p style="color: #D6E0FF; font-size: 14px; margin: 4px 0 0;">Website: <strong style="color: #FFFFFF;">${process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 'bookwise.app'}</strong></p>
        <p style="color: #D6E0FF; font-size: 14px; margin: 4px 0 0;">Email: <strong style="color: #FFFFFF;">support@bookwise.app</strong></p>
      </div>
    </div>
  `;

  return sendEmail({
    email,
    subject: `Your Receipt for "${bookTitle}"`,
    message,
  });
};

export const sendReturnConfirmationEmail = async (
  email: string,
  name: string,
  bookTitle: string
) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">Thank You for Returning ${bookTitle}!</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      We've successfully received your return of <strong style="color: #E7C9A5;">${bookTitle}</strong>. Thank you for returning it on time.
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      Looking for your next read? Browse our collection and borrow your next favorite book!
    </p>
    ${getButton("Explore New Books", `${process.env.NEXT_PUBLIC_APP_URL}/library`)}
  `;

  return sendEmail({
    email,
    subject: "Book Return Confirmation Email",
    message: getEmailLayout(message, "Happy exploring,"),
  });
};

export const sendInactivityEmail = async (email: string, name: string) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">We Miss You at BookWise!</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      It's been a while since we last saw you—over three days, to be exact! New books are waiting for you, and your next great read might just be a click away.
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      Come back and explore now:
    </p>
    ${getButton("Explore Books on BookWise", `${process.env.NEXT_PUBLIC_APP_URL}/library`)}
  `;

  return sendEmail({
    email,
    subject: "Inactivity Reminder",
    message: getEmailLayout(message, "See you soon,"),
  });
};

export const sendCheckInReminderEmail = async (email: string, name: string) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">Don't Forget to Check In at BookWise</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      We noticed you haven't checked in recently. Stay active and keep track of your borrowed books, due dates, and new arrivals.
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      Log in now to stay on top of your reading:
    </p>
    ${getButton("Log in to BookWise", `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`)}
  `;

  return sendEmail({
    email,
    subject: "Check-In Reminder Email",
    message: getEmailLayout(message, "Keep the pages turning,"),
  });
};

export const sendMilestoneCongratsEmail = async (email: string, name: string) => {
  const message = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 20px; font-weight: 700;">Congratulations on Reaching a New Milestone!</h2>
    <p style="color: #D6E0FF; line-height: 1.6; margin-top: 24px; font-size: 14px;">Hi ${name},</p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px;">
      Great news! You've reached a new milestone in your reading journey with BookWise. 🎉 Whether it's finishing a challenging book, staying consistent with your reading goals, or exploring new genres, your dedication inspires us.
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      Keep the momentum going—there are more exciting books and features waiting for you!
    </p>
    <p style="color: #D6E0FF; line-height: 1.6; font-size: 14px; margin-top: 24px;">
      Log in now to discover your next adventure:
    </p>
    ${getButton("Discover New Reads", `${process.env.NEXT_PUBLIC_APP_URL}/library`)}
  `;

  return sendEmail({
    email,
    subject: "Congratulations on Reaching a New Milestone!",
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
