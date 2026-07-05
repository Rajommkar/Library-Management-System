export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

export interface AuthCredentials {
  fullname: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

export interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

export interface BorrowBookParams {
  bookId: string;
  userId: string;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  role: "USER" | "ADMIN";
  lastActivityDate: string | null;
  createAt: Date | null;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "BORROWED" | "RETURNED";
  createdAt: Date | null;
}
