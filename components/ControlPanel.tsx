"use client";
import { type ParticleConfig } from "./ParticleField";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ControlPanelProps {
  config: ParticleConfig;
  density: number;
  onChange: (config: ParticleConfig) => void;
  onDensityChange: (d: number) => void;
}

const SliderControl = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-[0.7rem] text-muted-foreground/80">{label}</Label>
      <span className="text-[0.65rem] font-mono text-foreground/60">
        {value.toFixed(step < 1 ? 2 : 0)}
        {unit}
      </span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
    />
  </div>
);

const ControlPanel = ({
  config,
  density,
  onChange,
  onDensityChange,
}: ControlPanelProps) => {
  const update = (patch: Partial<ParticleConfig>) =>
    onChange({ ...config, ...patch });

  return (
    <div className="space-y-4 overflow-y-auto scrollbar-thin max-h-[calc(100vh-8rem)] pr-1">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Particles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4">
          <SliderControl
            label="Density"
            value={density}
            min={1}
            max={8}
            step={1}
            onChange={onDensityChange}
            unit="px"
          />
          <SliderControl
            label="Size"
            value={config.particleSize}
            min={0.5}
            max={8}
            step={0.1}
            onChange={(v) => update({ particleSize: v })}
          />
          <SliderControl
            label="Opacity"
            value={config.opacity}
            min={0.1}
            max={1}
            step={0.05}
            onChange={(v) => update({ opacity: v })}
          />
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Interaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4">
          <SliderControl
            label="Repulsion Radius"
            value={config.mouseRadius}
            min={10}
            max={120}
            step={1}
            onChange={(v) => update({ mouseRadius: v })}
            unit="px"
          />
          <SliderControl
            label="Repulsion Strength"
            value={config.mouseStrength}
            min={1}
            max={25}
            step={0.5}
            onChange={(v) => update({ mouseStrength: v })}
          />
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Animation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4">
          <SliderControl
            label="Return Speed"
            value={config.returnSpeed}
            min={0.01}
            max={0.3}
            step={0.01}
            onChange={(v) => update({ returnSpeed: v })}
          />
          <SliderControl
            label="Damping"
            value={config.damping}
            min={0.5}
            max={0.99}
            step={0.01}
            onChange={(v) => update({ damping: v })}
          />
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Color
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.color}
              onChange={(e) => update({ color: e.target.value })}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
            />
            <Input
              value={config.color}
              onChange={(e) => update({ color: e.target.value })}
              className="font-mono text-sm h-10 bg-secondary/50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
