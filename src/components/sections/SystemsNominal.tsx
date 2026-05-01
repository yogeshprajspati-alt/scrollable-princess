"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";

const telemetry = [
  { label: "Mindset Stability", value: "Optimal", note: "Calm & Resilient" },
  { label: "Empathy Output", value: "Radiant", note: "Pure, Golden Heart" },
  { label: "Ambition Peak", value: "Boundless", note: "Infinite Potential" },
  { label: "Kindness Factor", value: "Pure", note: "Deeply Admired" },
];

export function SystemsNominal() {
  return (
    <section
      id="systems"
      className="relative border-t border-white/5 bg-background px-6 pb-28 pt-24 md:px-10 md:pb-40 md:pt-32"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-16 md:grid md:grid-cols-[5fr_4fr] md:gap-20">
        <AnimatedSection className="flex flex-col gap-8">
          <AnimatedItem>
            <span className="font-serif italic text-accent tracking-wide text-sm md:text-base">Final Report</span>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="max-w-[16ch] font-serif text-4xl font-semibold leading-[0.98] tracking-tight text-foreground md:text-6xl italic">
              &ldquo;You are&hellip;
              <br />
              <span className="text-accent">Unstoppable.</span>&rdquo;
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="max-w-[48ch] font-sans text-base leading-relaxed text-zinc-400 md:text-lg">
              Feel the potential, you truly are remarkable. In moments of doubt, remember that your calm strength is your greatest asset. &mdash; this isn't just praise, it's the truth.
              <br /><br />
              I hope you know that you are the bravest of the brave, the one and only Prachiiiee.
              Fear nothing, for you have everything within you to succeed. Go with the flow and enjoy every moment of your radiant journey!
              The reason I said you are a princess and not a queen is that, a queen can have limitations, but a princess can do anything and everything she wants, literally anything. Queens are tough but princesses are soft and pretty.
              Khushhhhhhhhhhhhhhhhh Ab bohot acche se exam dena, sab accha hota h jab aapka mn khush hota h. Bhaad me jaaye sab, bas khush raho tum.
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <a
              href="#footer"
              className="group inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] active:translate-y-[1px]"
            >
              The Archive
              <ArrowUpRight
                size={14}
                weight="bold"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="flex flex-col divide-y divide-white/5 border-t border-white/5 font-sans md:mt-3">
          {telemetry.map((row) => (
            <AnimatedItem key={row.label}>
              <div className="flex items-baseline justify-between gap-6 py-6">
                <div className="flex flex-col gap-1">
                  <span className="font-serif italic text-[11px] tracking-wider text-accent">
                    {row.label}
                  </span>
                  <span className="font-sans text-[13px] text-zinc-400">
                    {row.note}
                  </span>
                </div>
                <span className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl italic">
                  {row.value}
                </span>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
