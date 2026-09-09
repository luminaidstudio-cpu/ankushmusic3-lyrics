import Link from "next/link";
import { notFound } from "next/navigation";
import songs from "../../../data/songs.json";

function youtubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v") || "";
  } catch { return ""; }
}

export default async function LyricsPage({ params }: { params: { slug: string } }) {
  const song = songs.find(s => s.slug === params.slug);
  if (!song) notFound();
  const yt = youtubeId(song.youtube);
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">ANKUSH<span>MUSIC3</span></Link>
        <nav><Link href="/">All Lyrics</Link><Link href="/admin">Admin</Link></nav>
      </header>

      <article className="lyrics-page">
        <Link className="back" href="/">← Back to lyrics</Link>
        <div className="lyrics-hero">
          <div className="cover large"><span>{song.title.slice(0,1)}</span></div>
          <div><div className="eyebrow">OFFICIAL LYRICS</div><h1>{song.title}</h1><p className="sub">{song.artist} · {song.year}</p></div>
        </div>

        <div className="media-row">
          {yt ? <div className="video-wrap"><iframe src={`https://www.youtube.com/embed/${yt}`} title={`${song.title} on YouTube`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div> : null}
          <div className="listen-box">
            <div className="eyebrow">LISTEN / WATCH</div>
            <a className="btn red" href={song.youtube} target="_blank" rel="noreferrer">▶ YouTube</a>
            <a className="btn" href={song.spotify} target="_blank" rel="noreferrer">♫ Spotify</a>
          </div>
        </div>

        <div className="lyrics-wrap">
          <div className="eyebrow">LYRICS</div>
          <div className="lyrics">{song.lyrics.split("\n").map((line, i) => <p key={i}>{line || "\u00A0"}</p>)}</div>
        </div>

        <div className="copyright">
          <strong>© {song.year} ANKUSHMUSIC3 / Ankush X</strong>
          <p>Lyrics written by Ankush X. All Rights Reserved. Unauthorized reproduction, redistribution or commercial use of these lyrics is prohibited without permission.</p>
        </div>
      </article>
    </main>
  );
}