# Trapo Generator

Web page + API that renders a two-band "trapo" image in a team's colors.

## Dev

```sh
npm install
npm run dev
```

## API

`GET /api/times` lists the available teams (`id`, `name`).

`GET /api/trapo?time=gremio&cima=FRASE+DE+CIMA&baixo=FRASE+DE+BAIXO` returns `image/png` (1280x720).

`POST /api/trapo` takes the same fields as JSON:

```sh
curl -X POST https://<host>/api/trapo \
  -H 'Content-Type: application/json' \
  -d '{"time":"inter","cima":"frase de cima","baixo":"frase de baixo"}' \
  -o trapo.png
```

You need `cima` or `baixo` (or both). Each one can be at most 300 characters. Errors come back as `400 {"error": "..."}`. CORS is open.

## Adding a team

Add an entry to `src/teams.ts`. The `id` is what the API takes in `time`.
