import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "./magicui/animated-gradient-text";
import { BlobBackground } from "./blob-background";
import { cn } from "@/lib/utils";

const blobs = [
  {
    id: "blob1",
    gradientColors: ["#7C3AED", "#EC4899"],
    size: 450,
    blur: 70,
    speed: 12,
    opacity: 0.3,
    zIndex: 1,
    initialPosition: { x: 30, y: 30 },
    pulseScale: 1.2,
    rotationSpeed: 8,
    mouseInteractive: true,
  },
  {
    id: "blob2",
    gradientColors: ["#EC4899", "#3B82F6"],
    size: 350,
    blur: 60,
    speed: 15,
    opacity: 0.25,
    zIndex: 2,
    initialPosition: { x: 70, y: 50 },
    pulseScale: 1.15,
    rotationSpeed: 12,
    mouseInteractive: true,
  },
  {
    id: "blob3",
    gradientColors: ["#3B82F6", "#7C3AED"],
    size: 400,
    blur: 65,
    speed: 18,
    opacity: 0.2,
    zIndex: 3,
    initialPosition: { x: 50, y: 70 },
    pulseScale: 1.1,
    rotationSpeed: 10,
    mouseInteractive: true,
  },
];

export function Hero() {
  return (
    <div className="relative z-30 h-[400px] w-full overflow-hidden rounded-lg border border-border/40 bg-background/50 backdrop-blur-xs">
      <BlobBackground blobs={blobs} />
      <div className="absolute inset-0 z-10 flex items-center justify-center flex-col gap-4">
      <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
        <span
          className={cn(
            "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
          )}
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
        />
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-sm font-medium">
          Introducing Remi AI
        </AnimatedGradientText>
        <ChevronRight
          className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
        />
      </div>
        <div className="text-center">
          <h1 className="mb-4 text-black text-4xl font-bold">
            Your AI-powered personal assistant
          </h1>
          <p className="text-lg text-black">
            Attractive fluid shapes for modern interfaces
          </p>
        </div>
      </div>
  </div>
  );
}
