import React from "react";
import Image from "next/image";

interface Props {
  title: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  universityId: number;
}

const BookReceipt = ({
  title,
  author,
  borrowDate,
  dueDate,
  universityId,
}: Props) => {
  return (
    <div id="book-ticket">
      <div className="flex flex-col gap-6 px-8">
        <div className="flex items-center gap-4">
          <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
          <h2 className="font-bebas-neue text-3xl text-white">BookWise</h2>
        </div>
        
        <div className="flex flex-col gap-1 text-white">
          <h3 className="text-xl font-bold line-clamp-1">{title}</h3>
          <p className="text-sm text-light-500">By {author}</p>
        </div>

        <div id="book-details" className="grid grid-cols-2 gap-4">
          <div>
            <p>Borrow Date</p>
            <p>{borrowDate}</p>
          </div>
          <div>
            <p>Due Date</p>
            <p>{dueDate}</p>
          </div>
          <div>
            <p>University ID</p>
            <p>{universityId}</p>
          </div>
          <div>
            <p>Status</p>
            <p className="text-primary-admin">Borrowed</p>
          </div>
        </div>
      </div>

      <div id="book-divider" className="relative mt-8 mb-4 h-1 w-full border-t border-dashed border-light-500/20">
        <div />
        <div />
      </div>

      <div className="px-8 mt-4 flex items-center justify-between">
        <p className="text-xs text-light-500">Please return the book on time to avoid penalties.</p>
        <div className="flex gap-1 h-6 items-center opacity-30">
          {[1,2,1,3,1,1,2,1,4,1,1].map((w, i) => (
            <div key={i} className="bg-white h-full" style={{ width: `${w * 2}px` }} />
          ))}
        </div>
      </div>

      <div className="book-ticket-circles">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="size-2 rounded-full bg-dark-100" />
        ))}
      </div>
    </div>
  );
};

export default BookReceipt;
