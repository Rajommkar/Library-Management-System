import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string;
}

const BookCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverImage = "https://placehold.co/400x600.png",
}: Props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-r-sm"
        style={{ backgroundColor: coverColor, opacity: 0.3 }}
      />
      <div
        className="book-cover_3d absolute inset-0 flex items-center justify-center rounded-r-sm overflow-hidden"
        style={{
          backgroundColor: coverColor,
          boxShadow: `4px 0 8px rgba(0,0,0,0.4), inset -4px 0 6px rgba(0,0,0,0.2)`,
        }}
      >
        <Image
          src={coverImage}
          alt="book cover"
          fill
          className="object-cover rounded-r-sm"
          sizes="(max-width: 480px) 114px, 296px"
        />
      </div>
      {/* Spine effect */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 rounded-l-sm"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,0.4), transparent)`,
        }}
      />
    </div>
  );
};

export default BookCover;
