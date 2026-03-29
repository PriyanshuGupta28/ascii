/**
 * Extracts point positions from an SVG string by rendering it to a canvas
 * and sampling the filled pixels.
 */
export interface Point2D {
  x: number;
  y: number;
}

export function svgToPoints(
  svgString: string,
  canvasSize: number,
  density: number = 4
): Promise<Point2D[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get 2d context"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
      const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
      const points: Point2D[] = [];

      for (let y = 0; y < canvasSize; y += density) {
        for (let x = 0; x < canvasSize; x += density) {
          const i = (y * canvasSize + x) * 4;
          const alpha = imageData.data[i + 3];
          if (alpha > 128) {
            // Center the coordinates around 0,0
            points.push({
              x: x - canvasSize / 2,
              y: -(y - canvasSize / 2), // flip Y for Three.js
            });
          }
        }
      }

      URL.revokeObjectURL(url);
      resolve(points);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG"));
    };

    img.src = url;
  });
}
