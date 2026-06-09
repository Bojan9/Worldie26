"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Award, Check, Goal, Search, Shield, Sparkles } from "lucide-react";
import { saveAwardPrediction } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TeamFlag } from "@/components/team-flag";
import type {
  AwardPlayerData,
  AwardPredictionData,
} from "@/lib/app-data";
import { groups } from "@/lib/tournament";
import { cn } from "@/lib/utils";

type AwardKey =
  | "goldenBootPlayerId"
  | "goldenGlovePlayerId"
  | "goldenBallPlayerId"
  | "youngPlayerId";

const awardDefinitions: Array<{
  key: AwardKey;
  title: string;
  description: string;
  icon: typeof Award;
  accent: string;
}> = [
  {
    key: "goldenBootPlayerId",
    title: "Златна копачка",
    description: "Најдобар стрелец на турнирот",
    icon: Goal,
    accent: "text-amber-300",
  },
  {
    key: "goldenGlovePlayerId",
    title: "Златна ракавица",
    description: "Најдобар голман на турнирот",
    icon: Shield,
    accent: "text-cyan-300",
  },
  {
    key: "goldenBallPlayerId",
    title: "Златна топка",
    description: "Најдобар играч на турнирот",
    icon: Award,
    accent: "text-lime-300",
  },
  {
    key: "youngPlayerId",
    title: "Најдобар млад играч",
    description: "Најдобар играч под 21 година",
    icon: Sparkles,
    accent: "text-violet-300",
  },
];

const teamsByCode = new Map(
  groups.flatMap((group) => group.teams.map((team) => [team.code, team])),
);

const emptySelection: Record<AwardKey, string> = {
  goldenBootPlayerId: "",
  goldenGlovePlayerId: "",
  goldenBallPlayerId: "",
  youngPlayerId: "",
};

