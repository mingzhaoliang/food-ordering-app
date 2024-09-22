import { useCallback, useEffect, useRef, useState } from "react";

export const useCountDown = (initialValue: number, options?: { interval?: number; step?: number }) => {
  const [countDown, setCountDown] = useState<number>(initialValue);
  const countDownTimer = useRef<NodeJS.Timeout>();

  const { interval, step } = options || {};

  const resetCountDown = useCallback(() => {
    countDownTimer.current && clearInterval(countDownTimer.current);
    countDownTimer.current = undefined;
    setCountDown(initialValue);
  }, [countDownTimer, initialValue]);

  useEffect(() => {
    if (!countDownTimer.current) {
      countDownTimer.current = setInterval(() => {
        setCountDown((prev) => prev - (step || 1));
      }, interval || 1000);
    }

    if (countDown === 0) {
      clearInterval(countDownTimer.current);
    }
  }, [countDown, countDownTimer, interval, step]);

  return { countDown, resetCountDown };
};
