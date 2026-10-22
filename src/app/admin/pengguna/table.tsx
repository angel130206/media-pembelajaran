"use client";
import { useState } from "react";

export default function PenggunaTable({ initial }: { initial:any[] }) {
  const [list, setList] = useState(initial);
  async function updateRole(id:string, role:string) {
    const res = await fetch(`/api/admin/pengguna/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ role }) });
    if (res.ok) setList(l=> l.map(u=> u.id===id? {...u, role}:u));
  }
  async function toggleAktif(id:string, aktif:boolean) {
    const res = await fetch(`/api/admin/pengguna/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ aktif: !aktif }) });
    if (res.ok) setList(l=> l.map(u=> u.id===id? {...u, aktif: !aktif}:u));
  }
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm bg-white rounded-xl overflow-hidden border">
        <thead className="bg-zinc-50"><tr><th className="p-3 text-left">Nama</th><th className="p-3">Email</th><th className="p-3">Peran</th><th className="p-3">Aktif</th><th className="p-3">Aksi</th></tr></thead>
        <tbody>
          {list.map(u=> (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                <select value={u.role} onChange={e=>updateRole(u.id, e.target.value)} className="border rounded-lg px-2 py-1">
                  <option value="siswa">siswa</option><option value="guru">guru</option><option value="admin">admin</option>
                </select>
              </td>
              <td className="p-3 text-center">{u.aktif?"✅":"❌"}</td>
              <td className="p-3"><button onClick={()=>toggleAktif(u.id, u.aktif)} className="text-xs border px-2 py-1 rounded-lg">{u.aktif?"Nonaktifkan":"Aktifkan"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
