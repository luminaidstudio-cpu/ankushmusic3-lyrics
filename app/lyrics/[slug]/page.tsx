"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
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

function isSection(line: string) {
  return /^\s*\[[^\]]+\]\s*$/.test(line);
}

export default function LyricsPage() {
  const params = useParams<{ slug: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const lyricsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => { window.removeEventListener("scroll", updateProgress); window.removeEventListener("resize", updateProgress); };
  }, []);

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

  async function shareSong() {
    if (!song) return;
    const shareData = {
      title: `${song.title} — ${song.artist}`,
      text: `Read the lyrics of ${song.title} by ${song.artist} on ANKUSHMUSIC3.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // User cancelled the native share sheet.
    }
  }

  if (loading) return <main><div className="empty page-empty">Loading...</div></main>;
  if (!song) return <main><div className="empty page-empty">Song not found.</div></main>;

  const lines = song.lyrics.split("\n");

  return (
    <main className="lyrics-site">
      <div className="scroll-progress"><span style={{ width: `${progress}%` }} /></div>
      <button className="scroll-cue lyrics-cue" onClick={() => lyricsRef.current?.scrollIntoView({ behavior: "smooth" })} aria-label="Scroll to lyrics"><span className="cue-text">LYRICS</span><span className="cue-arrow">⌄</span><span className="cue-arrow second">⌄</span></button>
      <nav className="nav">
        <Link href="/" className="brand">ANKUSH<span>MUSIC3</span></Link>
        <Link href="/" className="admin-link">‹ Back</Link>
      </nav>

      <article className="lyrics-page page-animate">
        <div className="lyrics-hero hero-animate">
          <div
            className="lyrics-cover"
            style={song.cover_url ? { backgroundImage: `url(${song.cover_url})` } : undefined}
          >
            {!song.cover_url && <span>AM3</span>}
          </div>

          <div className="lyrics-meta">
            <p className="eyebrow">{song.artist}</p>
            <h1>{song.title}</h1>
            {song.release_date && <p className="release">Released {song.release_date}</p>}

            <div className="link-row">
              {song.youtube_url && <a href={song.youtube_url} target="_blank" rel="noreferrer" className="btn primary">▶ Watch</a>}
              {song.spotify_url && <a href={song.spotify_url} target="_blank" rel="noreferrer" className="btn">♫ Spotify</a>}
              <button type="button" onClick={shareSong} className="btn">
                {copied ? "Link copied ✓" : "⤴ Share"}
              </button>
            </div>
          </div>
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

        <div className="lyrics-heading reveal-up">
          <p className="eyebrow">Official Lyrics</p>
          <h2>Words behind the music.</h2>
        </div>

        <div className="lyrics lyrics-reveal" ref={lyricsRef}>
          {lines.map((line, i) => (
            isSection(line)
              ? <div key={i} className="lyric-section">{line.replace(/^\[|\]$/g, "")}</div>
              : <div key={i} style={{"--lyric-index": i} as React.CSSProperties} className={line.trim() ? "lyric-line" : "lyric-gap"}>
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
