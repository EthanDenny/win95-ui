export const DISPLAY_WIDTH = 640
export const DISPLAY_HEIGHT = 480

export function fitDisplay(width: number, height: number, density = 1) {
  // Scale in physical pixels, including Retina screens and browser zoom.
  // If the native buffer cannot fit, keep 1× and allow scrolling.
  const pixelScale = Math.max(1, Math.floor(Math.min(width * density / DISPLAY_WIDTH, height * density / DISPLAY_HEIGHT)))
  const scale = pixelScale / density
  return {
    scale,
    left: Math.max(0, Math.floor((width * density - DISPLAY_WIDTH * pixelScale) / 2) / density),
    top: Math.max(0, Math.floor((height * density - DISPLAY_HEIGHT * pixelScale) / 2) / density),
  }
}

export function toDesktopPoint(
  point: { x: number; y: number },
  bounds: { left: number; top: number; width: number },
) {
  const scale = bounds.width / DISPLAY_WIDTH
  return { x: (point.x - bounds.left) / scale, y: (point.y - bounds.top) / scale }
}
