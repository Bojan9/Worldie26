import { recalculateAllPoints, resetCompetition } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  return (
    <>
      <h2 className="text-3xl font-black">Maintenance</h2>
      <p className="mt-1 text-sm text-slate-400">Recovery controls for scoring and competition data.</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="bg-cyan-300/[0.07] p-6 text-white">
          <h3 className="text-xl font-black text-cyan-300">Recalculate points</h3>
          <p className="mt-2 text-sm text-slate-400">Rescore completed matches, finalized groups, and the champion prediction.</p>
          <form action={recalculateAllPoints} className="mt-5">
            <Button className="bg-cyan-300 font-black text-slate-950 hover:bg-cyan-200">Recalculate all points</Button>
          </form>
        </Card>
        <Card className="bg-red-400/[0.07] p-6 text-white">
          <h3 className="text-xl font-black text-red-300">Reset competition</h3>
          <p className="mt-2 text-sm text-slate-400">
            Deletes every match and tournament prediction, clears all results and standings, and resets knockout participants. Users, teams, and fixture dates are preserved.
          </p>
          <form action={resetCompetition} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input name="confirmation" placeholder='Type "RESET"' required className="bg-black/20" />
            <Button variant="destructive" className="font-black">Reset everything</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
