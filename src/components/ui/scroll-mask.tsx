import { cn } from "@/lib/utils/cn";
import { LazyMotion, MotionValue, domAnimation, m } from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";

export default function ScrollMask({
  startOpacityIndex,
  endOpacityIndex,
  scrollHandler,
  className,
}: {
  startOpacityIndex: MotionValue<number>;
  endOpacityIndex: MotionValue<number>;
  scrollHandler: (direction: "left" | "right") => void;
  className?: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("absolute inset-0 pointer-events-none", className)}>
        <m.div
          className={`absolute inset-0 z-20 bg-gradient-to-r from-white from-1% via-transparent via-20%`}
          style={{ opacity: startOpacityIndex }}
        />
        <m.div
          className={`absolute inset-0 z-20 bg-gradient-to-l from-white from-1% via-transparent via-20%`}
          style={{ opacity: endOpacityIndex }}
        />
        <m.div
          initial={{ x: 10 }}
          animate={{ x: 0 }}
          exit={{ x: 10 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute p-2 z-30 top-1/2 -left-12 rounded-full bg-black hover:bg-emerald-400 transition-colors pointer-events-auto"
          style={{
            opacity: startOpacityIndex,
          }}
          onClick={scrollHandler.bind(null, "left")}
        >
          <MoveLeft className="text-white 2xl:text-xl" />
        </m.div>
        <m.div
          initial={{ x: -10 }}
          animate={{ x: 0 }}
          exit={{ x: -10 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute p-2 z-30 top-1/2 -right-12 rounded-full bg-black hover:bg-emerald-400 transition-colors pointer-events-auto"
          style={{
            opacity: endOpacityIndex,
          }}
          onClick={scrollHandler.bind(null, "right")}
        >
          <MoveRight className="text-white 2xl:text-xl" />
        </m.div>
      </div>
    </LazyMotion>
  );
}
