export const POIN_SELESAI_MATERI = 10;
export const POIN_LATIHAN_PER_SOAL_BENAR = 5;
export const POIN_GAME = 10;

export function hitungLevel(poinTotal: number) {
  if (poinTotal >= 500) return { level: "Juragan", next: null };
  if (poinTotal >= 200) return { level: "Pengusaha", next: 500 };
  if (poinTotal >= 50) return { level: "Perintis", next: 200 };
  return { level: "Pemula", next: 50 };
}

export const LENCANA_RULES = [
  { id: "materi-pertama", nama: "Langkah Pertama", deskripsi: "Selesaikan 1 materi", check: (selesai:number)=> selesai>=1 },
  { id: "rajin-belajar", nama: "Rajin Belajar", deskripsi: "Selesaikan 5 materi", check: (selesai:number)=> selesai>=5 },
  { id: "juara-game", nama: "Juara Game", deskripsi: "Raih skor 80+ di game", check: (skorMax:number)=> skorMax>=80 },
];
