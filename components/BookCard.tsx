import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types";
import BookCover from "./BookCover";
import { cn } from "@/lib/utils";

interface Props extends Book {
  isLoanedBook?: boolean;
}

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
}: Props) => (
  <li className={cn(isLoanedBook && "xs:w-52 w-full")}>
    <Link href={`/books/${id}`}>
      <BookCover coverColor={coverColor} coverImage={coverUrl} />
      <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
        <p className="book-title">{title}</p>
        <p className="book-genre">{genre}</p>
      </div>
    </Link>
  </li>
);

export default BookCard;
