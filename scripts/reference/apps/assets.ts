const sprites = new Map<string, HTMLImageElement>()
const names = ['calculator-small', 'control-panel-small', 'browser-small', 'ie-logo', 'browser-status', 'tool-0-enabled', 'tool-1-enabled', ...Array.from({ length: 19 }, (_, i) => `applet-${i}`), ...Array.from({ length: 8 }, (_, i) => `tool-${i}`)]
export const appAssetsReady = Promise.all(names.map(async name => {
  const image = new Image()
  image.src = `/apps/${name}.png`
  await image.decode()
  sprites.set(name, image)
}))
export function appSprite(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, width?: number, height?: number) {
  const image = sprites.get(name)
  if (!image) return
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(image, x, y, width ?? image.naturalWidth, height ?? image.naturalHeight)
}
