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
              <FormLabel className="text-dark-100 font-semibold">Title</FormLabel>
              <FormControl>
                <Input required className="border-light-500 text-dark-100 bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dark-100 font-semibold">Author</FormLabel>
                <FormControl>
                  <Input required className="border-light-500 text-dark-100 bg-white" {...field} />
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
                  <Input required className="border-light-500 text-dark-100 bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dark-100 font-semibold">Rating (1-5)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={5} required className="border-light-500 text-dark-100 bg-white" {...field} />
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
                <FormLabel className="text-dark-100 font-semibold">Total Copies</FormLabel>
                <FormControl>
                  <Input type="number" min={1} required className="border-light-500 text-dark-100 bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Description</FormLabel>
              <FormControl>
                <Textarea required className="border-light-500 text-dark-100 bg-white resize-none" rows={3} {...field} />
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
              <FormLabel className="text-dark-100 font-semibold">Summary</FormLabel>
              <FormControl>
                <Textarea required className="border-light-500 text-dark-100 bg-white resize-none" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dark-100 font-semibold">Book Cover</FormLabel>
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
                <FormLabel className="text-dark-100 font-semibold">Primary Color</FormLabel>
                <FormControl>
                  <div className="flex gap-4 items-center">
                    <div 
                      className="size-14 rounded-md border border-light-400 cursor-pointer shadow-sm"
                      style={{ backgroundColor: field.value }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                    <Input className="w-full border-light-500 text-dark-100 bg-white uppercase" {...field} />
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
        </div>

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-100 font-semibold">Book Trailer Video</FormLabel>
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

        <Button type="submit" className="bg-primary-admin hover:bg-primary-admin/90 mt-5 w-full md:w-auto self-start" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : type === "create" ? "Add Book" : "Update Book"}
        </Button>
      </form>
    </Form>
  );
};

export default BookForm;
