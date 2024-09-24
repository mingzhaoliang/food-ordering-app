"use client";

import { useCountDown } from "@/lib/hooks/useCountDown";
import { timerFormatter } from "@/lib/utils/formatter";

interface ExpirationTimerProps {
  expiresAt: Date;
}

export default function ExpirationTimer({ expiresAt }: ExpirationTimerProps) {
  const { countDown } = useCountDown(expiresAt.getTime() - Date.now(), { step: 1000 });

  return (
    <>
      {countDown > 0 && (
        <p className="px-2 py-[0.1rem] text-destructive font-semibold text-sm">{timerFormatter(countDown)}</p>
      )}
    </>
  );
}
