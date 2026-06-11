"use client";

import { useState } from "react";
import { Eye, Trophy, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TeamFlag } from "@/components/team-flag";
import type { LeaderboardEntry, TournamentPredictionData } from "@/lib/app-data";
import {
  assignThirdPlaceGroups,
  bracketMatchOrder,
  knockoutMatches,
  knockoutStages,
  type KnockoutStage,
} from "@/lib/knockout";
import { groups, type Team } from "@/lib/tournament";

const tournamentTeams = new Map(
  groups.flatMap((group) => group.teams).map((team) => [team.code, team]),
);

const stageLabels: Record<KnockoutStage, string> = {
  "Round of 32": "Шеснаесетфинале",
  "Round of 16": "Осминафинале",
  "Quarter-finals": "Четвртфинале",
  "Semi-finals": "Полуфинале",
  "Medal matches": "Мечеви за медали",
};

const stageSpans: Record<KnockoutStage, number> = {
  "Round of 32": 1,
  "Round of 16": 2,
  "Quarter-finals": 4,
  "Semi-finals": 8,
  "Medal matches": 8,
};

function PredictionMatchCard({
  match,
  home,
  away,
  winnerCode,
}: {
  match: (typeof knockoutMatches)[number];
  home?: Team;
  away?: Team;
  winnerCode?: string;
}) {
  const isFinal = match.id === 104;

  return (
    <div className={`w-full overflow-hidden border ${isFinal ? "border-lime-300/35 bg-lime-300/8 shadow-[0_0_28px_rgba(190,242,100,.08)]" : "border-white/8 bg-[#132642]"}`}>
      <div className={`flex items-center justify-between gap-2 border-b px-2 py-1 text-[8px] ${isFinal ? "border-lime-300/20 text-lime-300" : "border-white/7 text-slate-500"}`}>
        <span className="font-black">
          {match.id === 104 ? "ФИНАЛЕ · M104" : match.id === 103 ? "ТРЕТО МЕСТО · M103" : `M${match.id}`}
        </span>
        <span className="truncate">{match.date} · {match.venue}</span>
      </div>
      <div className={isFinal ? "p-1.5" : "p-0.5"}>
        {[home, away].map((team, index) => {
          const selected = Boolean(team && winnerCode === team.code);
          return (
            <div
              key={team?.code ?? index}
              className={`flex items-center gap-1.5 px-1.5 font-semibold ${isFinal ? "h-7 text-[11px]" : "h-4 text-[9px]"} ${selected ? "bg-lime-300/15 text-lime-200" : team ? "text-slate-300" : "text-slate-600"}`}
            >
              {team ? <TeamFlag team={team} size={isFinal ? 18 : 13} /> : null}
              <span className="truncate">{team?.name ?? "Ќе биде одредено"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TournamentPredictionDetails({
  playerName,
  prediction,
}: {
  playerName: string;
  prediction: TournamentPredictionData;
}) {
  const rankings = Object.fromEntries(
    groups.map((group) => [
      group.id,
      (prediction.groupRankings[group.id] ?? [])
        .map((code) => tournamentTeams.get(code))
        .filter((team): team is Team => Boolean(team)),
    ]),
  );
  const assignments = assignThirdPlaceGroups(prediction.thirdPlaceGroups);

  const resolve = (reference: string): Team | undefined => {
    if (reference.startsWith("W")) {
      return tournamentTeams.get(prediction.bracket[reference.slice(1)]);
    }
    if (reference.startsWith("L")) {
      const source = knockoutMatches.find((match) => match.id === Number(reference.slice(1)));
      if (!source) return undefined;
      const home = resolve(source.home);
      const away = resolve(source.away);
      const winner = prediction.bracket[String(source.id)];
      if (!home || !away || !winner) return undefined;
      return home.code === winner ? away : home;
    }
    if (reference.startsWith("3:")) {
      const match = knockoutMatches.find((item) => item.away === reference);
      const group = match ? assignments[match.id] : undefined;
      return group ? rankings[group]?.[2] : undefined;
    }
    return rankings[reference[1]]?.[Number(reference[0]) - 1];
  };

  const renderMatch = (matchId: number) => {
    const match = knockoutMatches.find((item) => item.id === matchId)!;
    return (
      <PredictionMatchCard
        match={match}
        home={resolve(match.home)}
        away={resolve(match.away)}
        winnerCode={prediction.bracket[String(match.id)]}
      />
    );
  };

  return (
    <div className="public-prediction-screen flex h-full flex-col">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-white/8 px-4 pr-16">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">Предвидување на {playerName}</span>
          <span className="text-[9px] text-slate-600">{new Date(prediction.submittedAt).toLocaleString("mk-MK")}</span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="min-w-300">
          <section className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[.16em] text-cyan-300">Групна фаза</h3>
              <span className="text-[9px] text-slate-500">Зелената ознака ги покажува избраните третопласирани</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              {groups.map((group) => (
                <div key={group.id} className="border border-white/8 bg-[#132642]">
                  <div className="border-b border-white/7 bg-[#132d58] px-2 py-1 text-[9px] font-black text-slate-300">
                    ГРУПА {group.id}
                  </div>
                  <div className="p-1">
                    {(rankings[group.id] ?? []).map((team, index) => {
                      const advancesAsThird =
                        index === 2 && prediction.thirdPlaceGroups.includes(group.id);
                      return (
                        <div
                          key={team.code}
                          className={`flex h-5 items-center gap-1 px-1 text-[9px] ${advancesAsThird ? "bg-lime-300/12 text-lime-200" : "text-slate-300"}`}
                        >
                          <span className="w-3 font-mono text-slate-600">{index + 1}</span>
                          <TeamFlag team={team} size={13} />
                          <span className="min-w-0 truncate font-semibold">{team.name}</span>
                          {advancesAsThird ? <span className="ml-auto size-1.5 shrink-0 bg-lime-300" /> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <h3 className="mb-2 text-[10px] font-black uppercase tracking-[.16em] text-cyan-300">Нокаут-фаза</h3>
          <div className="mb-2 grid grid-cols-5 gap-2">
            {knockoutStages.map((stage) => (
              <h3 key={stage} className="bg-[#132d58] px-2 py-2 text-center text-[10px] font-black uppercase tracking-[.16em] text-slate-300">
                {stageLabels[stage]}
              </h3>
            ))}
          </div>
          <div className="grid min-h-165 grid-cols-5 items-stretch gap-2">
            {knockoutStages.map((stage) =>
              stage === "Medal matches" ? (
                <div key={stage} className="grid grid-rows-16 gap-1">
                  <div className="row-start-5 row-span-8 flex items-center">
                    <div className="w-full space-y-2">
                      {renderMatch(104)}
                      {renderMatch(103)}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={stage} className="grid grid-rows-16 gap-1">
                  {bracketMatchOrder[stage].map((matchId, index) => {
                    const span = stageSpans[stage];
                    return (
                      <div
                        key={matchId}
                        className="flex items-center"
                        style={{ gridRow: `${index * span + 1} / span ${span}` }}
                      >
                        {renderMatch(matchId)}
                      </div>
                    );
                  })}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicTournamentPredictions({
  players,
  className = "",
}: {
  players: LeaderboardEntry[];
  className?: string;
}) {
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const predictions = players.filter((player) => player.tournamentPrediction);

  return (
    <section className={className}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-300">
            <UserRound className="size-4" />
            <p className="text-xs font-black uppercase tracking-[.16em]">Предвидувања од други играчи</p>
          </div>
          <h2 className="mt-2 text-2xl font-black text-white">Цели турнирски предвидувања</h2>
          <p className="mt-1 text-sm text-slate-400">Избери играч за да ги видиш сите групи и избори во нокаут-фазата.</p>
        </div>
        <Badge className="shrink-0 bg-white/10 text-white">{predictions.length} предвидувања</Badge>
      </div>

      {predictions.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {predictions.map((player) => {
            const championCode = player.tournamentPrediction?.bracket["104"];
            const champion = championCode ? tournamentTeams.get(championCode) : undefined;
            return (
              <button
                key={player.userId}
                type="button"
                onClick={() => setSelectedPlayer(player)}
                className="flex items-center gap-3 border border-white/10 bg-white/4.5 p-4 text-left transition hover:border-cyan-300/30 hover:bg-white/7"
              >
                <Avatar className="size-10">
                  {player.avatarUrl ? <AvatarImage src={player.avatarUrl} alt="" /> : null}
                  <AvatarFallback className="bg-white/10 text-xs font-bold text-white">{player.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-white">{player.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <Trophy className="size-3 text-lime-300" />
                    <span>Шампион: {champion?.name ?? championCode ?? "Нема избор"}</span>
                  </div>
                </div>
                <Eye className="size-4 shrink-0 text-cyan-300" />
              </button>
            );
          })}
        </div>
      ) : (
        <Card className="mt-4 border-white/10 bg-white/4.5 p-6 text-center text-sm text-slate-500 shadow-none">
          Сè уште нема други испратени турнирски предвидувања.
        </Card>
      )}

      {selectedPlayer?.tournamentPrediction ? (
        <div className="fixed inset-0 z-100 bg-[#071a35]" role="dialog" aria-modal="true" aria-labelledby="public-prediction-title">
          <div className="relative h-dvh w-screen overflow-hidden bg-[#071a35] text-white">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSelectedPlayer(null)}
              className="absolute right-6 top-1.5 z-20 rounded-none border border-white/8 bg-black/20 p-0 text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Затвори"
            >
              <X className="size-4" />
            </Button>
            <div id="public-prediction-title" className="h-full">
              <TournamentPredictionDetails playerName={selectedPlayer.name} prediction={selectedPlayer.tournamentPrediction} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
