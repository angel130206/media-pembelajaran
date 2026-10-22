import React from "react";
import KasirWarung from "./KasirWarung";
import UntungRugi from "./UntungRugi";
import TebakIstilah from "./TebakIstilah";

export type GameProps = { onFinish: (score:number)=>void };

export const gameRegistry = [
  {
    id: "kasir-warung",
    judul: "Kasir Warung",
    deskripsi: "Layani pelanggan, hitung kembalian & jaga stok!",
    kesulitan: "Mudah" as const,
    komponen: KasirWarung,
    icon: "🧾",
  },
  {
    id: "untung-rugi",
    judul: "Untung atau Rugi",
    deskripsi: "Tentukan harga jual dari modal agar untung!",
    kesulitan: "Sedang" as const,
    komponen: UntungRugi,
    icon: "💰",
  },
  {
    id: "tebak-istilah",
    judul: "Tebak Istilah",
    deskripsi: "Cocokkan istilah wirausaha dengan artinya",
    kesulitan: "Mudah" as const,
    komponen: TebakIstilah,
    icon: "🧩",
  },
];
