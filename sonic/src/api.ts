import { Track } from './types';

const BASE = '/api';

async function apiFetch<T>(path: string): Promise<T> {
  const resp = await fetch(`${BASE}${path}`);
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  return resp.json();
}

export async function fetchTrending(): Promise<Track[]> {
  return apiFetch('/trending');
}

export async function searchTracks(query: string, limit = 20): Promise<Track[]> {
  if (!query.trim()) return [];
  return apiFetch(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

export async function fetchByGenre(genre: string): Promise<Track[]> {
  return apiFetch(`/genre/${encodeURIComponent(genre)}`);
}

export async function fetchRecommendations(): Promise<Track[]> {
  return apiFetch('/recommendations');
}

export async function fetchLyrics(artist: string, title: string): Promise<string> {
  if (!artist || !title) return '';
  try {
    const resp = await fetch(`/api/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
    if (!resp.ok) return '';
    const data = await resp.json();
    return data.lyrics || '';
  } catch { return ''; }
}

export async function preloadTrack(query: string, durationSecs: number): Promise<void> {
  try {
    await fetch(`/api/preload?q=${encodeURIComponent(query)}&duration=${durationSecs}`);
  } catch { /* ignore - this is a best-effort pre-fetch */ }
}
