import { format } from "date-fns";
import { mk } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminData } from "@/lib/admin-data";

export default async function AdminPredictionsPage() {
  const data = await getAdminData();
  const teamName = new Map(data.teams.map((team) => [team.id, team.name]));
  const playerName = new Map(data.players.map((player) => [player.id, player.name]));
  return (
    <>
      <h2 className="text-3xl font-black">Предвидувања</h2>
      <section className="mt-6">
        <h3 className="text-xl font-black">Предвидувања за натпревари</h3>
        <Card className="mt-3 gap-0 overflow-hidden bg-white/4.5 py-0 text-white">
          <div className="max-h-130 overflow-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="sticky top-0 bg-[#0d1b29] text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="p-3">Играч</th><th>Натпревар</th><th>Предвидување</th><th>Поени</th><th>Испратено</th></tr></thead>
              <tbody>{data.matchPredictions.map((prediction) => <tr key={`${prediction.userId}-${prediction.matchId}`} className="border-t border-white/5"><td className="p-3 font-bold">{prediction.userName}</td><td>M{prediction.matchId}</td><td className="font-mono">{prediction.homeScore}:{prediction.awayScore}</td><td className="font-black text-lime-300">{prediction.points}</td><td className="text-slate-500">{format(prediction.submittedAt, "d MMM, HH:mm", { locale: mk })}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      </section>
      <section className="mt-10 pb-12">
        <h3 className="text-xl font-black">Турнирски предвидувања</h3>
        <div className="mt-3 grid gap-3">
          {data.tournamentPredictions.map((prediction) => (
            <Card key={prediction.userId} className="bg-white/4.5 p-5 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-black">{prediction.userName}</p><p className="text-xs text-slate-500">{format(prediction.submittedAt, "d MMM yyyy, HH:mm", { locale: mk })}</p></div>
                <Badge className="bg-lime-300/10 text-lime-300">{prediction.points} поени</Badge>
              </div>
              <div className="mt-4 grid gap-3 text-xs text-slate-400 md:grid-cols-3">
                <div className="bg-black/20 p-3"><b className="text-white">Шампион:</b> {teamName.get(prediction.bracket["104"]) ?? prediction.bracket["104"]}</div>
                <div className="bg-black/20 p-3"><b className="text-white">Групи на третопласирани:</b> {prediction.thirdPlaceGroups.join(", ")}</div>
                <div className="bg-black/20 p-3"><b className="text-white">Избори во нокаут-фазата:</b> {Object.keys(prediction.bracket).length}</div>
              </div>
              <details className="mt-3 bg-black/15 p-3"><summary className="cursor-pointer text-xs font-black uppercase tracking-wider text-cyan-300">Прикажи ги сите зачувани податоци</summary><pre className="mt-3 overflow-auto text-[10px] text-slate-400">{JSON.stringify({ groups: prediction.groupRankings, bracket: prediction.bracket }, null, 2)}</pre></details>
            </Card>
          ))}
        </div>
      </section>
      <section className="mt-10 pb-12">
        <h3 className="text-xl font-black">Предвидувања за награди</h3>
        <Card className="mt-3 gap-0 overflow-hidden rounded-none bg-white/4.5 py-0 text-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-220 text-left text-sm">
              <thead className="bg-black/20 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3">Играч</th>
                  <th>Златна копачка</th>
                  <th>Златна ракавица</th>
                  <th>Златна топка</th>
                  <th>Млад играч</th>
                  <th>Поени</th>
                </tr>
              </thead>
              <tbody>
                {data.awardPredictions.map((prediction) => (
                  <tr key={prediction.userId} className="border-t border-white/5">
                    <td className="p-3 font-bold">{prediction.userName}</td>
                    <td>{playerName.get(prediction.goldenBootPlayerId)}</td>
                    <td>{playerName.get(prediction.goldenGlovePlayerId)}</td>
                    <td>{playerName.get(prediction.goldenBallPlayerId)}</td>
                    <td>{playerName.get(prediction.youngPlayerId)}</td>
                    <td className="font-black text-lime-300">{prediction.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </>
  );
}
