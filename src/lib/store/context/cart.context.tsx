"use client";

import { createContext, use, useCallback, useRef, useState } from "react";

interface CartContextType {
  count: number;
  visible: boolean;
  addToCartHandler: () => void;
}

const CartContext = createContext<CartContextType>({
  count: 0,
  visible: false,
  addToCartHandler: () => {},
});

const useCart = () => {
  const context = use(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const CartProvider = ({ children }: React.PropsWithChildren) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addToCartHandler = useCallback(() => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setCount((prev) => prev + 1);
    setVisible(true);

    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      hideTimeoutRef.current = null;

      resetTimeoutRef.current = setTimeout(() => {
        setCount(0);
        resetTimeoutRef.current = null;
      }, 500);
    }, 1250);
  }, []);

  return <CartContext.Provider value={{ count, visible, addToCartHandler }}>{children}</CartContext.Provider>;
};

export { CartProvider, useCart };
