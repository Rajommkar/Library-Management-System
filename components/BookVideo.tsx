"use client";

import { IKVideo, ImageKitProvider } from "imagekitio-next";

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  if (!videoUrl) return <div className="w-full h-48 bg-light-300 rounded-xl flex items-center justify-center text-light-500 font-semibold">No video available</div>;

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      <IKVideo
        path={videoUrl}
        controls={true}
        className="w-full rounded-xl"
        preload="auto"
      />
    </ImageKitProvider>
  );
};

export default BookVideo;
