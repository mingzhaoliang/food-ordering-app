"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ParallelLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  basePath: string;
  searchParams: Record<string, any>;
  targetQueryParams: Record<string, string>;
}

export default function ParallelLink({
  children,
  basePath,
  searchParams,
  targetQueryParams,
  scroll = false,
  ...props
}: ParallelLinkProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");

    const newSearchParams = { ...searchParams, ...targetQueryParams };
    const parallelUrl = `${basePath}?${new URLSearchParams(newSearchParams).toString()}`;
    const nonParallelUrl = `${basePath}/${Object.values(targetQueryParams).join("/")}`;

    const sizeChangeHandler = (e: MediaQueryListEvent | MediaQueryList) => {
      setUrl(e.matches ? parallelUrl : nonParallelUrl);
    };

    sizeChangeHandler(mql);
    mql.addEventListener("change", sizeChangeHandler);

    return () => {
      mql.removeEventListener("change", sizeChangeHandler);
    };
  }, [basePath, searchParams, targetQueryParams]);

  return (
    <Link href={url} scroll={scroll} {...props}>
      {children}
    </Link>
  );
}
