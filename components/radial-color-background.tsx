import React, { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type Gradient =
  | string
  | {
      from: string
      to: string
      via?: string
      direction?: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
    }

interface RadialColorBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient: Gradient
}

const directionClassMap: Record<
  NonNullable<Exclude<Gradient, string>["direction"]>,
  string
> = {
  "top": "top-0 left-1/2 -translate-x-1/2 translate-y-[20%]",
  "bottom": "bottom-0 left-1/2 -translate-x-1/2 -translate-y-[20%]",
  "left": "left-0 top-1/2 -translate-y-1/2 -translate-x-[20%]",
  "right": "right-0 top-1/2 -translate-y-1/2 translate-x-[20%]",
  "top-left": "top-0 left-0 translate-x-[20%] translate-y-[20%]",
  "top-right": "top-0 right-0 -translate-x-[30%] translate-y-[20%]",
  "bottom-left": "bottom-0 left-0 translate-x-[20%] -translate-y-[20%]",
  "bottom-right": "bottom-0 right-0 -translate-x-[30%] -translate-y-[20%]",
  "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

export const RadialColorBackground = ({
  children,
  gradient,
  className,
}: PropsWithChildren<RadialColorBackgroundProps>) => {
  let background: string;
  let direction: NonNullable<Exclude<Gradient, string>["direction"]> = "top-right";
  if (typeof gradient === "string") {
    background = gradient;
  } else {
      direction = gradient.direction || "top-right";
      background = `linear-gradient(to ${direction.replace("-", " ")}, ${gradient.from}${gradient.via ? `, ${gradient.via}` : ""}, ${gradient.to})`;
    }

  return (
    <div className={cn("relative noise flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg", className)}>
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
        <div
          className={cn(
            "absolute h-[500px] w-[500px] rounded-full opacity-20 blur-[80px]",
            directionClassMap[direction]
          )}
          style={{ background }}
        ></div>
      </div>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default RadialColorBackground