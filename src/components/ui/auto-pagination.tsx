import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./shadcn/pagination";

interface AutoPaginationProps {
  searchParams: object;
  currentPage: number;
  maxPage: number;
  hideNavigationText?: boolean;
}

export default function AutoPagination({
  searchParams,
  currentPage,
  maxPage,
  hideNavigationText,
}: AutoPaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            hideText={hideNavigationText}
            href={{
              pathname: "",
              query: {
                ...searchParams,
                page: Math.max(currentPage - 1, 1),
              },
            }}
          />
        </PaginationItem>

        {maxPage <= 6 ? (
          generatePageArray(1, maxPage, maxPage).map((page) => renderPageLink(page, currentPage, searchParams))
        ) : (
          <>
            {currentPage > 2 && renderPageLink(1, currentPage, searchParams)}

            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {generatePageArray(Math.max(1, currentPage - 1), Math.min(maxPage, currentPage + 1), maxPage).map((page) =>
              renderPageLink(page, currentPage, searchParams)
            )}

            {currentPage + 2 < maxPage && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {currentPage + 1 < maxPage && renderPageLink(maxPage, currentPage, searchParams)}
          </>
        )}

        <PaginationItem>
          <PaginationNext
            hideText={hideNavigationText}
            href={{
              pathname: "",
              query: {
                ...searchParams,
                page: Math.min(currentPage + 1, maxPage),
              },
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const renderPageLink = (page: number, currentPage: number, searchParams: object) => (
  <PaginationItem key={page}>
    <PaginationLink href={{ pathname: "", query: { ...searchParams, page } }} isActive={currentPage === page}>
      {page}
    </PaginationLink>
  </PaginationItem>
);

const generatePageArray = (start: number, end: number, maxPage: number) => {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index).filter(
    (page) => !!page && page <= maxPage
  );
};
