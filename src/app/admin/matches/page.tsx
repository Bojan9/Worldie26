import { format } from "date-fns";
import { updateMatchResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminData } from "@/lib/admin-data";

const stageLabels = {
  group: "Group",
  round_of_32: "Round of 32",
  round_of_16: "Round of 16",
  quarter_final: "Quarter-final",
  semi_final: "Semi-final",
  third_place: "Third place",
  final: "Final",
} as const;

export default async function AdminMatchesPage() {
  const data = await getAdminData();
  const teamName = new Map(data.teams.map((team) => [team.id, team.name]));
  const now = data.currentTime.getTime();

  return (
    <>
      <h2 className="text-3xl font-black">Match results</h2>
      <p className="mt-1 text-sm text-slate-400">
        Saving a result closes the match, scores every prediction, updates its group table, and advances knockout participants.
      </p>
      <div className="mt-6 space-y-3">
        {data.matches.map((match) => {
          const started = match.kickoff.getTime() <= now;
          return (
            <form key={match.id} action={updateMatchResult}>
              <fieldset disabled={!started}>
                <Card className="grid gap-3 bg-white/4.5 p-4 text-white disabled:opacity-50 lg:grid-cols-[100px_150px_1fr_72px_72px_1fr_170px_auto] lg:items-center">
                  <input type="hidden" name="matchId" value={match.id} />
                  <div>
                    <p className="font-black">M{match.id}</p>
                    <p className="text-[10px] uppercase text-slate-500">{stageLabels[match.stage]}</p>
                  </div>
                  <div className="text-xs text-slate-500">
                    {format(match.kickoff, "MMM d, HH:mm")}
                    <br />
                    {started ? (match.complete ? "Result saved" : "Available") : "Locked until kickoff"}
                  </div>
                  <select name="homeTeamId" defaultValue={match.homeTeamId ?? ""} className="h-9 bg-[#0b1a28] px-3 text-sm font-bold outline-none">
                    <option value="">Home TBD</option>
                    {data.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                  </select>
                  <Input name="homeScore" type="number" min={0} max={30} defaultValue={match.homeScore ?? ""} required className="bg-black/20 text-center font-black" />
                  <Input name="awayScore" type="number" min={0} max={30} defaultValue={match.awayScore ?? ""} required className="bg-black/20 text-center font-black" />
                  <select name="awayTeamId" defaultValue={match.awayTeamId ?? ""} className="h-9 bg-[#0b1a28] px-3 text-sm font-bold outline-none">
                    <option value="">Away TBD</option>
                    {data.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                  </select>
                  <select name="winnerTeamId" defaultValue={match.winnerTeamId ?? ""} className="h-9 bg-[#0b1a28] px-3 text-sm outline-none">
                    <option value="">Winner from score</option>
                    {match.homeTeamId ? <option value={match.homeTeamId}>{teamName.get(match.homeTeamId)}</option> : null}
                    {match.awayTeamId ? <option value={match.awayTeamId}>{teamName.get(match.awayTeamId)}</option> : null}
                  </select>
                  <Button className="bg-cyan-300 font-black text-slate-950 hover:bg-cyan-200">Save result</Button>
                </Card>
              </fieldset>
            </form>
          );
        })}
      </div>
    </>
  );
}
