"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Code2 } from "lucide-react";

interface CodeExportDialogProps {
  code: string;
}

const CodeExportDialog = ({ code }: CodeExportDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="lg" className="gap-2">
            <Code2 className="w-4 h-4" />
            Export Code
          </Button>
        }
      />
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Generated React + TypeScript Component</span>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto w-full max-h-[60vh] rounded-lg bg-secondary/50 border border-border">
          <pre className="p-4 text-xs font-mono text-foreground/90 whitespace-pre-wrap">
            {code}
          </pre>
        </div>
        <p className="text-xs text-muted-foreground">
          Dependencies:{" "}
          <code className="text-primary/80">
            three @react-three/fiber react
          </code>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default CodeExportDialog;
