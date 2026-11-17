// Splits one sentence into the two bands of a trapo.
// A newline or "|" forces the split; otherwise we pick the word boundary
// closest to ~40% of the text, preferring punctuation and clause starters.

const TARGET = 0.4
const MIN = 0.2
const MAX = 0.72

// Words that usually open the second half of the joke.
const STRONG = new Set([
  'pra', 'para', 'porque', 'pq', 'que', 'enquanto', 'quando', 'mas', 'só', 'so',
  'depois', 'agora', 'e', 'mesmo', 'sendo', 'tipo', 'até', 'ate', 'se', 'onde',
  'como', 'nem', 'ou', 'aí', 'ai', 'então', 'entao', 'vs', 'contra',
])
// Prepositions: an OK place to break, but weaker.
const WEAK = new Set(['da', 'do', 'das', 'dos', 'de', 'na', 'no', 'nas', 'nos', 'com', 'sem', 'pelo', 'pela'])

const TRAILING_PUNCT = /[,;:–—\-|]+$/

export function splitPhrase(input: string): { top: string; bottom: string } {
  const text = input.trim().replace(/[ \t]+/g, ' ')
  const forced = text.split(/\s*(?:\n|\|)\s*/)
  if (forced.length > 1) {
    return { top: forced[0], bottom: forced.slice(1).join(' ') }
  }

  const words = text.split(' ').filter(Boolean)
  if (words.length < 3) return { top: text, bottom: '' }

  let best = { score: Infinity, index: Math.ceil(words.length / 2) }
  let chars = 0
  for (let i = 1; i < words.length; i++) {
    chars += words[i - 1].length + 1
    const pos = chars / text.length
    if (pos < MIN || pos > MAX) continue

    let score = Math.abs(pos - TARGET)
    const prev = words[i - 1]
    const next = words[i].toLowerCase()
    if (/[,;:.!?…]$/.test(prev) || /^[–—-]$/.test(next)) score -= 0.3
    else if (STRONG.has(next)) score -= 0.2
    else if (WEAK.has(next)) score -= 0.06

    if (score < best.score) best = { score, index: i }
  }

  const top = words.slice(0, best.index).join(' ').replace(TRAILING_PUNCT, '').trim()
  const bottom = words.slice(best.index).join(' ').replace(/^[–—-]\s*/, '').trim()
  return { top, bottom }
}
