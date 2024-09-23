"use client";

import ClientPortal from "@/components/common/client-portal";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils/cn";
import { Edit2, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const AvatarUploadForm = dynamic(() => import("./avatar-upload-form"));

export default function AvatarUploader() {
  const [open, setOpen] = useState(false);

  const modalCloseHandler = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <button
        className={cn(
          "bg-stone-200 transition-all cursor-pointer p-0.5",
          "absolute top-3/4 left-0 right-0 bottom-0 flex-center",
          "hover:inset-0 hover:rounded-full"
        )}
        onClick={() => setOpen(true)}
      >
        <Edit2 className="w-full h-full max-w-4 max-h-4" />
      </button>
      <ClientPortal selector="#modal">
        <Modal disableEscape className="w-full max-w-64 sm:max-w-80 lg:max-w-96" controlOpen open={open}>
          <div className="p-6 flex-col-center">
            <Button
              variant="plain"
              size="icon"
              className="absolute top-5 right-5 bg-white/80 shadow-none"
              onClick={modalCloseHandler}
            >
              <X className="size-icon-1" />
            </Button>
            <AvatarUploadForm key={String(open)} onSuccess={modalCloseHandler} />
          </div>
        </Modal>
      </ClientPortal>
    </>
  );
}
