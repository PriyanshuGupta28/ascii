"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  MousePointer2,
  Upload,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SvgParticleCanvas from "@/components/SvgParticleCanvas";
import { DEFAULT_CONFIG } from "@/components/ParticleField";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";

// ── SVGs ──────────────────────────────────────────────────────────────────────

const HERO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <circle cx="250" cy="250" r="210" fill="none" stroke="black" stroke-width="22"/>
  <circle cx="250" cy="250" r="155" fill="none" stroke="black" stroke-width="16"/>
  <circle cx="250" cy="250" r="100" fill="none" stroke="black" stroke-width="12"/>
  <circle cx="250" cy="250" r="48"  fill="none" stroke="black" stroke-width="10"/>
  <circle cx="250" cy="250" r="10"  fill="black"/>
</svg>`;

const DEMO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect x="80"  y="60"  width="70"  height="280" rx="12" fill="black"/>
  <rect x="80"  y="270" width="240" height="70"  rx="12" fill="black"/>
</svg>`;

// ── Static data ───────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  "Upload SVG",
  "Tune Physics",
  "Export React",
  "Three.js",
  "WebGL",
  "React Three Fiber",
  "Real-time Animation",
  "Zero Setup",
  "TypeScript",
];

const STATS = [
  { value: "60", unit: "fps", label: "Real-time rendering" },
  { value: "3K+", unit: "", label: "Particles per shape" },
  { value: "0", unit: " deps", label: "Beyond Three.js" },
];

const FEATURES = [
  {
    icon: Upload,
    num: "01",
    title: "Upload Any SVG",
    desc: "Paste raw markup or drag-and-drop a file. Any shape, any complexity — the sampler rasterises it and maps every filled pixel into a precise 2D point cloud.",
  },
  {
    icon: Zap,
    num: "02",
    title: "Real-time Physics",
    desc: "Tune repulsion radius, spring return speed, and damping live. Every slider change is reflected in the WebGL canvas on the next frame without reloading.",
  },
  {
    icon: Code2,
    num: "03",
    title: "Export Clean Code",
    desc: "One click generates a fully self-contained React + TypeScript component with your exact config baked in — no extra dependencies beyond Three.js.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Upload your SVG",
    desc: "Paste SVG markup or upload a .svg file. The engine rasterises it and samples every filled pixel into a precise 2D point cloud.",
  },
  {
    num: "02",
    title: "Tune the physics",
    desc: "Adjust particle size, mouse repulsion strength, return speed, and damping until the motion feels exactly right.",
  },
  {
    num: "03",
    title: "Export the component",
    desc: "Hit Export Code to receive a self-contained React + TypeScript component ready to drop into any project.",
  },
];

