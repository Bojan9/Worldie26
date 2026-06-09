import { recalculateAllPoints, resetCompetition } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  return (
    <>
      <h2 className="text-3xl font-black">Одржување</h2>
      <p className="mt-1 text-sm text-slate-400">Контроли за обновување на бодувањето и натпреварувачките податоци.</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="bg-cyan-300/[0.07] p-6 text-white">
          <h3 className="text-xl font-black text-cyan-300">Повторно пресметај ги поените</h3>
          <p className="mt-2 text-sm text-slate-400">Повторно бодувај ги завршените натпревари, конечните групи и предвидувањето за шампион.</p>
          <form action={recalculateAllPoints} className="mt-5">
            <Button className="bg-cyan-300 font-black text-slate-950 hover:bg-cyan-200">Пресметај ги сите поени повторно</Button>
          </form>
        </Card>
        <Card className="bg-red-400/[0.07] p-6 text-white">
          <h3 className="text-xl font-black text-red-300">Ресетирај го натпреварувањето</h3>
          <p className="mt-2 text-sm text-slate-400">
            Ги брише сите предвидувања, резултати и табели и ги ресетира учесниците во нокаут-фазата. Корисниците, тимовите и термините се зачувуваат.
          </p>
          <form action={resetCompetition} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input name="confirmation" placeholder='Напиши „RESET“' required className="bg-black/20" />
            <Button variant="destructive" className="font-black">Ресетирај сè</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
