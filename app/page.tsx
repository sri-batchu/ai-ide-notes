"use client";
import { useEffect, useState } from "react";
import { filterNotes, Note } from "../utils/notes";


type EditState = { id: string | null; text: string };

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState<EditState>({ id: null, text: "" });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  function startEdit(note: Note) {
    setEditing({ id: note.id, text: note.text });
    setError("");
  }

  function cancelEdit() {
    setEditing({ id: null, text: "" });
    setError("");
  }

  async function saveEdit() {
    if (!editing.id || !editing.text.trim()) return;
    if (editing.text.length > 140) {
      setError("Note too long (max 140 characters)");
      return;
    }
    try {
      const res = await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, text: editing.text })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }
      setEditing({ id: null, text: "" });
      setError("");
      fetchNotes();
    } catch {
      setError("Failed to save note");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  }

  const filteredNotes = filterNotes(notes, searchQuery);

  return (
    <main className="min-h-screen bg-blue-200 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-black">Notes</h1>
        <form onSubmit={addNote} className="flex gap-2 mb-6">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Write a quick note…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="bg-black text-white rounded px-4 py-2">Add</button>
        </form>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Notes</h2>
          <div className="text-sm text-gray-600">
            {filteredNotes.length} result{filteredNotes.length === 1 ? "" : "s"}
          </div>
        </div>
        <input
          type="search"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <ul className="space-y-2">
          {filteredNotes.map(n => (
            <li key={n.id} className="flex items-center justify-between bg-yellow-100 border rounded px-3 py-2">
              {editing.id === n.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    value={editing.text}
                    onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                    onKeyDown={handleKeyDown}
                    maxLength={140}
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="text-sm bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-sm bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-black">{n.text}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(n)}
                      className="text-sm underline text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => delNote(n.id)}
                      className="text-sm underline text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
