# ascii — Particle Animation Studio

> **Live:** [ascii.devsloka.in](https://ascii.devsloka.in)  
> **Built by:** [devsloka.in](https://devsloka.in) × [priyanshukr.com](https://priyanshukr.com)

Transform any SVG into a living, interactive particle animation — entirely in your browser. No account, no install, no build step on the user's end.

---

## What it does

1. **Upload any SVG** — paste raw markup or drag-and-drop a `.svg` file. The engine rasterises the paths and maps every filled pixel into a precise 2D point cloud.
2. **Tune real-time physics** — adjust particle size, mouse repulsion radius, spring return speed, and damping. Every change reflects live in the WebGL canvas.
3. **Export clean code** — click *Export Code* to receive a fully self-contained React + TypeScript component with your exact config baked in, ready to drop into any project.

---

## Tech stack

| Layer | Library |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| 3D / WebGL | Three.js + React Three Fiber |
| Helpers | @react-three/drei |
| UI | shadcn/ui (Tailwind v4) |
| Animations | GSAP + ScrollTrigger |
| Language | TypeScript |
| Runtime | Bun |

---

## Getting started

```bash
# Install dependencies
bun install

# Start the dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project structure

```text
app/
  page.tsx          # Landing page
  playground/
    page.tsx        # Interactive studio
components/
  LogoParticles.tsx # 2D canvas particle logo for navbar
  Marquee.tsx       # Infinite horizontal ticker
  Navbar.tsx        # Site header
  ParticleField.tsx # WebGL particle shader (Three.js)
  SvgParticleCanvas.tsx  # R3F canvas wrapper
  SvgUploader.tsx   # SVG input component
  ControlPanel.tsx  # Physics sliders
  CodeExportDialog.tsx   # Code export modal
lib/
  svgToPoints.ts    # SVG → 2D point cloud sampler
  generateCode.ts   # Component code generator
```

---

## License

MIT © [devsloka.in](https://devsloka.in) / [priyanshukr.com](https://priyanshukr.com)
