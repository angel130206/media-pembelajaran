import { gameRegistry } from "@/components/games/registry";
import Link from "next/link";

export default function GameListPage({ searchParams }: { searchParams: { materi?:string }}) {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold">Game Wirausaha</h1>
      <p className="text-sm text-zinc-500">Belajar sambil main, kumpulkan poin!</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {gameRegistry.map(g=> (
          <Link key={g.id} href={`/game/${g.id}`} className="card hover:shadow-lg transition">
            <div className="text-3xl">{g.icon}</div>
            <h3 className="font-bold mt-2">{g.judul}</h3>
            <p className="text-sm text-zinc-500">{g.deskripsi}</p>
            <span className={`inline-block mt-3 text-xs px-2 py-1 rounded-full ${g.kesulitan==="Mudah"?"bg-green-100 text-green-700":"bg-amber-100 text-amber-700"}`}>{g.kesulitan}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
