import { cn } from "@/lib/utils";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight, Sparkles } from "lucide-react";
import { RadialColorBackground } from "@/components/radial-color-background";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/ui/navbar";
import { PricingSection } from "@/components/pricing-table";

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]

export const TIERS = [
  {
    id: "individuals",
    name: "Individuals",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "For your hobby projects",
    features: [
      "Free email alerts",
      "3-minute checks",
      "Automatic data enrichment",
      "10 monitors",
      "Up to 3 seats",
    ],
    cta: "Get started",
  },
  {
    id: "teams",
    name: "Teams",
    price: {
      monthly: 90,
      yearly: 75,
    },
    description: "Great for small businesses",
    features: [
      "Unlimited phone calls",
      "30 second checks",
      "Single-user account",
      "20 monitors",
      "Up to 6 seats",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    id: "organizations",
    name: "Organizations",
    price: {
      monthly: 120,
      yearly: 100,
    },
    description: "Great for large businesses",
    features: [
      "Unlimited phone calls",
      "15 second checks",
      "Single-user account",
      "50 monitors",
      "Up to 10 seats",
    ],
    cta: "Get started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For multiple teams",
    features: [
      "Everything in Organizations",
      "Up to 5 team members",
      "100 monitors",
      "15 status pages",
      "200+ integrations",
    ],
    cta: "Contact Us",
    highlighted: true,
  },
]

export default function Home() {
  const gradientColorsHero = {
    from: "oklch(0.7 0.15 280)", // Purple
    to: "oklch(0.6 0.2 320)",    // Magenta 
    direction: "top-right" as const
  }
  const gradientColors = {
    from: "oklch(0.8 0.13 150)", // Soft Green
    to: "oklch(0.7 0.18 230)",   // Soft Blue
    direction: "bottom-left" as const
  }
  const gradientColorsIntegrations = {
    from: "oklch(0.85 0.14 80)",   // Soft Yellow-Green
    to: "oklch(0.75 0.16 120)",    // Fresh Green
    direction: "center" as const
  }
  const gradientColorsPricing = {
    from: "oklch(0.8 0.15 20)",    // Warm Orange
    to: "oklch(0.7 0.18 40)",      // Soft Peach
    direction: "bottom-right" as const
  }
  return (
    <main className="min-h-screen w-screen overflow-x-hidden relative">
      <Navbar />
      {/* Hero Section */}
      <main className="flex-1 h-full">
        <RadialColorBackground gradient={gradientColorsHero} className="h-[800px]" id="hero">
          {/* <Particles /> */}
          <div className="flex flex-col items-center justify-center gap-4 h-full">
            <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] z-10 bg-white">
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
              <Sparkles className="size-3" />
               <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
              <AnimatedGradientText className="text-sm font-medium">
                Tu asistente personal por Whatsapp
              </AnimatedGradientText>
              <ChevronRight
                className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
              />
            </div>
            <div className="flex flex-col items-center justify-center z-10">
              <TextAnimate as="h1" className="text-9xl font-bold">Remi AI</TextAnimate>
              <TextAnimate as="p" className="text-lg">Your AI-powered personal assistant</TextAnimate>
            </div>
            <Button className="rounded-lg">Empieza ahora</Button>
          </div>
        </RadialColorBackground>
        <RadialColorBackground gradient={gradientColors} className="h-[800px]" id="features">
          {/* Features Section TODO:  center content  */}
          <div className="inset-0 z-10 flex flex-col items-start gap-4">
            <Badge className="flex items-center gap-2 bg-white text-black">
              <Sparkles className="size-4" />
              <p>Como funciona</p>
            </Badge>
            <div className="flex flex-col z-10 items-starts">
              <TextAnimate as="h2" className="text-7xl font-bold">Ahorra tiempo para lo que importa</TextAnimate>
              <TextAnimate as="p" className="text-lg">Remi te ayudara con tu rutina diaria, te ayudara a planificar tus tareas y a mantenerte organizado</TextAnimate>
            </div>
            <Button className="rounded-lg">Empieza ahora</Button>
          </div>
        </RadialColorBackground>
        <RadialColorBackground gradient={gradientColorsIntegrations} className="h-[800px]" id="integrations">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-7xl font-bold">Integraciones</h1>
            <p className="text-lg">Integraciones con las mejores aplicaciones</p>
          </div>
        </RadialColorBackground>
        <RadialColorBackground gradient={gradientColorsPricing} className="h-[800px]" id="pricing">
          <PricingSection title="Planes" subtitle="Planes para todos los gustos" tiers={TIERS} frequencies={PAYMENT_FREQUENCIES} />
        </RadialColorBackground>
      </main>
      <footer>
        <p>Powered by Remi AI</p>
      </footer>
    </main>
  );
}
