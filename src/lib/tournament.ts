export type Team = {
  code: string;
  name: string;
  flag: string;
};

export type TournamentGroup = {
  id: string;
  teams: Team[];
};

export type Match = {
  id: number;
  group: string;
  round: 1 | 2 | 3;
  home: Team;
  away: Team;
  kickoff: string;
  venue: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status?: string;
};

const team = (code: string, name: string, flag: string): Team => ({
  code,
  name,
  flag,
});

export const groups: TournamentGroup[] = [
  { id: "A", teams: [team("MEX", "Mexico", "🇲🇽"), team("RSA", "South Africa", "🇿🇦"), team("KOR", "Korea Republic", "🇰🇷"), team("CZE", "Czechia", "🇨🇿")] },
  { id: "B", teams: [team("CAN", "Canada", "🇨🇦"), team("BIH", "Bosnia & Herz.", "🇧🇦"), team("QAT", "Qatar", "🇶🇦"), team("SUI", "Switzerland", "🇨🇭")] },
  { id: "C", teams: [team("BRA", "Brazil", "🇧🇷"), team("MAR", "Morocco", "🇲🇦"), team("HAI", "Haiti", "🇭🇹"), team("SCO", "Scotland", "🏴")] },
  { id: "D", teams: [team("USA", "United States", "🇺🇸"), team("PAR", "Paraguay", "🇵🇾"), team("AUS", "Australia", "🇦🇺"), team("TUR", "Türkiye", "🇹🇷")] },
  { id: "E", teams: [team("GER", "Germany", "🇩🇪"), team("CUW", "Curaçao", "🇨🇼"), team("CIV", "Côte d’Ivoire", "🇨🇮"), team("ECU", "Ecuador", "🇪🇨")] },
  { id: "F", teams: [team("NED", "Netherlands", "🇳🇱"), team("JPN", "Japan", "🇯🇵"), team("SWE", "Sweden", "🇸🇪"), team("TUN", "Tunisia", "🇹🇳")] },
  { id: "G", teams: [team("BEL", "Belgium", "🇧🇪"), team("EGY", "Egypt", "🇪🇬"), team("IRN", "IR Iran", "🇮🇷"), team("NZL", "New Zealand", "🇳🇿")] },
  { id: "H", teams: [team("ESP", "Spain", "🇪🇸"), team("CPV", "Cabo Verde", "🇨🇻"), team("KSA", "Saudi Arabia", "🇸🇦"), team("URU", "Uruguay", "🇺🇾")] },
  { id: "I", teams: [team("FRA", "France", "🇫🇷"), team("SEN", "Senegal", "🇸🇳"), team("IRQ", "Iraq", "🇮🇶"), team("NOR", "Norway", "🇳🇴")] },
  { id: "J", teams: [team("ARG", "Argentina", "🇦🇷"), team("ALG", "Algeria", "🇩🇿"), team("AUT", "Austria", "🇦🇹"), team("JOR", "Jordan", "🇯🇴")] },
  { id: "K", teams: [team("POR", "Portugal", "🇵🇹"), team("COD", "Congo DR", "🇨🇩"), team("UZB", "Uzbekistan", "🇺🇿"), team("COL", "Colombia", "🇨🇴")] },
  { id: "L", teams: [team("ENG", "England", "🏴"), team("CRO", "Croatia", "🇭🇷"), team("GHA", "Ghana", "🇬🇭"), team("PAN", "Panama", "🇵🇦")] },
];

export const byCode = new Map(groups.flatMap((group) => group.teams).map((item) => [item.code, item]));
const getTeam = (code: string) => byCode.get(code)!;

export const upcomingMatches: Match[] = [
  { id: 1, group: "A", round: 1, home: getTeam("MEX"), away: getTeam("RSA"), kickoff: "2026-06-11T19:00:00Z", venue: "Mexico City" },
  { id: 2, group: "A", round: 1, home: getTeam("KOR"), away: getTeam("CZE"), kickoff: "2026-06-12T02:00:00Z", venue: "Guadalajara" },
  { id: 3, group: "B", round: 1, home: getTeam("CAN"), away: getTeam("BIH"), kickoff: "2026-06-12T19:00:00Z", venue: "Toronto" },
  { id: 4, group: "D", round: 1, home: getTeam("USA"), away: getTeam("PAR"), kickoff: "2026-06-13T01:00:00Z", venue: "Los Angeles" },
  { id: 5, group: "C", round: 1, home: getTeam("HAI"), away: getTeam("SCO"), kickoff: "2026-06-13T19:00:00Z", venue: "Boston" },
  { id: 6, group: "D", round: 1, home: getTeam("AUS"), away: getTeam("TUR"), kickoff: "2026-06-13T22:00:00Z", venue: "Vancouver" },
];
