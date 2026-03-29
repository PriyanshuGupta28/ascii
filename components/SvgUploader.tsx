"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface SvgUploaderProps {
  svg: string;
  onSvgChange: (svg: string) => void;
}

const SvgUploader = ({ svg, onSvgChange }: SvgUploaderProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onSvgChange(reader.result);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          SVG Source
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <input
          ref={fileRef}
          type="file"
          accept=".svg"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          Upload SVG File
        </Button>
        <Textarea
          value={svg}
          onChange={(e) => onSvgChange(e.target.value)}
          placeholder="Paste SVG markup here..."
          className="font-mono text-xs h-28 bg-secondary/50 resize-none"
        />
      </CardContent>
    </Card>
  );
};

export default SvgUploader;
