"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ClientPortalProps {
  children: React.ReactNode;
  selector: string;
}

export default function ClientPortal({ children, selector }: ClientPortalProps) {
  const ref = useRef<Element | DocumentFragment>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const domNode = document.querySelector(selector);

    if (domNode) {
      ref.current = domNode;
      setMounted(true);
    }
  }, [selector]);

  return mounted ? createPortal(children, ref.current!) : null;
}
