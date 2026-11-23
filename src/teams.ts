export type Team = {
  id: string
  name: string
  aliases: string[]
  topBg: string
  topText: string
  bottomBg: string
  bottomText: string
  stripe?: string
}

// Add new teams here. `id`, name or any alias work in the API's `time`.
// Grêmio first (default), the rest alphabetical.
export const TEAMS: Team[] = [
  { id: 'gremio', name: 'Grêmio', aliases: ['tricolor', 'imortal'], topBg: '#3a7fe0', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff', stripe: '#ffffff' },
  { id: 'america-mg', name: 'América-MG', aliases: ['america', 'america mineiro', 'coelho'], topBg: '#00873e', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'atletico-mg', name: 'Atlético-MG', aliases: ['galo', 'atletico mineiro', 'cam'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#000000' },
  { id: 'cap', name: 'Athletico-PR', aliases: ['athletico', 'athletico-pr', 'furacao'], topBg: '#c8102e', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'avai', name: 'Avaí', aliases: ['leao da ressacada'], topBg: '#0057b8', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#0057b8' },
  { id: 'bahia', name: 'Bahia', aliases: ['esquadrao', 'bahea'], topBg: '#0047ab', topText: '#ffffff', bottomBg: '#e30613', bottomText: '#ffffff', stripe: '#ffffff' },
  { id: 'botafogo', name: 'Botafogo', aliases: ['fogao', 'glorioso'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#000000' },
  { id: 'ceara', name: 'Ceará', aliases: ['vozao'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#000000' },
  { id: 'chapecoense', name: 'Chapecoense', aliases: ['chape', 'verdao do oeste'], topBg: '#00843d', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#00843d' },
  { id: 'corinthians', name: 'Corinthians', aliases: ['timao', 'coringao', 'sccp'], topBg: '#ffffff', topText: '#000000', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'coritiba', name: 'Coritiba', aliases: ['coxa'], topBg: '#00653a', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#00653a' },
  { id: 'criciuma', name: 'Criciúma', aliases: ['tigre', 'tigrao'], topBg: '#ffd100', topText: '#000000', bottomBg: '#000000', bottomText: '#ffd100', stripe: '#ffffff' },
  { id: 'cruzeiro', name: 'Cruzeiro', aliases: ['raposa', 'cabuloso'], topBg: '#1f4fa0', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#1f4fa0' },
  { id: 'figueirense', name: 'Figueirense', aliases: ['figueira', 'furacao do estreito'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#000000' },
  { id: 'flamengo', name: 'Flamengo', aliases: ['mengao', 'fla', 'mengo'], topBg: '#d0021b', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'fluminense', name: 'Fluminense', aliases: ['flu', 'nense'], topBg: '#870a28', topText: '#ffffff', bottomBg: '#00613c', bottomText: '#ffffff', stripe: '#ffffff' },
  { id: 'fortaleza', name: 'Fortaleza', aliases: ['leao', 'laion'], topBg: '#e30613', topText: '#ffffff', bottomBg: '#0b3b8c', bottomText: '#ffffff', stripe: '#ffffff' },
  { id: 'goias', name: 'Goiás', aliases: ['esmeraldino'], topBg: '#006837', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#006837' },
  { id: 'guarani', name: 'Guarani', aliases: ['bugre'], topBg: '#00843d', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#00843d' },
  { id: 'inter', name: 'Inter', aliases: ['internacional', 'colorado'], topBg: '#e5050f', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#e5050f' },
  { id: 'juventude', name: 'Juventude', aliases: ['ju', 'papo'], topBg: '#009845', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#009845' },
  { id: 'nautico', name: 'Náutico', aliases: ['timbu'], topBg: '#e2001a', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#e2001a' },
  { id: 'palmeiras', name: 'Palmeiras', aliases: ['verdao', 'porco', 'sep'], topBg: '#0b6b3a', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#0b6b3a' },
  { id: 'paysandu', name: 'Paysandu', aliases: ['papao', 'papao da curuzu'], topBg: '#00a3e0', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#00a3e0' },
  { id: 'ponte-preta', name: 'Ponte Preta', aliases: ['ponte', 'macaca'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#000000' },
  { id: 'portuguesa', name: 'Portuguesa', aliases: ['lusa'], topBg: '#e30613', topText: '#ffffff', bottomBg: '#00843d', bottomText: '#ffffff' },
  { id: 'remo', name: 'Remo', aliases: ['clube do remo', 'leao azul'], topBg: '#0a1f5c', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#0a1f5c' },
  { id: 'santa-cruz', name: 'Santa Cruz', aliases: ['santinha', 'cobra coral'], topBg: '#ffffff', topText: '#e30613', bottomBg: '#000000', bottomText: '#ffffff', stripe: '#e30613' },
  { id: 'santos', name: 'Santos', aliases: ['peixe', 'sfc'], topBg: '#ffffff', topText: '#000000', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'sao-paulo', name: 'São Paulo', aliases: ['sao paulo', 'spfc', 'tricolor paulista'], topBg: '#ffffff', topText: '#d1121f', bottomBg: '#000000', bottomText: '#ffffff', stripe: '#d1121f' },
  { id: 'sport', name: 'Sport', aliases: ['sport recife', 'leao da ilha'], topBg: '#d71920', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'vasco', name: 'Vasco', aliases: ['gigante da colina', 'vascao'], topBg: '#000000', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#d71920' },
  { id: 'vitoria', name: 'Vitória', aliases: ['leao da barra', 'nego'], topBg: '#000000', topText: '#ffffff', bottomBg: '#e30613', bottomText: '#ffffff' },
]

export const DEFAULT_TEAM = TEAMS[0]

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

export function findTeam(query: string): Team | undefined {
  const q = normalize(query)
  return TEAMS.find((t) => t.id === q || normalize(t.name) === q || t.aliases.includes(q))
}