function isYoungPlayer(player: AwardPlayerData) {
  if (!player.dateOfBirth) return false;
  const cutoff = new Date("2005-06-11T00:00:00Z");
  return new Date(player.dateOfBirth) > cutoff;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function PlayerPicker({
  awardKey,
  players,
  selectedId,
  onSelect,
  disabled,
}: {
  awardKey: AwardKey;
  players: AwardPlayerData[];
  selectedId: string;
  onSelect: (playerId: string) => void;
  disabled: boolean;
}) {
  const [query, setQuery] = useState("");
  const [teamId, setTeamId] = useState("ALL");
  const selected = players.find((player) => player.id === selectedId);
  const eligiblePlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("mk");
    return players
      .filter((player) => {
        if (awardKey === "goldenGlovePlayerId" && player.position !== "Goalkeeper") {
          return false;
        }
        if (awardKey === "youngPlayerId" && !isYoungPlayer(player)) return false;
        if (teamId !== "ALL" && player.teamId !== teamId) return false;
        return (
          !normalizedQuery ||
          player.name.toLocaleLowerCase("mk").includes(normalizedQuery)
        );
      })
      .slice(0, 40);
  }, [awardKey, players, query, teamId]);
  const teamOptions = useMemo(
    () =>
      [...new Map(players.map((player) => [player.teamId, player.teamName])).entries()]
        .sort((a, b) => a[1].localeCompare(b[1], "mk")),
    [players],
  );

  return (
    <div className="mt-5">
      {selected ? (
        <div className="mb-4 flex items-center gap-3 bg-white/[0.06] p-3">
          <Avatar className="size-11">
            {selected.imageUrl ? <AvatarImage src={selected.imageUrl} alt="" /> : null}
            <AvatarFallback className="bg-white/10 text-xs text-white">
              {initials(selected.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-black text-white">{selected.name}</p>
            <p className="text-xs text-slate-400">
              {selected.teamName}
              {selected.jerseyNumber ? ` · #${selected.jerseyNumber}` : ""}
            </p>
          </div>
          <Check className="size-5 text-lime-300" />
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-[1fr_160px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Пребарај играч..."
            disabled={disabled}
            className="h-10 rounded-none border-white/10 bg-black/20 pl-9 text-white"
          />
        </label>
        <select
          value={teamId}
          onChange={(event) => setTeamId(event.target.value)}
          disabled={disabled}
          className="h-10 border border-white/10 bg-[#0b1825] px-3 text-sm text-slate-300 outline-none"
        >
          <option value="ALL">Сите репрезентации</option>
          {teamOptions.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 max-h-64 overflow-y-auto border border-white/10">
        {eligiblePlayers.map((player) => {
          const team = teamsByCode.get(player.teamId);
          return (
            <button
              type="button"
              key={player.id}
              disabled={disabled}
              onClick={() => onSelect(player.id)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-white/5 px-3 py-2.5 text-left transition last:border-0 hover:bg-white/[0.07] disabled:cursor-not-allowed",
                selectedId === player.id && "bg-lime-300/10",
              )}
            >
              {team ? <TeamFlag team={team} size={24} /> : null}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-white">
                  {player.name}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {player.teamName} · {player.position}
                </span>
              </span>
              {selectedId === player.id ? (
                <Check className="size-4 text-lime-300" />
              ) : null}
            </button>
          );
        })}
        {eligiblePlayers.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-slate-500">
            Нема играчи што одговараат на пребарувањето.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function AwardsGame({
  players,
  savedPrediction,
  currentTime,
}: {
  players: AwardPlayerData[];
  savedPrediction: AwardPredictionData | null;
  currentTime: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [selection, setSelection] = useState<Record<AwardKey, string>>(
    savedPrediction
      ? {
          goldenBootPlayerId: savedPrediction.goldenBootPlayerId,
          goldenGlovePlayerId: savedPrediction.goldenGlovePlayerId,
          goldenBallPlayerId: savedPrediction.goldenBallPlayerId,
          youngPlayerId: savedPrediction.youngPlayerId,
        }
      : emptySelection,
  );
  const locked =
    new Date(currentTime).getTime() > new Date("2026-06-11T18:50:00Z").getTime();
  const complete = Object.values(selection).every(Boolean);

  const submit = () => {
    if (!complete || locked) return;
    setMessage(null);
    startTransition(async () => {
      try {
        await saveAwardPrediction(selection);
        setMessage("Предвидувањата за наградите се зачувани.");
        router.refresh();
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Предвидувањата не беа зачувани.",
        );
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Badge className="bg-amber-300/10 text-amber-300">
            <Award className="size-3" /> 4 турнирски награди
          </Badge>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
            Предвиди ги индивидуалните награди
          </h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Избери по еден играч за секоја награда. Секој точен избор носи 10
            поени во вкупната табела.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-white/10 text-slate-400">
          {players.length} играчи · 48 репрезентации
        </Badge>
      </div>

      {players.length === 0 ? (
        <Card className="mt-8 border-white/10 bg-white/4.5 p-8 text-center text-white">
          <p className="font-black">Составите сè уште не се достапни.</p>
          <p className="mt-2 text-sm text-slate-400">
            Податоците автоматски ќе се синхронизираат од изворот за состави.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {awardDefinitions.map(({ key, title, description, icon: Icon, accent }) => (
            <Card
              key={key}
              className="rounded-none border-white/10 bg-white/4.5 p-5 text-white shadow-none"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-10 place-items-center bg-white/[0.06]">
                  <Icon className={cn("size-5", accent)} />
                </div>
                <div>
                  <h2 className="text-xl font-black">{title}</h2>
                  <p className="text-sm text-slate-500">{description}</p>
                </div>
              </div>
              <PlayerPicker
                awardKey={key}
                players={players}
                selectedId={selection[key]}
                onSelect={(playerId) =>
                  setSelection((current) => ({ ...current, [key]: playerId }))
                }
                disabled={locked || isPending}
              />
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col items-end gap-3">
        {locked ? (
          <p className="text-sm text-amber-300">
            Изборите се затворени 10 минути пред првиот натпревар.
          </p>
        ) : null}
        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
        <Button
          onClick={submit}
          disabled={!complete || locked || isPending}
          className="h-11 rounded-none bg-lime-300 px-6 font-black text-slate-950 hover:bg-lime-200"
        >
          <Check className="size-4" />
          {isPending
            ? "Се зачувува..."
            : savedPrediction
              ? "Ажурирај ги изборите"
              : "Зачувај ги изборите"}
        </Button>
      </div>
    </div>
  );
}
