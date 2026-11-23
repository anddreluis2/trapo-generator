# trapo

Generates two-band "trapo" images in a team's colors. Page at the root, API under `/api`.

## API

One phrase is enough. The API figures out where to break it between the top and bottom bands.

```
GET /api/trapo?frase=É os guri da catequese
GET /api/trapo?time=inter&frase=Vendi o carro pra pagar o sócio torcedor
```

| param   | required | notes |
|---------|----------|-------|
| `frase` | yes*     | Split automatically. Use `\|` or a newline to choose the break yourself. `texto` and `q` also work. |
| `time`  | no       | Defaults to `gremio`. Takes an id, a name or an alias (`colorado`, `coxa`, `Grêmio`...). |
| `cima` / `baixo` | no | Set the two bands explicitly. Overrides `frase`. |
| `fonte` | no       | Max font size in px, integer from 40 to 200. Defaults to `110`. Text still shrinks to fit its band. |
| `altura` | no      | Stretches the letters vertically, in percent, integer from 100 to 250. Defaults to `100`. Width is unchanged. |

\* either `frase` or `cima`/`baixo`. Max 300 characters total.

It returns a `image/png` (1280×720). The split it used comes back in the `X-Trapo-Cima` / `X-Trapo-Baixo` headers (URL-encoded).

`POST /api/trapo` takes the same fields as JSON:

```sh
curl -X POST https://trapo-generator-zeta.vercel.app/api/trapo \
  -H 'Content-Type: application/json' \
  -d '{"time":"coxa","frase":"Fui no Couto uma vez e nunca mais fui o mesmo"}' \
  -o trapo.png
```

`GET /api/times` lists the teams with their aliases.

Errors are `400 {"error": "..."}`. CORS is open.

## Chat bots

Forward the raw message as `cmd`. The API drops mentions and the `!trapo` trigger, reads `:params`, and splits the rest.

```
@Gork !trapo eh os guri da catequese :time=gremio
@Gork !trapo vendi o carro pra pagar o sócio torcedor :inter
@Gork !trapo larguei tudo | pra ver o jogo :time="sao paulo"
@Gork !trapo vai grêmio :fonte=180
```

- `:time=x` or just `:x` picks the team (id, name or alias). Without one it uses `gremio`.
- `|` forces where the line breaks.
- `:fonte=80` sets the max font size, `:altura=150` stretches the letters vertically.
- Any other `:key=value` is passed through (`:cima=...`, `:baixo=...`).

```js
// inside the bot's message handler, when the text contains "!trapo"
const res = await fetch('https://trapo-generator-zeta.vercel.app/api/trapo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cmd: message.body }),
})
if (!res.ok) return reply((await res.json()).error) // errors are short pt-BR messages, safe to post in the chat
const png = Buffer.from(await res.arrayBuffer())
// send `png` as an image with your WhatsApp lib
```

The same works as a plain image URL: `GET /api/trapo?cmd=<url-encoded message>`.

## Dev

```sh
npm install
npm run dev
```

## Adding a team

Add an entry to `src/teams.ts`.
