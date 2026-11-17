export type Team = {
  id: string
  name: string
  topBg: string
  topText: string
  bottomBg: string
  bottomText: string
}

// Add new teams here. `id` is what the API takes in `time`.
export const TEAMS: Team[] = [
  { id: 'gremio', name: 'Grêmio', topBg: '#3a7fe0', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'inter', name: 'Internacional', topBg: '#e5050f', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#e5050f' },
  { id: 'cap', name: 'Athletico Paranaense', topBg: '#c8102e', topText: '#ffffff', bottomBg: '#000000', bottomText: '#ffffff' },
  { id: 'coritiba', name: 'Coritiba', topBg: '#00653a', topText: '#ffffff', bottomBg: '#ffffff', bottomText: '#00653a' },
]

export function findTeam(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id.toLowerCase())
}
