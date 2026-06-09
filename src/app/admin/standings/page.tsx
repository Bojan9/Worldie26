import { updateGroupStandings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminData } from "@/lib/admin-data";
import { groups } from "@/lib/tournament";

export default async function AdminStandingsPage() {
  const data = await getAdminData();
  const standingByGroup = new Map(data.standings.map((standing) => [standing.group, standing]));

  return (
    <>
      <h2 className="text-3xl font-black">Табели по групи</h2>
      <p className="mt-1 text-sm text-slate-400">
        Табелите автоматски се ажурираат од зачуваните резултати. Рачното подредување останува достапно како резерва.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const groupTeams = data.teams.filter((team) => team.group === group.id);
          const ranking = standingByGroup.get(group.id)?.rankings ?? groupTeams.map((team) => team.id);
          return (
            <form key={group.id} action={updateGroupStandings}>
              <Card className="gap-0 bg-white/4.5 p-5 text-white">
                <input type="hidden" name="group" value={group.id} />
                <div className="flex items-center justify-between">
                  <h3 className="font-black">Група {group.id}</h3>
                  <span className="text-xs text-slate-500">{standingByGroup.has(group.id) ? "Пресметано" : "Нема резултати"}</span>
                </div>
                <div className="mt-4 grid gap-2">
                  {[1, 2, 3, 4].map((position) => (
                    <label key={position} className="grid grid-cols-[28px_1fr] items-center gap-2">
                      <span className="text-center text-xs font-black text-slate-500">{position}</span>
                      <select name={`position${position}`} defaultValue={ranking[position - 1]} className="h-9 bg-[#0b1a28] px-3 text-sm font-bold outline-none">
                        {groupTeams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                      </select>
                    </label>
                  ))}
                </div>
                <Button className="mt-4 w-full bg-lime-300 font-black text-slate-950 hover:bg-lime-200">Зачувај резервен редослед</Button>
              </Card>
            </form>
          );
        })}
      </div>
    </>
  );
}
