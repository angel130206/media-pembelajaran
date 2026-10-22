"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";

export default function TiptapEditor({ content, onChange }: { content:string, onChange:(html:string)=>void }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, LinkExt, Placeholder.configure({ placeholder:"Tulis isi materi..." })],
    content: content || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const [uploading, setUploading] = useState(false);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method:"POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url && editor) editor.chain().focus().setImage({ src: data.url }).run();
  }

  if (!editor) return null;
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-zinc-50 border-b">
        <button type="button" onClick={()=> editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive("bold")?"bg-brand-500 text-white":"bg-white border"}`}>B</button>
        <button type="button" onClick={()=> editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 rounded text-sm bg-white border">• List</button>
        <button type="button" onClick={()=> editor.chain().focus().toggleBlockquote().run()} className="px-2 py-1 rounded text-sm bg-white border">Quote</button>
        <label className="px-2 py-1 rounded text-sm bg-white border cursor-pointer">{uploading?"Upload...":"🖼 Gambar"}<input type="file" accept="image/*" className="hidden" onChange={handleImage} /></label>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[250px]" />
    </div>
  );
}
