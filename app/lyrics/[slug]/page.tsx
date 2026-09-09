"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

function youtubeId(url: string | null) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  return match?.[1] ?? null;
}

export default function LyricsPage() {
  const params = useParams<{ slug: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("songs")
        .select("*")
        .eq("slug", params.slug)
        .eq("published", true)
        .maybeSingle();
      setSong((data as Song | null) ?? null);
      setLoading(false);
    }
    load();
  }, [params.slug]);

  const video = useMemo(() => youtubeId(song?.youtube_url ?? null), [song]);

  if (loading) return <main><div className="empty page-empty">Loading...</div></main>;
  if (!song) return <main><div className="empty page-empty">Song not found.</div></main>;

  return (
    <main>
      <nav className="nav">
        <Link href="/" className="brand">ANKUSH<span>MUSIC3</span></Link>
        <Link href="/" className="admin-link">← Back</Link>
      </nav>

      <article className="lyrics-page">
        <p className="eyebrow">{song.artist}</p>
        <h1>{song.title}</h1>
        {song.release_date && <p className="release">Released {song.release_date}</p>}

        <div className="link-row">
          {song.spotify_url && <a href={song.spotify_url} target="_blank" rel="noreferrer" className="btn">Spotify ↗</a>}
          {song.youtube_url && <a href={song.youtube_url} target="_blank" rel="noreferrer" className="btn">YouTube ↗</a>}
        </div>

        {video && (
          <div className="video">
            <iframe
              src={`https://www.youtube.com/embed/${video}`}
              title={song.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="lyrics">
          {song.lyrics.split("\n").map((line, i) => (
            <div key={i} className={line.trim() ? "lyric-line" : "lyric-gap"}>
              {line || "\u00A0"}
            </div>
          ))}
        </div>
      </article>

      <footer>
        <p>© {new Date().getFullYear()} ANKUSHMUSIC3. All rights reserved.</p>
        <p>Lyrics and original content are protected by applicable copyright laws.</p>
      </footer>
    </main>
  );
}