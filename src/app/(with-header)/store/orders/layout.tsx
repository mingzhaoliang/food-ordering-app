interface LayoutProps {
  items: React.ReactNode;
  edit: React.ReactNode;
}

export default function Layout({ children, items, edit }: React.PropsWithChildren<LayoutProps>) {
  return (
    <div className="h-full flex flex-col pb-4">
      {children}
      <div className="flex-1 grid lg:grid-cols-6 gap-x-4">
        <div className="col-span-3 2xl:col-span-2">{items}</div>
        <div className="max-lg:hidden col-span-3 2xl:col-span-4">
          <div className="sticky self-start top-20 overflow-hidden sm:top-28 2xl:top-32 h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-9rem)]">
            {edit}
          </div>
        </div>
      </div>
    </div>
  );
}
