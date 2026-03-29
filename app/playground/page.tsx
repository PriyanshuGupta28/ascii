"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import SvgParticleCanvas from "@/components/SvgParticleCanvas";
import ControlPanel from "@/components/ControlPanel";
import SvgUploader from "@/components/SvgUploader";
import Navbar from "@/components/Navbar";
import {
  DEFAULT_CONFIG,
  type ParticleConfig,
} from "@/components/ParticleField";
import { generateExportCode } from "@/lib/generateCode";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect x="80" y="60" width="70" height="280" rx="12" fill="black"/>
  <rect x="80" y="270" width="240" height="70" rx="12" fill="black"/>
</svg>`;

export default function Playground() {
  const [svg, setSvg] = useState(DEFAULT_SVG);
  const [config, setConfig] = useState<ParticleConfig>(DEFAULT_CONFIG);
  const [density, setDensity] = useState(3);
  const isMobile = useIsMobile();

  // Dynamically fit canvas to the available container space
  const mainRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(460);

  useEffect(() => {
    let rafId: number;
    const update = () => {
      if (!mainRef.current) return;
      const { width, height } = mainRef.current.getBoundingClientRect();
      const next = Math.max(
        240,
        Math.min(Math.floor(width - 48), Math.floor(height - 64), 460),
      );
      setCanvasSize((prev) => (Math.abs(prev - next) > 16 ? next : prev));
    };

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    });

    if (mainRef.current) ro.observe(mainRef.current);
    update();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  const exportCode = useMemo(
    () => generateExportCode(svg, config, density),
    [svg, config, density],
  );

  // Shared controls panel content rendered in both sidebar and Sheet
  const controlsContent = (
    <div className="p-4 space-y-4">
      <SvgUploader svg={svg} onSvgChange={setSvg} />
      <ControlPanel
        config={config}
        density={density}
        onChange={setConfig}
        onDensityChange={setDensity}
      />
    </div>
  );

  // Canvas preview shared between layouts
  const canvasPreview = (
    <div className="relative z-10">
      <SvgParticleCanvas
        svg={svg}
        size={canvasSize}
        density={density}
        config={config}
      />
      <p className="absolute -bottom-7 left-0 right-0 text-center text-[0.65rem] text-muted-foreground/50">
        {isMobile
          ? "Touch & drag to interact"
          : "Move your cursor over the particles to interact"}
      </p>
    </div>
  );

  // Dot-grid canvas backdrop
  const dotGrid = (
    <div
      className="absolute inset-0 pointer-events-none opacity-50"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(128,128,128,0.2) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );

  return (
    <div className="h-dvh flex flex-col bg-background text-foreground overflow-hidden">
      <Navbar showExport exportCode={exportCode} />

      {/* ── Mobile layout ─────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 md:hidden overflow-hidden min-h-0">
        <main
          ref={mainRef}
          className="flex-1 flex items-center justify-center relative overflow-hidden"
        >
          {dotGrid}
          {canvasPreview}
        </main>

        {/* Bottom bar */}
        <div className="border-t border-border/50 px-4 py-3 flex items-center justify-between gap-3 shrink-0 bg-background/80 backdrop-blur-md">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9 text-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Controls
                </Button>
              }
            />
            <SheetContent
              side="bottom"
              className="max-h-[85svh] flex flex-col overflow-hidden p-0 border-t border-border/60"
            >
              <div className="overflow-y-auto scrollbar-thin flex-1 min-h-0">
                {controlsContent}
              </div>
            </SheetContent>
          </Sheet>

          <p className="text-[0.62rem] font-mono text-muted-foreground/40 truncate">
            ascii · particle studio
          </p>
        </div>
      </div>

      {/* ── Desktop layout ────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border/50 shrink-0 overflow-y-auto scrollbar-thin">
          {controlsContent}
        </aside>

        {/* Canvas preview */}
        <main
          ref={mainRef}
          className="flex-1 flex items-center justify-center relative overflow-hidden"
        >
          {dotGrid}
          {canvasPreview}
        </main>
      </div>
    </div>
  );
}
