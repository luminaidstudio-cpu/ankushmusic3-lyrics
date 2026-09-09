"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Song = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  lyrics: string;
  youtube_url: string | null;
  spotify_url: string | null;
  cover_url: string | null;
  release_date: string | null;
  published: boolean;
};

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSongs() {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("published", true)
        .order("release_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) setSongs(data as Song[]);
      setLoading(false);
    }
    loadSongs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.lyrics.toLowerCase().includes(q)
    );
  }, [songs, search]);

  return (
    <main>
      <nav className="nav">
        <Link href="/" className="brand">ANKUSH<span>MUSIC3</span></Link>
        <Link href="/admin" className="admin-link">Admin</Link>
      </nav>

      <section className="hero">
        <p className="eyebrow">OFFICIAL LYRICS ARCHIVE</p>
        <h1>Words behind<br /><span>the music.</span></h1>
        <p className="hero-copy">Official lyrics, releases and links from ANKUSHMUSIC3.</p>
        <div className="search-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs or lyrics..."
            aria-label="Search songs or lyrics"
          />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">LATEST</p>
            <h2>Latest Lyrics</h2>
          </div>
          <span className="count">{filtered.length} songs</span>
        </div>

        {loading ? (
          <div className="empty">Loading lyrics...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No published songs found.</div>
        ) : (
          <div className="song-grid">
            {filtered.map((song) => (
              <Link href={`/lyrics/${song.slug}`} className="song-card" key={song.id}>
                <div
                  className="cover"
                  style={song.cover_url ? { backgroundImage: `url(${song.cover_url})` } : undefined}
                >
                  {!song.cover_url && <span>AM3</span>}
                </div>
                <div className="song-info">
                  <p>{song.artist}</p>
                  <h3>{song.title}</h3>
                  <span>Read lyrics →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer>
        <p>© {new Date().getFullYear()} ANKUSHMUSIC3. All rights reserved.</p>
        <p>Lyrics and original content are protected by applicable copyright laws.</p>
      </footer>
    </main>
  );
}