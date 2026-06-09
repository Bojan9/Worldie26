import { Award } from "lucide-react";
import { updateOfficialAwards } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminData } from "@/lib/admin-data";

const fields = [
  {
    name: "goldenBootPlayerId",
    label: "Златна копачка",
    filter: () => true,
  },
  {
    name: "goldenGlovePlayerId",
    label: "Златна ракавица",
    filter: (player: { position: string }) => player.position === "Goalkeeper",
  },
  {
    name: "goldenBallPlayerId",
    label: "Златна топка",
    filter: () => true,
  },
  {
    name: "youngPlayerId",
    label: "Најдобар млад играч",
    filter: (player: { dateOfBirth: Date | null }) =>
      Boolean(
        player.dateOfBirth &&
          player.dateOfBirth > new Date("2005-06-11T00:00:00Z"),
      ),
  },
] as const;

export default async function AdminAwardsPage() {
  const data = await getAdminData();
  const byTeam = new Map<string, typeof data.players>();
  for (const player of data.players) {
    const current = byTeam.get(player.teamName) ?? [];
    current.push(player);
    byTeam.set(player.teamName, current);
  }

  return (
    <>
      <div>
        <h2 className="text-3xl font-black">Официјални награди</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          По објавувањето на официјалните добитници, избери ги играчите и зачувај.
          Сите предвидувања автоматски ќе се проверат и ќе добијат по 10 поени за
          секој точен избор.
        </p>
      </div>

      <Card className="mt-6 rounded-none border-white/10 bg-white/4.5 p-6 text-white">
        <div className="flex items-center gap-3">
          <Award className="size-6 text-amber-300" />
          <div>
            <h3 className="text-xl font-black">Добитници</h3>
            <p className="text-xs text-slate-500">
              {data.players.length} синхронизирани играчи
            </p>
          </div>
        </div>

        <form action={updateOfficialAwards} className="mt-6 grid gap-5">
          {fields.map((field) => {
            const currentValue = data.officialAwards?.[field.name] ?? "";
            return (
              <label key={field.name} className="grid gap-2">
                <span className="text-sm font-black">{field.label}</span>
                <select
                  name={field.name}
                  defaultValue={currentValue}
                  required
                  className="h-11 border border-white/10 bg-[#0b1825] px-3 text-sm text-white outline-none"
                >
                  <option value="">Избери играч</option>
                  {[...byTeam.entries()].map(([teamName, teamPlayers]) => {
                    const eligible = teamPlayers.filter(field.filter);
                    if (eligible.length === 0) return null;
                    return (
                      <optgroup key={teamName} label={teamName}>
                        {eligible.map((player) => (
                          <option key={player.id} value={player.id}>
                            {player.name} · {player.position}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </label>
            );
          })}
          <Button className="mt-2 h-11 w-fit rounded-none bg-lime-300 px-6 font-black text-slate-950 hover:bg-lime-200">
            Зачувај и пресметај поени
          </Button>
        </form>
      </Card>
    </>
  );
}
