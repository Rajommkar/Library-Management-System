"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import { useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  onFileChange: (filePath: string) => void;
  type?: "image" | "video";
  accept?: string;
  placeholder?: string;
  folder?: string;
  variant?: "dark" | "light";
  value?: string;
}

const ImageUpload = ({
  onFileChange,
  type = "image",
  accept = "image/*",
  placeholder = "Upload a file",
  folder = "library",
  variant = "dark",
  value,
}: Props) => {
  const { toast } = useToast();
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({ filePath: value || null });
  const [progress, setProgress] = useState(0);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onError = (err: any) => {
    console.log("Error", err);
    toast({
      title: `${type === "image" ? "Image" : "Video"} upload failed`,
      description: err.message || "An error occurred during upload. Please try again.",
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    setFile({ filePath: res.filePath });
    onFileChange(res.filePath);
    setProgress(0);
    toast({
      title: `${type === "image" ? "Image" : "Video"} uploaded successfully`,
      description: `${res.name} has been uploaded.`,
      variant: "success",
    });
  };

  const onUploadProgress = (progress: any) => {
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        accept={accept}
        folder={folder}
        useUniqueFileName={true}
      />

      <button
        type="button"
        className={cn(
          "upload-btn",
          variant === "dark" ? "bg-dark-300" : "bg-light-600 border-gray-100 border"
        )}
        onClick={(e) => {
          e.preventDefault();
          ikUploadRef.current?.click();
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn("text-base", variant === "dark" ? "text-light-100" : "text-slate-500")}>
          {placeholder}
        </p>

        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 ml-3 dark:bg-gray-700 max-w-32">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </button>

      {file.filePath && (
        <div className="mt-2">
          {type === "image" ? (
            <IKImage
              path={file.filePath}
              alt="uploaded-image"
              width={500}
              height={500}
              className="w-full object-cover rounded-md max-h-64"
            />
          ) : (
            <IKVideo
              path={file.filePath}
              controls={true}
              className="h-96 w-full rounded-xl"
            />
          )}
        </div>
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
