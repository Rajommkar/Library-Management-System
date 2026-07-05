import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { books } from "./schema";
import booksData from "../public/books.json";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const seed = async () => {
  console.log("Seeding database...");

  try {
    for (const book of booksData) {
      await db.insert(books).values({
        title: book.title,
        author: book.author,
        genre: book.genre,
        rating: Math.round(book.rating),
        coverUrl: book.coverUrl,
        coverColor: book.coverColor,
        description: book.description,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        videoUrl: book.videoUrl,
        summary: book.summary,
      }).onConflictDoNothing();
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
