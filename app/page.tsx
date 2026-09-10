"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [progress, setProgress] = useState(0);
  const latestRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [songs, search, loading]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter((song) => song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q) || song.lyrics.toLowerCase().includes(q));
  }, [songs, search]);

  const scrollToLatest = () => latestRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="home-page">
      <div className="scroll-progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="anime-orbit orbit-one" /><div className="anime-orbit orbit-two" />
      <div className="speed-lines" aria-hidden="true"><i /><i /><i /><i /><i /></div>

      <nav className="nav nav-anime">
        <Link href="/" className="brand"><b>ANKUSH</b><span>MUSIC3</span></Link>
        <div className="nav-actions"><a href="#latest">Explore</a><Link href="/admin">Admin</Link></div>
      </nav>

      <section className="hero hero-anime">
        <div className="hero-stamp">AM3 / 001</div>
        <p className="eyebrow glitch-label">OFFICIAL LYRICS ARCHIVE</p>
        <h1>Words behind<br /><span>the music.</span></h1>
        <p className="hero-copy">Lyrics, releases and the stories behind the sound of <strong>ANKUSHMUSIC3</strong>.</p>
        <div className="search-wrap anime-search">
          <span className="search-icon">⌕</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search songs, lyrics or artist..." aria-label="Search songs or lyrics" />
          <kbd>⌘ K</kbd>
        </div>
        <div className="hero-tags"><span>LYRICS</span><span>ANKUSH X</span><span>ORIGINALS</span></div>
      </section>

      <button className="scroll-cue" onClick={scrollToLatest} aria-label="Scroll to latest lyrics">
        <span className="cue-text">SCROLL</span>
        <span className="cue-arrow">⌄</span><span className="cue-arrow second">⌄</span>
      </button>

      <section className="section latest-section" id="latest" ref={latestRef} data-reveal>
        <div className="section-head section-head-anime">
          <div><p className="eyebrow">01 / LATEST DROP</p><h2>Latest Lyrics<span>.</span></h2></div>
          <span className="count">{filtered.length.toString().padStart(2, "0")} tracks</span>
        </div>

        {loading ? <div className="empty">Loading lyrics...</div> : filtered.length === 0 ? <div className="empty">No published songs found.</div> : (
          <div className="song-grid anime-grid">
            {filtered.map((song, index) => (
              <Link href={`/lyrics/${song.slug}`} className="song-card anime-card" key={song.id} data-reveal style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}>
                <div className="card-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="cover" style={song.cover_url ? { backgroundImage: `url(${song.cover_url})` } : undefined}>
                  {!song.cover_url && <span>AM3</span>}
                  <div className="cover-scan" />
                </div>
                <div className="song-info">
                  <p>{song.artist}</p><h3>{song.title}</h3>
                  <span className="read-link">Enter lyrics <b>↗</b></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="manifesto" data-reveal>
        <div><p className="eyebrow">02 / THE ARCHIVE</p><h2>Every line has<br /><span>a story.</span></h2></div>
        <p>Built for the words that deserve more than a caption. Search it. Read it. Feel it. This is the official ANKUSHMUSIC3 archive.</p>
      </section>

      <footer><p>© {new Date().getFullYear()} ANKUSHMUSIC3. All rights reserved.</p><p>Lyrics and original content are protected by applicable copyright laws.</p></footer>
    </main>
  );
}
