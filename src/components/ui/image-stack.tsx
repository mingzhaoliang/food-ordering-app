import { cn } from "@/lib/utils/cn";
import shimmerPlaceholder from "@/lib/utils/shimmerPlaceholder";
import Image from "next/image";

interface ImageStackProps {
  imageUrls: string[];
  names: string[];
}

export default function ImageStack({ imageUrls, names }: ImageStackProps) {
  return (
    <div className="relative w-full h-full">
      <div
        className={cn("relative h-full", imageUrls.length === 1 ? "w-full" : "w-11/12 sm:w-[87%]")}
        style={{ zIndex: `${imageUrls.length}` }}
      >
        <Image
          src={imageUrls[0]}
          alt={names[0]}
          fill
          sizes="25vw"
          className="rounded-2xl border border-white/80 object-cover"
          placeholder={shimmerPlaceholder(250, 250)}
        />
      </div>
      {imageUrls.slice(1).map((url, index) => (
        <div
          key={url}
          className="absolute top-0 w-11/12 sm:w-[87%] h-full"
          style={{
            left: `${(36 / imageUrls.length) * (index + 1)}px`,
            zIndex: `${imageUrls.length - (index + 1)}`,
          }}
        >
          <Image
            src={url}
            alt={names[index]}
            fill
            sizes="25vw"
            className="rounded-2xl border border-white/80 object-cover"
            style={{
              opacity: `${(1 / imageUrls.length) * (imageUrls.length - (index + 1))}`,
            }}
            placeholder={shimmerPlaceholder(250, 250)}
          />
        </div>
      ))}
    </div>
  );
}
