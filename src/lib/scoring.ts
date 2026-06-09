export type Score = { home: number; away: number };
export type GroupRankings = Record<string, string[]>;

const outcome = ({ home, away }: Score) =>
  home === away ? "draw" : home > away ? "home" : "away";

export function scoreMatchPrediction(prediction: Score, result: Score) {
  if (prediction.home === result.home && prediction.away === result.away) {
    return 5;
  }

  return outcome(prediction) === outcome(result) ? 2 : 0;
}

export function canSubmitMatchPrediction(kickoff: Date, now = new Date()) {
  return now.getTime() <= kickoff.getTime() - 10 * 60 * 1000;
}

export function scoreTournamentPrediction(
  predictedGroups: GroupRankings,
  actualGroups: GroupRankings,
  predictedChampion: string | undefined,
  actualChampion: string | undefined,
) {
  let groupPoints = 0;
  let perfectGroupBonuses = 0;

  for (const [group, actualRanking] of Object.entries(actualGroups)) {
    const predictedRanking = predictedGroups[group] ?? [];
    const correctPositions = actualRanking.filter(
      (teamCode, index) => predictedRanking[index] === teamCode,
    ).length;
    groupPoints += correctPositions * 2;
    if (correctPositions === 4) perfectGroupBonuses += 2;
  }

  const championPoints =
    predictedChampion && actualChampion && predictedChampion === actualChampion
      ? 20
      : 0;

  return {
    groupPoints,
    perfectGroupBonuses,
    championPoints,
    total: groupPoints + perfectGroupBonuses + championPoints,
  };
}
