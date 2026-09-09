import Link from "next/link";

export default function AdminPage() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">ANKUSH<span>MUSIC3</span></Link>
        <nav><Link href="/">View Website</Link></nav>
      </header>
      <section className="admin-page">
        <div className="eyebrow">CREATOR DASHBOARD</div>
        <h1>Manage your lyrics.</h1>
        <p className="muted">This starter dashboard is ready for Supabase authentication and publishing. Connect Supabase using the included setup guide before using it as a production admin panel.</p>
        <div className="admin-grid">
          <div className="admin-card"><span className="icon">＋</span><h2>Add New Song</h2><p>Title, lyrics, cover, YouTube and Spotify links.</p><button>Coming next</button></div>
          <div className="admin-card"><span className="icon">⌘</span><h2>Manage Songs</h2><p>Edit, publish or remove your lyrics.</p><button>Coming next</button></div>
        </div>
        <div className="setup-note"><strong>Production setup</strong><br />Use <code>supabase/schema.sql</code> and <code>SUPABASE_SETUP.md</code> in this project to enable the secure admin/database layer.</div>
      </section>
    </main>
  );
}