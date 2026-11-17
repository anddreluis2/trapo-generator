import { TEAMS } from '../src/teams.js'

export function GET() {
  return Response.json(
    TEAMS.map(({ id, name }) => ({ id, name })),
    { headers: { 'Access-Control-Allow-Origin': '*' } },
  )
}
