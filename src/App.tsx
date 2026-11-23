import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_TEAM, TEAMS } from './teams'
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
} from './render'
import { splitPhrase } from './split'

const REPO = 'https://github.com/anddreluis2/trapo-generator'
const DEFAULT_PHRASE = 'É os guri da catequese'
const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const MOD = IS_MAC ? '⌘' : 'Ctrl'

type CopyState = 'idle' | 'copied' | 'error'
type Theme = 'light' | 'dark'

function initialTheme(): Theme {
  const t = document.documentElement.dataset.theme
  if (t === 'light' || t === 'dark') return t
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ghostRef = useRef<HTMLCanvasElement>(null)
  const prevTeamRef = useRef<string | null>(null)
  const [teamId, setTeamId] = useState(DEFAULT_TEAM.id)
  const [phrase, setPhrase] = useState(DEFAULT_PHRASE)
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const [stretch, setStretch] = useState(DEFAULT_STRETCH)
  const [fontReady, setFontReady] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // storage blocked: theme just won't persist
    }
  }, [theme])

  const team = TEAMS.find((t) => t.id === teamId) ?? DEFAULT_TEAM
  const { top, bottom } = useMemo(() => splitPhrase(phrase), [phrase])

  useEffect(() => {
    document.fonts.load('100px Anton').finally(() => setFontReady(true))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const teamChanged = prevTeamRef.current !== null && prevTeamRef.current !== team.id
    prevTeamRef.current = team.id
    if (teamChanged) crossfadeFrom(canvas)

    canvas.width = WIDTH
    canvas.height = HEIGHT
    renderTrapo(ctx, team, top, bottom, fontSize, stretch)
  }, [team, top, bottom, fontSize, stretch, fontReady])

  useEffect(() => {
    if (copyState === 'idle') return
    const id = setTimeout(() => setCopyState('idle'), 1800)
    return () => clearTimeout(id)
  }, [copyState])

  // Snapshot the outgoing frame onto a ghost canvas and fade it out over the new one.
  function crossfadeFrom(canvas: HTMLCanvasElement) {
    const ghost = ghostRef.current
    const gctx = ghost?.getContext('2d')
    if (!ghost || !gctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ghost.width = canvas.width
    ghost.height = canvas.height
    gctx.drawImage(canvas, 0, 0)
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)'
    ghost.animate(
      [
        { opacity: 1, filter: 'blur(0px)' },
        { opacity: 0, filter: 'blur(8px)' },
      ],
      { duration: 450, easing, fill: 'forwards' },
    )
    canvas.animate(
      [
        { transform: 'scale(0.985)', filter: 'saturate(0.6)' },
        { transform: 'scale(1)', filter: 'saturate(1)' },
      ],
      { duration: 550, easing },
    )
  }

  const download = useCallback(() => {
    const url = canvasRef.current?.toDataURL('image/png')
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = `trapo-${team.id}.png`
    a.click()
  }, [team.id])

  const copy = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      // Pass a promise so Safari keeps the user-gesture context.
      const blob = new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('empty canvas'))), 'image/png'),
      )
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return
      const k = e.key.toLowerCase()
      if (k === 's') {
        e.preventDefault()
        download()
      } else if (k === 'c' && e.shiftKey) {
        e.preventDefault()
        void copy()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [download, copy])

  const apiPhrase = phrase.trim().replace(/\s*\n\s*/g, ' | ')
  const apiFont =
    (fontSize === DEFAULT_FONT_SIZE ? '' : `&fonte=${fontSize}`) +
    (stretch === DEFAULT_STRETCH ? '' : `&altura=${stretch}`)
  const apiHref = `/api/trapo?time=${team.id}${apiFont}&frase=${encodeURIComponent(apiPhrase)}`
  const apiLabel = `/api/trapo?time=${team.id}${apiFont}&frase=${apiPhrase.replace(/ /g, '+')}`

  return (
    <div className="page">
      <nav className="nav">
        <a className="brand" href="/">
          <span
            className="mark"
            data-stripe={team.stripe ? '' : undefined}
            style={{
              ['--mark-top' as string]: team.topBg,
              ['--mark-bottom' as string]: team.bottomBg,
              ['--mark-stripe' as string]: team.stripe,
            }}
            aria-hidden
          />
          trapo
        </a>
        <div className="nav-links">
          <a href={`${REPO}#api`} target="_blank" rel="noreferrer">API</a>
          <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Mudar pro modo claro' : 'Mudar pro modo escuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            <span className="theme-icon" data-active={theme === 'light'} aria-hidden>
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="3" />
                <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M3.4 12.6l.85-.85M11.75 4.25l.85-.85" />
              </svg>
            </span>
            <span className="theme-icon" data-active={theme === 'dark'} aria-hidden>
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M13.5 9.6A5.5 5.5 0 0 1 6.4 2.5a5.5 5.5 0 1 0 7.1 7.1Z" />
              </svg>
            </span>
          </button>
        </div>
      </nav>

      <main className="main">
        <header className="hero">
          <a className="chip" href={`${REPO}#api`} target="_blank" rel="noreferrer">
            API open to agents <span aria-hidden>↗</span>
          </a>
          <h1>Trapo Generator</h1>
        </header>

        <div className="editor">
          <section className="controls">
            <label className="field">
              <span className="label">Frase</span>
              <textarea
                rows={3}
                value={phrase}
                placeholder={DEFAULT_PHRASE}
                onChange={(e) => setPhrase(e.target.value)}
              />
              <span className="hint">
                Quebra sozinho entre cima e baixo. <kbd>Enter</kbd> escolhe onde.
              </span>
            </label>

            <div className="field">
              <span className="label" id="team-label">Time</span>
              <div className="teams" role="radiogroup" aria-labelledby="team-label">
                {TEAMS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={t.id === teamId}
                    className="team"
                    onClick={() => setTeamId(t.id)}
                  >
                    <span className="swatch" data-stripe={t.stripe ? '' : undefined} aria-hidden>
                      <span style={{ background: t.topBg }} />
                      {t.stripe && <span style={{ background: t.stripe }} />}
                      <span style={{ background: t.bottomBg }} />
                    </span>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <label className="field">
              <span className="label-row">
                <span className="label">Tamanho da fonte</span>
                <span className="value">{fontSize}px</span>
              </span>
              <input
                type="range"
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                step={2}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </label>

            <label className="field">
              <span className="label-row">
                <span className="label">Altura da letra</span>
                <span className="value">{stretch}%</span>
              </span>
              <input
                type="range"
                min={MIN_STRETCH}
                max={MAX_STRETCH}
                step={5}
                value={stretch}
                onChange={(e) => setStretch(Number(e.target.value))}
              />
            </label>

            <div className="actions">
              <button type="button" className="btn btn-dark" onClick={download}>
                Baixar PNG <kbd>{MOD}</kbd><kbd>S</kbd>
              </button>
              <button type="button" className="btn btn-light" onClick={copy}>
                {copyState === 'copied' ? 'Copiada' : copyState === 'error' ? 'Não deu' : 'Copiar'}
                <kbd>{MOD}</kbd><kbd>⇧</kbd><kbd>C</kbd>
              </button>
            </div>
          </section>

          <section className="preview-col">
            <div className="frame">
              <canvas ref={canvasRef} className="preview" aria-label="Pré-visualização do trapo" />
              <canvas ref={ghostRef} className="preview ghost" aria-hidden />
            </div>
            <a className="endpoint" href={apiHref} target="_blank" rel="noreferrer" title="Abrir essa imagem pela API">
              <span className="method">GET</span>
              <span className="url">{apiLabel}</span>
              <span className="open" aria-hidden>↗</span>
            </a>
          </section>
        </div>
      </main>
    </div>
  )
}
