import { kitIconNames } from '../../src/icons'
const sprites = new Map<string, HTMLImageElement>()

// Original independent ICO frames, extracted without resampling.
const startFlag = new Image()
startFlag.src = '/icons/start-flag.png'
export const iconsReady = Promise.all([startFlag.decode(), ...kitIconNames.flatMap((name, index) =>
  ([16, 32] as const).map(async size => {
    const image = new Image()
    image.src = `/icons/${index}-${size}.png`
    await image.decode()
    sprites.set(`${name}-${size}`, image)
  }),
)])

export function drawKitIcon(context: CanvasRenderingContext2D, name: string, x: number, y: number, size: 16 | 32 = 32, scale = 1) {
  const sprite = sprites.get(`${name}-${size}`)
  if (sprite) {
    context.imageSmoothingEnabled = false
    context.drawImage(sprite, x, y, size * scale, size * scale)
  }
}

export function drawStartFlag(context: CanvasRenderingContext2D, x: number, y: number) {
  if (startFlag.complete && startFlag.naturalWidth) context.drawImage(startFlag, x, y)
}
