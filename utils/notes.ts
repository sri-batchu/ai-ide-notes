export type Note = { id: string; text: string };

export function filterNotes(notes: Note[], query: string): Note[] {
  return notes.filter(n =>
    n.text.toLowerCase().includes(query.toLowerCase())
  );
}
