export type Team = {
  id: string
  name: string
  aliases: string[]
  topBg: string
  topText: string
  bottomBg: string
  bottomText: string
}

// Add new teams here. `id`, name or any alias work in the API's `time`.
// Grêmio first (default), the rest alphabetical.
export const TEAMS: Team[] = [
  { id: 'gremio', name: 'Grêmio', aliases: ['tricolor', 'imortal'], topBg: '#3a7fe0', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'atletico-mg', name: 'Atlético-MG', aliases: ['galo', 'atletico mineiro', 'cam'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#000000' },
  { id: 'cap', name: 'Athletico-PR', aliases: ['athletico', 'athletico-pr', 'furacao'], topBg: '#c8102e', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'bahia', name: 'Bahia', aliases: ['esquadrao', 'bahea'], topBg: '#0047ab', topText: '#ffffff', bottomBg: '#e30613', bottomText: '#ffffff' },
  { id: 'botafogo', name: 'Botafogo', aliases: ['fogao', 'glorioso'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#000000' },
  { id: 'corinthians', name: 'Corinthians', aliases: ['timao', 'coringao', 'sccp'], topBg: '#ffffff', topText: '#000000', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'coritiba', name: 'Coritiba', aliases: ['coxa'], topBg: '#00653a', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#00653a' },
  { id: 'cruzeiro', name: 'Cruzeiro', aliases: ['raposa', 'cabuloso'], topBg: '#1f4fa0', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#1f4fa0' },
  { id: 'flamengo', name: 'Flamengo', aliases: ['mengao', 'fla', 'mengo'], topBg: '#d0021b', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'fluminense', name: 'Fluminense', aliases: ['flu', 'nense'], topBg: '#870a28', topText: '#ffffff', bottomBg: '#00613c', bottomText: '#ffffff' },
  { id: 'fortaleza', name: 'Fortaleza', aliases: ['leao', 'laion'], topBg: '#e30613', topText: '#ffffff', bottomBg: '#0b3b8c', bottomText: '#ffffff' },
  { id: 'inter', name: 'Inter', aliases: ['internacional', 'colorado'], topBg: '#e5050f', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#e5050f' },
  { id: 'palmeiras', name: 'Palmeiras', aliases: ['verdao', 'porco', 'sep'], topBg: '#0b6b3a', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#0b6b3a' },
  { id: 'santos', name: 'Santos', aliases: ['peixe', 'sfc'], topBg: '#ffffff', topText: '#000000', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'sao-paulo', name: 'São Paulo', aliases: ['sao paulo', 'spfc', 'tricolor paulista'], topBg: '#ffffff', topText: '#d1121f', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'vasco', name: 'Vasco', aliases: ['gigante da colina', 'vascao'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#d71920' },
]

export const DEFAULT_TEAM = TEAMS[0]

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

export function findTeam(query: string): Team | undefined {
  const q = normalize(query)
  return TEAMS.find((t) => t.id === q || normalize(t.name) === q || t.aliases.includes(q))
}
