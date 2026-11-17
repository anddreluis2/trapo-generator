// Parses a raw chat message like:
//   "@Gork !trapo eh os guri da catequese :time=gremio"
// Mentions and the !trapo trigger are dropped, `:key=value` pairs become params,
// a bare `:name` is shorthand for `:time=name`, and what's left is the phrase.

export type ParsedCommand = {
  frase: string
  params: Record<string, string>
}

const PARAM = /(^|\s):([\p{L}\w-]+)(?:=("[^"]*"|'[^']*'|\S+))?(?=\s|$)/gu

export function parseCommand(raw: string): ParsedCommand {
  const params: Record<string, string> = {}

  let text = raw.replace(PARAM, (_match, lead: string, key: string, value?: string) => {
    if (value === undefined) params.time = key
    else params[key.toLowerCase()] = value.replace(/^["']|["']$/g, '')
    return lead
  })

  text = text
    .replace(/(^|\s)@\S+/g, ' ') // @Gork, @5511999999999
    .replace(/(^|\s)[!/]trapo\b/i, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return { frase: text, params }
}