const DEMOS = [
  {
    title: "Infinity Loop",
    tag: "Iconic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 280">
  <path d="M280,140 C280,84 228,36 168,36 C108,36 56,84 56,140 C56,196 108,244 168,244 C228,244 280,196 280,140 C280,84 332,36 392,36 C452,36 504,84 504,140 C504,196 452,244 392,244 C332,244 280,196 280,140 Z" fill="none" stroke="black" stroke-width="24"/>
</svg>`,
    size: 320,
    density: 2.5,
    color: "#818cf8",
    extra: { mouseStrength: 14, returnSpeed: 0.062, damping: 0.88 },
  },
  {
    title: "Hexagon Grid",
    tag: "Geometric",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <polygon points="200,118 262,154 262,226 200,262 138,226 138,154" fill="none" stroke="black" stroke-width="11"/>
  <polygon points="200,0 262,36 262,108 200,144 138,108 138,36" fill="none" stroke="black" stroke-width="11"/>
  <polygon points="200,256 262,292 262,364 200,400 138,364 138,292" fill="none" stroke="black" stroke-width="11"/>
  <polygon points="79,59 141,95 141,167 79,203 17,167 17,95" fill="none" stroke="black" stroke-width="11"/>
  <polygon points="321,59 383,95 383,167 321,203 259,167 259,95" fill="none" stroke="black" stroke-width="11"/>
  <polygon points="79,197 141,233 141,305 79,341 17,305 17,233" fill="none" stroke="black" stroke-width="11"/>
  <polygon points="321,197 383,233 383,305 321,341 259,305 259,233" fill="none" stroke="black" stroke-width="11"/>
</svg>`,
    size: 300,
    density: 2.5,
    color: "#34d399",
    extra: { mouseStrength: 16, returnSpeed: 0.068, damping: 0.875 },
  },
  {
    title: "Starburst",
    tag: "Dynamic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <line x1="200" y1="22" x2="200" y2="378" stroke="black" stroke-width="26" stroke-linecap="round"/>
  <line x1="22" y1="200" x2="378" y2="200" stroke="black" stroke-width="26" stroke-linecap="round"/>
  <line x1="64" y1="64" x2="336" y2="336" stroke="black" stroke-width="26" stroke-linecap="round"/>
  <line x1="336" y1="64" x2="64" y2="336" stroke="black" stroke-width="26" stroke-linecap="round"/>
  <circle cx="200" cy="200" r="32" fill="black"/>
</svg>`,
    size: 300,
    density: 3,
    color: "#fb7185",
    extra: { mouseStrength: 18, returnSpeed: 0.07, damping: 0.87 },
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero entrance — staggered
      gsap.from(".anim-eyebrow", {
        y: 14,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(".anim-headline-line", {
        yPercent: 110,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.22,
      });
      gsap.from(".anim-sub", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.58,
      });
      gsap.from(".anim-btns", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.72,
      });
      gsap.from(".anim-hint", {
        opacity: 0,
        duration: 0.8,
        delay: 1.05,
      });
      gsap.from(".anim-canvas", {
        scale: 0.88,
        opacity: 0,
        duration: 1.3,
        ease: "power3.out",
        delay: 0.28,
      });
      gsap.from(".anim-stat", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.9,
      });

      // Features
      gsap.from(".anim-feat-head", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".section-features", start: "top 80%" },
      });
      gsap.from(".anim-feat-card", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".section-features", start: "top 74%" },
      });

      // How it works
      gsap.from(".anim-steps-head", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".section-steps", start: "top 80%" },
      });
      gsap.from(".anim-step", {
        x: -28,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".section-steps", start: "top 74%" },
      });
      gsap.from(".anim-step-canvas", {
        scale: 0.88,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".section-steps", start: "top 74%" },
      });

      // CTA
      gsap.from(".anim-cta-line", {
        yPercent: 110,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".section-cta", start: "top 82%" },
      });
      gsap.from(".anim-cta-body", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".section-cta", start: "top 76%" },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
    >
      {/* Film-grain overlay */}

      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="section-hero relative flex flex-col min-h-[calc(100svh-56px)]">
        {/* Dot-grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(128,128,128,0.14) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 90% 90% at 50% 40%, black 15%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 90% at 50% 40%, black 15%, transparent 75%)",
          }}
        />

        {/* Main hero area */}
        <div className="relative z-10 flex-1 flex items-center w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-16">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
            {/* Left — copy */}
            <div className="max-w-2xl space-y-6 md:space-y-8">
              <div className="anim-eyebrow flex items-center gap-3 flex-wrap">
                <span className="text-[0.65rem] font-mono tracking-[0.25em] uppercase text-muted-foreground/80">
                  ascii.devsloka.in
                </span>
                <span className="text-muted-foreground/25 select-none">—</span>
                <span className="text-[0.65rem] font-mono tracking-[0.25em] uppercase text-muted-foreground/80">
                  Particle Animation Studio
                </span>
              </div>

              <h1
                className="font-bold tracking-[-0.035em] leading-[0.88]"
                style={{ fontSize: "clamp(2.75rem, 7vw, 7rem)" }}
              >
                <span className="block overflow-hidden">
                  <span className="anim-headline-line block">Bring any</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="anim-headline-line block text-muted-foreground">
                    SVG to life
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="anim-headline-line block">
                    with particles.
                  </span>
                </span>
              </h1>

              <p className="anim-sub text-base md:text-lg text-muted-foreground leading-[1.7] max-w-lg">
                A browser-based studio for creating interactive particle
                animations from any SVG. Real-time physics, mouse interaction —
                export production-ready React code.
              </p>

              <div className="anim-btns flex items-center gap-4 flex-wrap">
                <Button
                  render={<Link href="/playground" />}
                  size="lg"
                  className="gap-2 h-12 px-7 text-base"
                >
                  Open Playground
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  render={
                    <a
                      href="https://github.com/priyanshukr"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  size="lg"
                  className="gap-2 h-12 px-7"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Source
                </Button>
              </div>

              <p className="anim-hint flex items-center gap-2 text-xs text-muted-foreground/60">
                <MousePointer2 className="w-3 h-3 shrink-0" />
                Hover the canvas to see the physics in action
              </p>
            </div>

            {/* Right — particle canvas (desktop only) */}
            <div className="anim-canvas hidden lg:flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-[-12%] rounded-full bg-foreground/4 blur-3xl pointer-events-none" />
                <SvgParticleCanvas
                  svg={HERO_SVG}
                  size={500}
                  density={3}
                  config={{
                    ...DEFAULT_CONFIG,
                    color: "#b0b0c4",
                    particleSize: 2.1,
                    mouseStrength: 12,
                    returnSpeed: 0.07,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 border-t border-border/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-3 divide-x divide-border/40">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="anim-stat py-5 md:py-7 px-3 md:px-4 first:pl-0 last:pr-0"
                >
                  <div className="font-mono font-bold text-xl md:text-2xl tracking-[-0.02em] mb-1">
                    {s.value}
                    <span className="text-muted-foreground text-base font-medium">
                      {s.unit}
                    </span>
                  </div>
                  <div className="text-[0.6rem] tracking-[0.22em] uppercase text-muted-foreground/70 font-mono">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────────── */}
      <section className="border-y border-border/40 py-4 bg-secondary/15 overflow-hidden">
        <Marquee
          items={MARQUEE_ITEMS}
          separator="·"
          speed={30}
          className="text-[0.65rem] font-mono tracking-[0.18em] uppercase text-muted-foreground px-4"
        />
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="section-features border-b border-border/40 px-6 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <div className="anim-feat-head grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6 lg:gap-16 mb-10 md:mb-16 pb-8 md:pb-12 border-b border-border/40 items-end">
            <p className="text-[0.6rem] font-mono tracking-[0.25em] uppercase text-muted-foreground/70">
              — Capabilities
            </p>
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.05]"
              style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.75rem)" }}
            >
              Built for creative developers
              <br className="hidden md:block" /> who want more from the web.
            </h2>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-border/40">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={cn(
                  "anim-feat-card p-8 md:p-10 space-y-8 group hover:bg-secondary/20 transition-colors duration-300",
                  i < 2 &&
                    "border-b md:border-b-0 md:border-r border-border/40",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 border border-border/60 flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground group-hover:text-background transition-all duration-300">
                    <f.icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono font-bold text-[2.25rem] leading-none text-border/30 select-none">
                    {f.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-[0.94rem] tracking-[-0.01em] mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-[0.82rem] text-muted-foreground leading-[1.7]">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section className="section-steps border-b border-border/40 px-6 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Steps copy */}
          <div>
            <div className="anim-steps-head mb-12">
              <p className="text-[0.6rem] font-mono tracking-[0.25em] uppercase text-muted-foreground/70 mb-5">
                — How it works
              </p>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.05]"
                style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.75rem)" }}
              >
                Three steps to
                <br />
                animated art.
              </h2>
            </div>

            <div className="border border-border/40">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "anim-step flex gap-6 p-7 hover:bg-secondary/20 transition-colors duration-200",
                    i < STEPS.length - 1 && "border-b border-border/40",
                  )}
                >
                  <span className="font-mono text-[0.65rem] font-bold text-muted-foreground/30 shrink-0 mt-0.5 w-6">
                    {s.num}
                  </span>
                  <div>
                    <p className="font-semibold text-[0.94rem] tracking-[-0.01em] mb-2">
                      {s.title}
                    </p>
                    <p className="text-[0.82rem] text-muted-foreground leading-[1.7]">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo canvas (desktop only) */}
          <div className="anim-step-canvas hidden lg:flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-[-8%] rounded-full bg-foreground/3 blur-3xl pointer-events-none" />
              <SvgParticleCanvas
                svg={DEMO_SVG}
                size={380}
                density={2}
                config={{
                  ...DEFAULT_CONFIG,
                  color: "#9090a8",
                  mouseStrength: 16,
                  returnSpeed: 0.055,
                  damping: 0.88,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-demos border-b border-border/30 px-6 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Section label */}
          <div className="anim-feat-head flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-16 pb-8 md:pb-12 border-b border-border/30">
            <div>
              <p className="text-[0.58rem] font-mono tracking-[0.28em] uppercase text-muted-foreground/50 mb-4">
                — Interactive Demos
              </p>
              <h2
                className="font-bold tracking-[-0.03em] leading-[1.02]"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                Any shape.
                <br />
                <span className="text-muted-foreground">Any complexity.</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Hover each canvas below to see real-time physics. Every demo is
              live WebGL — not a recording.
            </p>
          </div>

          {/* Demo cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-border/30">
            {DEMOS.map((d, i) => (
              <div
                key={d.title}
                className={cn(
                  "anim-feat-card group relative flex flex-col",
                  i < 2 &&
                    "border-b md:border-b-0 md:border-r border-border/30",
                )}
              >
                {/* Canvas area */}
                <div
                  className="flex items-center justify-center py-10 px-6 transition-all duration-500"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.05) 0%, transparent 70%)",
                  }}
                >
                  <div className="relative">
                    <div
                      className="absolute inset-[-20%] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at center, ${d.color}22 0%, transparent 70%)`,
                      }}
                    />
                    <SvgParticleCanvas
                      svg={d.svg}
                      size={d.size}
                      density={d.density}
                      config={{
                        ...DEFAULT_CONFIG,
                        color: d.color,
                        particleSize: 2,
                        ...d.extra,
                      }}
                    />
                  </div>
                </div>
                {/* Card meta */}
                <div className="border-t border-border/30 p-6 flex items-start justify-between">
                  <div>
                    <p
                      className="text-[0.55rem] font-mono tracking-[0.28em] uppercase mb-1.5"
                      style={{ color: d.color }}
                    >
                      {d.tag}
                    </p>
                    <p className="text-sm font-semibold tracking-[-0.01em]">
                      {d.title}
                    </p>
                  </div>
                  <MousePointer2 className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 group-hover:text-muted-foreground/60 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="section-cta px-6 md:px-12 lg:px-16 py-20 md:py-32 lg:py-44">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-bold tracking-[-0.035em] leading-[0.88] mb-12"
            style={{ fontSize: "clamp(2.75rem, 7vw, 7rem)" }}
          >
            <span className="block overflow-hidden">
              <span className="anim-cta-line block">Ready to bring</span>
            </span>
            <span className="block overflow-hidden">
              <span className="anim-cta-line block text-muted-foreground">
                your SVGs
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="anim-cta-line block">to life?</span>
            </span>
          </h2>

          <div className="anim-cta-body flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6">
            <p className="text-muted-foreground text-base leading-[1.7] max-w-sm">
              Open the playground and start animating in seconds — no account,
              no install, no limits.
            </p>
            <Button
              render={<Link href="/playground" />}
              size="lg"
              className="gap-2 h-14 px-8 text-base shrink-0"
            >
              Start Creating
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 px-6 md:px-12 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <span className="text-sm font-bold font-mono tracking-tight">
              ascii
            </span>
            <span className="text-[0.65rem] text-muted-foreground/50 font-mono">
              ascii.devsloka.in
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-[0.7rem] text-muted-foreground">
              Built by{" "}
              <a
                href="https://devsloka.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                devsloka.in
              </a>
              {" × "}
              <a
                href="https://priyanshukr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                priyanshukr.com
              </a>
            </p>
            <p className="text-[0.65rem] text-muted-foreground/40 font-mono">
              Next.js · Three.js · React Three Fiber · shadcn/ui
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
