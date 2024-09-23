import Logo from "@/assets/icons/logo.svg";
import LinkIcon from "@/components/ui/link-icon";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import Sidebar from "@/components/ui/sidebar";
import { getCourses } from "@/services/mongoose/store/restaurant.dal";
import Image from "next/image";
import { Suspense } from "react";

export default async function Layout({
  children,
  dish,
  image,
}: {
  children: React.ReactNode;
  dish: React.ReactNode;
  image: React.ReactNode;
}) {
  const courses = await getCourses();

  return (
    <div className="relative min-h-screen pt-28 sm:pt-36 pb-12 px-5 sm:px-8 flex max-sm:flex-col gap-4 sm:gap-6 lg:gap-8 bg-stone-50">
      <Sidebar>
        <LinkIcon href="/menu" isImage>
          <Image
            src={Logo}
            alt="All"
            fill
            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 10vw, 5vw"
            className="p-1 object-cover"
          />
        </LinkIcon>
        {courses.map((course) => (
          <LinkIcon href={`/menu/${course.slug}`} key={course.slug} isImage>
            <Image
              src={course.imageUrl}
              alt={course.name}
              fill
              sizes="(max-width: 640px) 25vw, (max-width: 1024px) 10vw, 5vw"
              className="p-1 object-cover"
            />
          </LinkIcon>
        ))}
      </Sidebar>
      <Suspense
        fallback={
          <div className="flex-1 w-full space-y-4 sm:space-y-6 lg:space-y-8">
            <Skeleton className="w-32 h-8 sm:w-36 sm:h-8 lg:w-48 lg:h-10 xl:w-60 xl:h-12 2xl:w-72 2xl:h-14" />
            <div className="flex max-sm:flex-col max-sm:gap-y-3 sm:flex-wrap sm:gap-3 md:gap-4 lg:gap-3 xl:gap-6 2xl:gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full sm:w-48 lg:w-64 2xl:w-72 h-28 sm:h-80 lg:h-104 2xl:h-[29.5rem] sm:rounded-3xl"
                />
              ))}
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
      {dish}
      {image}
    </div>
  );
}
