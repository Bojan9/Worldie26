export type KnockoutStage =
  | "Round of 32"
  | "Round of 16"
  | "Quarter-finals"
  | "Semi-finals"
  | "Medal matches";

export type KnockoutMatchDefinition = {
  id: number;
  stage: KnockoutStage;
  date: string;
  venue: string;
  home: string;
  away: string;
};

export const thirdPlaceSlots: Record<number, string[]> = {
  74: ["A", "B", "C", "D", "F"],
  77: ["C", "D", "F", "G", "H"],
  79: ["C", "E", "F", "H", "I"],
  80: ["E", "H", "I", "J", "K"],
  81: ["A", "E", "H", "I", "J"],
  82: ["B", "E", "F", "I", "J"],
  85: ["E", "F", "G", "I", "J"],
  87: ["D", "E", "I", "J", "L"],
};

export function assignThirdPlaceGroups(selectedGroups: string[]) {
  if (selectedGroups.length !== 8) return {} as Record<number, string>;
  const slots = Object.entries(thirdPlaceSlots)
    .map(([matchId, candidates]) => ({
      matchId: Number(matchId),
      candidates: candidates.filter((group) => selectedGroups.includes(group)),
    }))
    .sort((a, b) => a.candidates.length - b.candidates.length);

  const result: Record<number, string> = {};
  const used = new Set<string>();
  const place = (index: number): boolean => {
    if (index === slots.length) return true;
    const slot = slots[index];
    for (const group of slot.candidates) {
      if (used.has(group)) continue;
      used.add(group);
      result[slot.matchId] = group;
      if (place(index + 1)) return true;
      used.delete(group);
      delete result[slot.matchId];
    }
    return false;
  };

  return place(0) ? result : {};
}

export const knockoutMatches: KnockoutMatchDefinition[] = [
  { id: 73, stage: "Round of 32", date: "Jun 28", venue: "SoFi Stadium", home: "2A", away: "2B" },
  { id: 74, stage: "Round of 32", date: "Jun 29", venue: "Gillette Stadium", home: "1E", away: "3:A/B/C/D/F" },
  { id: 75, stage: "Round of 32", date: "Jun 29", venue: "Estadio BBVA", home: "1F", away: "2C" },
  { id: 76, stage: "Round of 32", date: "Jun 29", venue: "NRG Stadium", home: "1C", away: "2F" },
  { id: 77, stage: "Round of 32", date: "Jun 30", venue: "MetLife Stadium", home: "1I", away: "3:C/D/F/G/H" },
  { id: 78, stage: "Round of 32", date: "Jun 30", venue: "AT&T Stadium", home: "2E", away: "2I" },
  { id: 79, stage: "Round of 32", date: "Jun 30", venue: "Estadio Azteca", home: "1A", away: "3:C/E/F/H/I" },
  { id: 80, stage: "Round of 32", date: "Jul 1", venue: "Mercedes-Benz Stadium", home: "1L", away: "3:E/H/I/J/K" },
  { id: 81, stage: "Round of 32", date: "Jul 1", venue: "Levi's Stadium", home: "1D", away: "3:B/E/F/I/J" },
  { id: 82, stage: "Round of 32", date: "Jul 1", venue: "Lumen Field", home: "1G", away: "3:A/E/H/I/J" },
  { id: 83, stage: "Round of 32", date: "Jul 2", venue: "BMO Field", home: "2K", away: "2L" },
  { id: 84, stage: "Round of 32", date: "Jul 2", venue: "SoFi Stadium", home: "1H", away: "2J" },
  { id: 85, stage: "Round of 32", date: "Jul 2", venue: "BC Place", home: "1B", away: "3:E/F/G/I/J" },
  { id: 86, stage: "Round of 32", date: "Jul 3", venue: "Hard Rock Stadium", home: "1J", away: "2H" },
  { id: 87, stage: "Round of 32", date: "Jul 3", venue: "Arrowhead Stadium", home: "1K", away: "3:D/E/I/J/L" },
  { id: 88, stage: "Round of 32", date: "Jul 3", venue: "AT&T Stadium", home: "2D", away: "2G" },
  { id: 89, stage: "Round of 16", date: "Jul 4", venue: "Philadelphia", home: "W74", away: "W77" },
  { id: 90, stage: "Round of 16", date: "Jul 4", venue: "Houston", home: "W73", away: "W75" },
  { id: 91, stage: "Round of 16", date: "Jul 5", venue: "New York/New Jersey", home: "W76", away: "W78" },
  { id: 92, stage: "Round of 16", date: "Jul 5", venue: "Mexico City", home: "W79", away: "W80" },
  { id: 93, stage: "Round of 16", date: "Jul 6", venue: "Dallas", home: "W83", away: "W84" },
  { id: 94, stage: "Round of 16", date: "Jul 6", venue: "Seattle", home: "W81", away: "W82" },
  { id: 95, stage: "Round of 16", date: "Jul 7", venue: "Atlanta", home: "W86", away: "W88" },
  { id: 96, stage: "Round of 16", date: "Jul 7", venue: "Vancouver", home: "W85", away: "W87" },
  { id: 97, stage: "Quarter-finals", date: "Jul 9", venue: "Boston", home: "W89", away: "W90" },
  { id: 98, stage: "Quarter-finals", date: "Jul 10", venue: "Los Angeles", home: "W93", away: "W94" },
  { id: 99, stage: "Quarter-finals", date: "Jul 11", venue: "Miami", home: "W91", away: "W92" },
  { id: 100, stage: "Quarter-finals", date: "Jul 11", venue: "Kansas City", home: "W95", away: "W96" },
  { id: 101, stage: "Semi-finals", date: "Jul 14", venue: "Dallas", home: "W97", away: "W98" },
  { id: 102, stage: "Semi-finals", date: "Jul 15", venue: "Atlanta", home: "W99", away: "W100" },
  { id: 103, stage: "Medal matches", date: "Jul 18", venue: "Miami", home: "L101", away: "L102" },
  { id: 104, stage: "Medal matches", date: "Jul 19", venue: "New York/New Jersey", home: "W101", away: "W102" },
];

export const knockoutStages: KnockoutStage[] = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Medal matches",
];

export const previousKnockoutStage: Partial<Record<KnockoutStage, KnockoutStage>> = {
  "Round of 16": "Round of 32",
  "Quarter-finals": "Round of 16",
  "Semi-finals": "Quarter-finals",
  "Medal matches": "Semi-finals",
};

export const bracketMatchOrder: Record<KnockoutStage, number[]> = {
  "Round of 32": [74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87],
  "Round of 16": [89, 90, 93, 94, 91, 92, 95, 96],
  "Quarter-finals": [97, 98, 99, 100],
  "Semi-finals": [101, 102],
  "Medal matches": [104, 103],
};

export function getDescendantMatchIds(matchId: number) {
  const descendants = new Set<number>();
  const pending = [matchId];

  while (pending.length) {
    const sourceId = pending.shift()!;
    for (const match of knockoutMatches) {
      const referencesSource = [match.home, match.away].some(
        (reference) => reference === `W${sourceId}` || reference === `L${sourceId}`,
      );
      if (!referencesSource) continue;
      if (descendants.has(match.id)) continue;
      descendants.add(match.id);
      pending.push(match.id);
    }
  }

  return descendants;
}
