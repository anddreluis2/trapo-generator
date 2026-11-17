import { createCanvas, GlobalFonts } from '@napi-rs/canvas'
import { join } from 'node:path'
import { HEIGHT, WIDTH, renderTrapo } from '../src/render.js'
import { TEAMS, findTeam } from '../src/teams.js'

GlobalFonts.registerFromPath(join(process.cwd(), 'public/fonts/Anton-Regular.ttf'), 'Anton')

const MAX_LEN = 300
const CORS = { 'Access-Control-Allow-Origin': '*' }

type Input = { time?: unknown; cima?: unknown; baixo?: unknown }

function error(status: number, message: string) {
  return Response.json({ error: message }, { status, headers: CORS })
}

function render(input: Input) {
  const time = typeof input.time === 'string' ? input.time : ''
  const cima = typeof input.cima === 'string' ? input.cima : ''
  const baixo = typeof input.baixo === 'string' ? input.baixo : ''

  const team = findTeam(time)
  if (!team) return error(400, `time invalido. Use um de: ${TEAMS.map((t) => t.id).join(', ')}`)
  if (!cima.trim() && !baixo.trim()) return error(400, 'mande pelo menos cima ou baixo')
  if (cima.length > MAX_LEN || baixo.length > MAX_LEN) return error(400, `max ${MAX_LEN} caracteres por frase`)

  const canvas = createCanvas(WIDTH, HEIGHT)
  renderTrapo(canvas.getContext('2d'), team, cima, baixo)
  const png = canvas.toBuffer('image/png')
  return new Response(new Uint8Array(png), {
    headers: {
      ...CORS,
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export function GET(req: Request) {
  const p = new URL(req.url).searchParams
  return render({ time: p.get('time') ?? undefined, cima: p.get('cima') ?? undefined, baixo: p.get('baixo') ?? undefined })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return error(400, 'body precisa ser JSON')
  return render(body as Input)
}

export function OPTIONS() {
  return new Response(null, {
    headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  })
}
