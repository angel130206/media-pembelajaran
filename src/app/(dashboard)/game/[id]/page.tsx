import { gameRegistry } from "@/components/games/registry";
import { notFound } from "next/navigation";
import GamePlayer from "./player";

export default function GamePage({ params }: { params:{ id:string }}) {
  const g = gameRegistry.find(x=> x.id===params.id);
  if (!g) return notFound();
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold">{g.icon} {g.judul}</h1>
      <p className="text-sm text-zinc-500">{g.deskripsi} • {g.kesulitan}</p>
      <div className="mt-6">
        <GamePlayer gameId={g.id} />
      </div>
    </div>
  );
}
