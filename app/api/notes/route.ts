import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_PATH = path.join(process.cwd(), "data", "notes.json");
function readNotes(): Array<{id:string;text:string}> {
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, "[]");
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}
function writeNotes(notes: any) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(notes, null, 2));
}
export async function GET() { return NextResponse.json(readNotes()); }
export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text || typeof text !== "string")
    return NextResponse.json({ error: "text required" }, { status: 400 });
  const notes = readNotes();
  notes.unshift({ id: crypto.randomUUID(), text });
  writeNotes(notes);
  return NextResponse.json({ ok: true });
}
export async function PATCH(req: NextRequest) {
  const { id, text } = await req.json();
  if (!id || !text || typeof text !== "string")
    return NextResponse.json({ error: "id and text required" }, { status: 400 });
  if (text.length > 140)
    return NextResponse.json({ error: "text too long (max 140 chars)" }, { status: 400 });
  const notes = readNotes();
  const noteIndex = notes.findIndex(n => n.id === id);
  if (noteIndex === -1)
    return NextResponse.json({ error: "note not found" }, { status: 404 });
  notes[noteIndex].text = text;
  writeNotes(notes);
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const notes = readNotes().filter(n => n.id !== id);
  writeNotes(notes);
  return NextResponse.json({ ok: true });
}
