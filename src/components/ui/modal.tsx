"use client";

import { cn } from "@/lib/utils/cn";
import { Slot } from "@radix-ui/react-slot";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface ModalProps extends Omit<React.ComponentPropsWithoutRef<"dialog">, "onClick"> {
  backdropClose?: boolean;
  disableEscape?: boolean;
  controlOpen?: boolean;
  open?: boolean;
}

export default function Modal({
  children,
  className,
  backdropClose,
  disableEscape,
  controlOpen,
  open,
  ...props
}: ModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onBackdropClick = () => {
    backdropClose && router.back();
  };

  useEffect(() => {
    if (controlOpen) {
      open ? dialogRef.current?.showModal() : dialogRef.current?.close();
    } else {
      !dialogRef.current?.open && dialogRef.current?.showModal();
    }

    containerRef.current?.scrollTo(containerRef.current.scrollTop, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      event.key === "Escape" && event.preventDefault();
    };

    disableEscape && document.addEventListener("keydown", handleKeyDown);

    return () => {
      disableEscape && document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, controlOpen, disableEscape]);

  return (
    <dialog
      ref={dialogRef}
      onClick={onBackdropClick}
      className={cn("bg-white rounded-2xl sm:rounded-3xl shadow-md outline-none backdrop:bg-stone-600/20", className)}
      {...props}
    >
      <Slot ref={containerRef} className="w-full h-full" onClick={(event) => event.stopPropagation()}>
        {children}
      </Slot>
    </dialog>
  );
}
