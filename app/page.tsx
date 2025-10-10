"use client";
import { useEffect, useState } from "react";
type Note = { id: string; text: string };

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");

  async function fetchNotes() {
    const res = await fetch("/api/notes", { cache: "no-store" });
    setNotes(await res.json());
  }
  useEffect(() => { fetchNotes(); }, []);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    setText(""); fetchNotes();
  }
  async function delNote(id: string) {
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    fetchNotes();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Notes</h1>
        <form onSubmit={addNote} className="flex gap-2 mb-6">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Write a quick note…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="bg-black text-white rounded px-4 py-2">Add</button>
        </form>
        <ul className="space-y-2">
          {notes.map(n => (
            <li key={n.id} className="flex items-center justify-between bg-white border rounded px-3 py-2">
              <span>{n.text}</span>
              <button onClick={() => delNote(n.id)} className="text-sm underline">delete</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
