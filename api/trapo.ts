import { createCanvas, GlobalFonts } from '@napi-rs/canvas'
import { join } from 'node:path'
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_STRETCH,
  HEIGHT,
  MAX_FONT_SIZE,
  MAX_STRETCH,
  MIN_FONT_SIZE,
  MIN_STRETCH,
  WIDTH,
  renderTrapo,
} from '../src/render.js'
import { parseCommand } from '../src/command.js'
import { splitPhrase } from '../src/split.js'
import { DEFAULT_TEAM, TEAMS, findTeam } from '../src/teams.js'

GlobalFonts.registerFromPath(join(process.cwd(), 'public/fonts/Anton-Regular.ttf'), 'Anton')

const MAX_LEN = 300
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'X-Trapo-Cima, X-Trapo-Baixo' }

type Input = Record<string, unknown>

function intParam(v: unknown, fallback: number, min: number, max: number) {
  if (v === undefined || v === '') return fallback
  const n = Number(v)
  return Number.isInteger(n) && n >= min && n <= max ? n : null
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')

function error(status: number, message: string) {
  return Response.json({ error: message }, { status, headers: CORS })
}

const USAGE = 'Uso: !trapo <frase> :time=gremio  (ou :gremio). Use | pra escolher onde quebra.'

function render(raw: Input) {
  // `cmd` takes the raw chat message ("@Gork !trapo ... :time=gremio").
  // Explicit fields still win over what's parsed from it.
  const cmd = str(raw.cmd) || str(raw.msg)
  let input = raw
  if (cmd) {
    const parsed = parseCommand(cmd)
    input = { frase: parsed.frase, ...parsed.params, ...raw }
  }

  const time = str(input.time)
  const team = time ? findTeam(time) : DEFAULT_TEAM
  if (!team) return error(400, `time desconhecido: "${time}". Times: ${TEAMS.map((t) => t.id).join(', ')}`)

  // Either one phrase (split automatically) or explicit cima/baixo.
  const frase = str(input.frase) || str(input.texto) || str(input.q)
  let cima = str(input.cima)
  let baixo = str(input.baixo)
  if (!cima && !baixo) ({ top: cima, bottom: baixo } = splitPhrase(frase))

  if (!cima.trim() && !baixo.trim()) return error(400, cmd ? `Faltou a frase. ${USAGE}` : 'manda a frase: ?frase=... (ou cima=... e baixo=...)')
  if (cima.length + baixo.length > MAX_LEN) return error(400, `frase muito grande, max ${MAX_LEN} caracteres`)

  const fonte = intParam(input.fonte, DEFAULT_FONT_SIZE, MIN_FONT_SIZE, MAX_FONT_SIZE)
  if (fonte === null) return error(400, `Fonte precisa ser um número inteiro entre ${MIN_FONT_SIZE} e ${MAX_FONT_SIZE}`)
  const altura = intParam(input.altura, DEFAULT_STRETCH, MIN_STRETCH, MAX_STRETCH)
  if (altura === null) return error(400, `Altura precisa ser um número inteiro entre ${MIN_STRETCH} e ${MAX_STRETCH}`)

  const canvas = createCanvas(WIDTH, HEIGHT)
  renderTrapo(canvas.getContext('2d'), team, cima, baixo, fonte, altura)
  return new Response(new Uint8Array(canvas.toBuffer('image/png')), {
    headers: {
      ...CORS,
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Trapo-Cima': encodeURIComponent(cima),
      'X-Trapo-Baixo': encodeURIComponent(baixo),
    },
  })
}

export function GET(req: Request) {
  return render(Object.fromEntries(new URL(req.url).searchParams))
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
