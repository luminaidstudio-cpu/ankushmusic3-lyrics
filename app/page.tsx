import Link from "next/link";
import songs from "../data/songs.json";

export default function Home() {
  const latest = songs.slice(0, 6);
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">ANKUSH<span>MUSIC3</span></Link>
        <nav><Link href="/">Lyrics</Link><Link href="/admin">Admin</Link></nav>
      </header>

      <section className="hero">
        <div className="eyebrow">OFFICIAL LYRICS ARCHIVE</div>
        <h1>Words behind<br /><span>the music.</span></h1>
        <p>Official lyrics, credits and listening links from ANKUSHMUSIC3.</p>
        <div className="search-shell">⌕ <input placeholder="Search lyrics, songs..." aria-label="Search lyrics" /></div>
      </section>

      <section className="section">
        <div className="section-head"><div><div className="eyebrow">LATEST</div><h2>Latest Lyrics</h2></div><span>{songs.length} songs</span></div>
        <div className="song-grid">
          {latest.map(song => (
            <Link className="song-card" href={`/lyrics/${song.slug}`} key={song.slug}>
              <div className="cover"><span>{song.title.slice(0,1)}</span></div>
              <div className="card-meta"><div><h3>{song.title}</h3><p>{song.artist} · {song.year}</p></div><b>↗</b></div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div><strong>ANKUSHMUSIC3</strong><p>Official lyrics archive by Ankush X.</p></div>
        <p>© 2026 ANKUSHMUSIC3. All Rights Reserved.</p>
      </footer>
    </main>
  );
}