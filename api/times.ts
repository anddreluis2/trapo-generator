import { TEAMS } from '../src/teams.js'

export function GET() {
  return Response.json(
    TEAMS.map(({ id, name, aliases }) => ({ id, name, aliases })),
    { headers: { 'Access-Control-Allow-Origin': '*' } },
  )
}
