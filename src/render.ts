import type { Team } from './teams.ts'

// Minimal 2D context shape shared by the browser canvas and @napi-rs/canvas.
export interface Ctx2D {
  font: string
  fillStyle: unknown
  textAlign: string
  textBaseline: string
  fillRect(x: number, y: number, w: number, h: number): void
  fillText(text: string, x: number, y: number): void
  measureText(text: string): { width: number; actualBoundingBoxAscent: number }
  save(): void
  restore(): void
  translate(x: number, y: number): void
  scale(x: number, y: number): void
}

export const WIDTH = 1280
export const HEIGHT = 720
const TOP_RATIO = 0.42
const FONT = 'Anton'
const PAD_X = 70
const PAD_Y = 40
const LINE_HEIGHT = 1.12
const STRIPE_H = 28

export const DEFAULT_FONT_SIZE = 110
export const MIN_FONT_SIZE = 40
export const MAX_FONT_SIZE = 200

export const DEFAULT_STRETCH = 100
export const MIN_STRETCH = 100
export const MAX_STRETCH = 250

function wrap(ctx: Ctx2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  for (const paragraph of text.split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean)
    let line = ''
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
  }
  return lines
}

// Largest font size whose wrapped text fits the box.
function fitText(ctx: Ctx2D, text: string, w: number, h: number, max: number, sy: number) {
  for (let size = max; size >= 12; size -= 2) {
    ctx.font = `${size}px ${FONT}`
    const lines = wrap(ctx, text, w)
    const tooWide = lines.some((l) => ctx.measureText(l).width > w)
    if (!tooWide && lines.length * size * sy * LINE_HEIGHT <= h) return { size, lines }
  }
  ctx.font = `12px ${FONT}`
  return { size: 12, lines: wrap(ctx, text, w) }
}

function drawSection(
  ctx: Ctx2D,
  text: string,
  y: number,
  h: number,
  bg: string,
  color: string,
  maxFont: number,
  sy: number,
) {
  ctx.fillStyle = bg
  ctx.fillRect(0, y, WIDTH, h)
  if (!text.trim()) return
  const { size, lines } = fitText(ctx, text.toUpperCase(), WIDTH - PAD_X * 2, h - PAD_Y * 2, maxFont, sy)
  ctx.font = `${size}px ${FONT}`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  // Center on cap height, not em box, so all-caps text sits visually centered.
  ctx.textBaseline = 'alphabetic'
  const capH = ctx.measureText('H').actualBoundingBoxAscent * sy
  const lh = size * LINE_HEIGHT * sy
  const startY = y + h / 2 - ((lines.length - 1) * lh) / 2 + capH / 2
  lines.forEach((line, i) => {
    ctx.save()
    ctx.translate(WIDTH / 2, startY + i * lh)
    ctx.scale(1, sy)
    ctx.fillText(line, 0, 0)
    ctx.restore()
  })
}

// Expects a canvas already sized WIDTH x HEIGHT.
export function renderTrapo(
  ctx: Ctx2D,
  team: Team,
  top: string,
  bottom: string,
  fontSize = DEFAULT_FONT_SIZE,
  stretch = DEFAULT_STRETCH,
) {
  const topH = Math.round(HEIGHT * TOP_RATIO)
  const sy = stretch / 100
  drawSection(ctx, top, 0, topH, team.topBg, team.topText, fontSize, sy)
  drawSection(ctx, bottom, topH, HEIGHT - topH, team.bottomBg, team.bottomText, fontSize, sy)
  if (team.stripe) {
    ctx.fillStyle = team.stripe
    ctx.fillRect(0, topH - STRIPE_H / 2, WIDTH, STRIPE_H)
  }
}
