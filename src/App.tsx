import { useEffect, useRef, useState } from 'react'
import { TEAMS } from './teams'
import { HEIGHT, WIDTH, renderTrapo } from './render'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [teamId, setTeamId] = useState(TEAMS[0].id)
  const [top, setTop] = useState('Cansei de levar esse velho na fisioterapia')
  const [bottom, setBottom] = useState(
    'Pra ele assediar as médicas enquanto vc tinha crises depressivas',
  )
  const [fontReady, setFontReady] = useState(false)

  const team = TEAMS.find((t) => t.id === teamId) ?? TEAMS[0]

  useEffect(() => {
    document.fonts.load('100px Anton').finally(() => setFontReady(true))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    canvas.width = WIDTH
    canvas.height = HEIGHT
    renderTrapo(ctx, team, top, bottom)
  }, [team, top, bottom, fontReady])

  function download() {
    const url = canvasRef.current?.toDataURL('image/png')
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = `trapo-${team.id}.png`
    a.click()
  }

  return (
    <main className="app">
      <h1>Trapo Generator</h1>
      <div className="controls">
        <label>
          Time
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            {TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Frase de cima
          <textarea rows={2} value={top} onChange={(e) => setTop(e.target.value)} />
        </label>
        <label>
          Frase de baixo
          <textarea rows={3} value={bottom} onChange={(e) => setBottom(e.target.value)} />
        </label>
        <button onClick={download}>Baixar PNG</button>
      </div>
      <canvas ref={canvasRef} className="preview" />
    </main>
  )
}
