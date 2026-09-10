"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type Song = {
  id: string; slug: string; title: string; artist: string; lyrics: string;
  youtube_url: string | null; spotify_url: string | null; cover_url: string | null;
  release_date: string | null; published: boolean;
};

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const latestRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    async function loadSongs() {
      const { data } = await supabase.from("songs").select("*").eq("published", true)
        .order("release_date", { ascending: false }).order("created_at", { ascending: false });
      if (data) setSongs(data as Song[]);
      setLoading(false);
    }
    loadSongs();
  }, []);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("is-visible")), { threshold: .12 });
    nodes.forEach(n => observer.observe(n));
    return () => observer.disconnect();
  }, [songs, search, loading]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); document.getElementById("song-search")?.focus(); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.lyrics.toLowerCase().includes(q));
  }, [songs, search]);

  const featured = filtered[0] ?? songs[0];
  const scrollToLatest = () => latestRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="home-page am3-home">
      <div className="scroll-progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="ambient ambient-a" /><div className="ambient ambient-b" />
      <div className="anime-orbit orbit-one" /><div className="anime-orbit orbit-two" />
      <div className="speed-lines" aria-hidden="true"><i/><i/><i/><i/><i/></div>

      <nav className="nav nav-anime pro-nav">
        <Link href="/" className="brand"><b>ANKUSH</b><span>MUSIC3</span></Link>
        <div className="nav-center"><a href="#latest">Archive</a><a href="#story">Story</a><a href="#featured">Featured</a></div>
        <div className="nav-actions"><span className="live-dot">ONLINE</span><Link href="/admin">Admin ↗</Link></div>
      </nav>

      <section className="hero hero-anime pro-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-stamp">AM3 / 003<br/><span>EST. 2026</span></div>
        <div className="hero-copy-wrap">
          <p className="eyebrow glitch-label">OFFICIAL LYRICS ARCHIVE / 001</p>
          <h1>Words behind<br/><span>the music.</span></h1>
          <p className="hero-copy">Lyrics, releases and the stories behind the sound of <strong>ANKUSHMUSIC3</strong>.</p>
          <div className="search-wrap anime-search pro-search">
            <span className="search-icon">⌕</span>
            <input id="song-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the archive..." aria-label="Search songs or lyrics" />
            <kbd>⌘ K</kbd>
          </div>
          <div className="hero-tags"><span>LYRICS</span><span>ANKUSH X</span><span>ORIGINALS</span><span>24/7 ARCHIVE</span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-glow" />
          <div className="visual-orbit visual-orbit-a" />
          <div className="visual-orbit visual-orbit-b" />
          <div className="visual-disc">
            <div className="disc-grooves" />
            <div className="disc-label"><small>AM3</small><b>ANKUSH<br/>MUSIC3</b><span>ORIGINAL SOUND</span></div>
          </div>
          <div className="visual-cross" />
          <div className="visual-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          <div className="visual-caption"><span>NOW PLAYING</span><b>WORDS / SOUND / STORIES</b></div>
        </div>
        <div className="hero-side-note"><span>SCROLL TO EXPLORE</span><b>↓</b></div>
      </section>

      <button className="scroll-cue" onClick={scrollToLatest} aria-label="Scroll to latest lyrics">
        <span className="cue-text">EXPLORE</span><span className="cue-arrow">⌄</span><span className="cue-arrow second">⌄</span>
      </button>

      <section className="ticker" aria-label="ANKUSHMUSIC3 archive ticker">
        <div><span>ANKUSHMUSIC3</span><b>✦</b><span>OFFICIAL LYRICS</span><b>✦</b><span>WORDS / SOUND / STORIES</span><b>✦</b><span>ANKUSH X</span><b>✦</b><span>ANKUSHMUSIC3</span><b>✦</b><span>OFFICIAL LYRICS</span></div>
      </section>

      <section className="section featured-section" id="featured" data-reveal>
        <div className="section-kicker"><span>00 / SPOTLIGHT</span><span>{songs.length.toString().padStart(2,"0")} RELEASES</span></div>
        {featured ? <Link href={`/lyrics/${featured.slug}`} className="featured-card">
          <div className="featured-cover" style={featured.cover_url ? { backgroundImage: `url(${featured.cover_url})` } : undefined}>
            {!featured.cover_url && <span>AM3</span>}<div className="cover-noise"/><div className="featured-scan"/>
            <div className="featured-label">FEATURED<br/>TRACK</div>
          </div>
          <div className="featured-content">
            <p className="eyebrow">{featured.artist}</p><h2>{featured.title}<span>.</span></h2>
            <p className="featured-desc">Step into the lyrics, line by line. The official ANKUSHMUSIC3 archive keeps every release in one place.</p>
            <span className="big-enter">OPEN LYRICS <b>↗</b></span>
            <div className="featured-meta"><span>01</span><span>{featured.release_date || "ORIGINAL RELEASE"}</span></div>
          </div>
        </Link> : <div className="empty">No published songs found.</div>}
      </section>

      <section className="section latest-section archive-pro" id="latest" ref={latestRef} data-reveal>
        <div className="archive-topline"><span>01 / LYRICS ARCHIVE</span><span>SEARCH / READ / REPEAT</span></div>
        <div className="section-head section-head-anime pro-section-head">
          <div><p className="eyebrow">LATEST RELEASES</p><h2>Words in motion<span>.</span></h2></div>
          <span className="count">{filtered.length.toString().padStart(2,"0")} TRACKS</span>
        </div>
        <div className="archive-intro"><p>Every release gets its own space. Tap a track to open the official lyrics, links and release details.</p><span>ANKUSHMUSIC3 / OFFICIAL</span></div>
        {loading ? <div className="empty">Loading archive...</div> : filtered.length === 0 ? <div className="empty">No published songs found.</div> : (
          <div className="archive-list">
            {filtered.map((song,index) => <Link href={`/lyrics/${song.slug}`} className="archive-row" key={song.id} data-reveal style={{"--delay":`${index*90}ms`} as React.CSSProperties}>
              <span className="archive-index">{String(index+1).padStart(2,"0")}</span>
              <div className="archive-thumb" style={song.cover_url ? { backgroundImage:`url(${song.cover_url})` } : undefined}>{!song.cover_url && <span>AM3</span>}<i/></div>
              <div className="archive-main"><p>{song.artist}</p><h3>{song.title}</h3></div>
              <div className="archive-date"><span>RELEASE</span><b>{song.release_date || "ORIGINAL"}</b></div>
              <div className="archive-open"><span>OPEN LYRICS</span><b>↗</b></div>
            </Link>)}
          </div>
        )}
      </section>

      <section className="story-section" id="story" data-reveal>
        <div className="story-number">02</div>
        <div className="story-main"><p className="eyebrow">THE ARCHIVE / THE STORY</p><h2>Every line has<br/><span>a story.</span></h2></div>
        <div className="story-copy"><p>Built for the words that deserve more than a caption. Search it. Read it. Feel it.</p><p>ANKUSHMUSIC3 is an evolving home for original music, lyrics and the moments behind every release.</p><Link href="#latest" className="story-link">ENTER THE ARCHIVE <b>↓</b></Link></div>
      </section>

      <section className="stats-section" data-reveal>
        <div><b>{songs.length.toString().padStart(2,"0")}</b><span>RELEASES</span></div>
        <div><b>∞</b><span>LINES OF MUSIC</span></div>
        <div><b>01</b><span>OFFICIAL ARCHIVE</span></div>
      </section>

      <footer className="pro-footer"><div className="footer-brand"><span>AM3</span><strong>ANKUSHMUSIC3</strong></div><p>© {new Date().getFullYear()} ANKUSHMUSIC3. All rights reserved.</p><p>Lyrics and original content are protected by applicable copyright laws.</p></footer>
    </main>
  );
}
