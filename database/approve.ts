import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users } from "./schema";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const approveUser = async () => {
  console.log("Approving user account to allow borrowing...");

  try {
    await db.update(users).set({
      status: "APPROVED",
      role: "ADMIN"
    });

    console.log("User approved and granted ADMIN role successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating user:", error);
    process.exit(1);
  }
};

approveUser();
