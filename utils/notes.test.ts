import { describe, it, expect } from 'vitest';
import { filterNotes, Note } from './notes';

const sampleNotes: Note[] = [
  { id: '1', text: 'Hello World' },
  { id: '2', text: 'Vitest is awesome' },
  { id: '3', text: 'Another note about hello' },
  { id: '4', text: 'Case-Sensitive Test' },
];

describe('filterNotes', () => {
  it('should return all notes if query is empty', () => {
    expect(filterNotes(sampleNotes, '')).toHaveLength(4);
  });

  it('should filter notes by a simple query', () => {
    const result = filterNotes(sampleNotes, 'hello');
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('Hello World');
    expect(result[1].text).toBe('Another note about hello');
  });

  it('should be case-insensitive', () => {
    const result = filterNotes(sampleNotes, 'HELLO');
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('Hello World');
    expect(result[1].text).toBe('Another note about hello');
  });

  it('should return an empty array if no notes match', () => {
    const result = filterNotes(sampleNotes, 'nonexistent');
    expect(result).toHaveLength(0);
  });

  it('should handle partial matches', () => {
    const result = filterNotes(sampleNotes, 'awe');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Vitest is awesome');
  });
});
