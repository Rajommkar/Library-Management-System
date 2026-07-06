"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bookSchema } from "@/lib/validations";
import { createBook, updateBook } from "@/lib/actions/book";
import { useToast } from "@/hooks/use-toast";
import { HexColorPicker } from "react-colorful";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { Book } from "@/types";

interface Props {
  type: "create" | "update";
  book?: Book;
}

const BookForm = ({ type, book }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema) as any,
    defaultValues: {
      title: book?.title || "",
      description: book?.description || "",
      author: book?.author || "",
      genre: book?.genre || "",
      rating: book?.rating || 1,
      totalCopies: book?.totalCopies || 1,
      coverUrl: book?.coverUrl || "",
      coverColor: book?.coverColor || "#E7C9A5",
      videoUrl: book?.videoUrl || "",
      summary: book?.summary || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof bookSchema>) => {
    setIsSubmitting(true);
    
    try {
      const result =
        type === "create"
          ? await createBook(data)
          : await updateBook(book!.id, data);

      if (result.success) {
        toast({
          title: "Success",
          description: `Book ${type === "create" ? "created" : "updated"} successfully.`,
          variant: "success",
        });
        router.push("/admin/books");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Book Title</FormLabel>
              <FormControl>
                <Input required className="border-light-500 text-dark-100 bg-white" placeholder="Enter the book title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Author</FormLabel>
              <FormControl>
                <Input required className="border-light-500 text-dark-100 bg-white" placeholder="Enter the author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Genre</FormLabel>
              <FormControl>
                <Input required className="border-light-500 text-dark-100 bg-white" placeholder="Enter the genre of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalCopies"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Total number of books</FormLabel>
              <FormControl>
                <Input type="number" min={1} required className="border-light-500 text-dark-100 bg-white" placeholder="Enter the total number of books" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Book Image</FormLabel>
              <FormControl>
                <ImageUpload
                  onFileChange={field.onChange}
                  type="image"
                  variant="light"
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverColor"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="text-dark-100 font-semibold">Book Primary Color</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-md border border-light-500 bg-white px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
                  <div 
                    className="size-6 rounded-sm cursor-pointer shadow-sm border border-light-400 mr-3"
                    style={{ backgroundColor: field.value }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent text-sm font-medium outline-none uppercase text-dark-100" 
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              </FormControl>
              
              {showColorPicker && (
                <div className="absolute top-20 z-10 bg-white p-3 rounded-lg shadow-lg border border-light-400">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm">Pick color</span>
                    <button type="button" onClick={() => setShowColorPicker(false)} className="text-light-500 text-sm">Close</button>
                  </div>
                  <HexColorPicker color={field.value} onChange={field.onChange} />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Book Video</FormLabel>
              <FormControl>
                <ImageUpload
                  onFileChange={field.onChange}
                  type="video"
                  accept="video/*"
                  variant="light"
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Book Summary</FormLabel>
              <FormControl>
                <Textarea required className="border-light-500 text-dark-100 bg-white resize-none" rows={5} placeholder="Write a brief summary of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional backend-required fields not originally in mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-light-400 mt-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dark-100 font-semibold">Rating (1-5) *</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={5} required className="border-light-500 text-dark-100 bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dark-100 font-semibold">Detailed Description *</FormLabel>
                <FormControl>
                  <Textarea required className="border-light-500 text-dark-100 bg-white resize-none" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="bg-primary-admin hover:bg-primary-admin/90 mt-5 w-full font-semibold text-white py-6 rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : type === "create" ? "Add Book to Library" : "Update Book"}
        </Button>
      </form>
    </Form>
  );
};

export default BookForm;
