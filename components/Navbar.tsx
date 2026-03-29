"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import CodeExportDialog from "@/components/CodeExportDialog";
import LogoParticles from "@/components/LogoParticles";

interface NavbarProps {
  showExport?: boolean;
  exportCode?: string;
}

export default function Navbar({ showExport, exportCode }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="h-14 border-b border-border/40 flex items-center px-6 shrink-0 sticky top-0 z-50 bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-8 flex-1 min-w-0">
        <Link
          href="/"
          className="shrink-0 flex items-center"
          aria-label="ascii home"
        >
          <LogoParticles />
        </Link>
        <nav className="hidden md:flex items-center gap-0.5">
          {[
            { href: "/", label: "Home" },
            { href: "/playground", label: "Playground" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 text-[0.7rem] font-mono tracking-widest uppercase transition-colors",
                pathname === href
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {showExport && exportCode && <CodeExportDialog code={exportCode} />}
        <ThemeToggle />
      </div>
    </header>
  );
}
