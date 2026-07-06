import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { 
  sendWelcomeEmail,
  sendInactivityEmail,
  sendCheckInReminderEmail,
  sendMilestoneCongratsEmail
} from "@/lib/resend";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

type UserData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const ONE_MONTH_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= ONE_MONTH_IN_MS
  ) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<UserData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendWelcomeEmail(email, fullName);
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  let loopCount = 0;

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        if (loopCount === 0) {
          await sendInactivityEmail(email, fullName);
        } else {
          await sendCheckInReminderEmail(email, fullName);
        }
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendMilestoneCongratsEmail(email, fullName);
      });
    }

    loopCount++;
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
