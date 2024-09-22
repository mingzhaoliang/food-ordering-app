import { useEffect, useRef, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebouncedValue] = useState(value);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debounceValue;
};
