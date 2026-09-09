"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

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

const blankSong = {
  slug: "",
  title: "",
  artist: "Ankush X",
  lyrics: "",
  youtube_url: "",
  spotify_url: "",
  cover_url: "",
  release_date: "",
  published: false
};

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [form, setForm] = useState(blankSong);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => setSession(current));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadSongs();
  }, [session]);

  async function loadSongs() {
    const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false });
    if (error) setMessage(error.message);
    else setSongs((data ?? []) as Song[]);
  }

  async function login(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMessage(error.message);
  }

  async function logout() {
    await supabase.auth.signOut();
    setSongs([]);
  }

  function startEdit(song: Song) {
    setEditingId(song.id);
    setCoverFile(null);
    setForm({
      slug: song.slug,
      title: song.title,
      artist: song.artist,
      lyrics: song.lyrics,
      youtube_url: song.youtube_url ?? "",
      spotify_url: song.spotify_url ?? "",
      cover_url: song.cover_url ?? "",
      release_date: song.release_date ?? "",
      published: song.published
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setCoverFile(null);
    setForm(blankSong);
  }

  async function saveSong(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    let coverUrl = form.cover_url.trim() || null;

    if (coverFile) {
      if (!coverFile.type.startsWith("image/")) {
        setBusy(false);
        setMessage("Please select an image file.");
        return;
      }

      if (coverFile.size > 5 * 1024 * 1024) {
        setBusy(false);
        setMessage("Cover image must be 5 MB or smaller.");
        return;
      }

      const safeName = coverFile.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
      const path = `${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("covers")
        .upload(path, coverFile, {
          upsert: false,
          contentType: coverFile.type
        });

      if (uploadError) {
        setBusy(false);
        setMessage(`Cover upload failed: ${uploadError.message}`);
        return;
      }

      const { data: publicData } = supabase.storage.from("covers").getPublicUrl(path);
      coverUrl = publicData.publicUrl;
    }

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      artist: form.artist.trim() || "Ankush X",
      lyrics: form.lyrics,
      youtube_url: form.youtube_url.trim() || null,
      spotify_url: form.spotify_url.trim() || null,
      cover_url: coverUrl,
      release_date: form.release_date || null,
      published: form.published
    };

    const result = editingId
      ? await supabase.from("songs").update(payload).eq("id", editingId)
      : await supabase.from("songs").insert(payload);

    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setMessage(editingId ? "Song updated." : "Song added.");
    resetForm();
    loadSongs();
  }

  async function removeSong(id: string) {
    if (!confirm("Delete this song permanently?")) return;
    const { error } = await supabase.from("songs").delete().eq("id", id);
    if (error) setMessage(error.message);
    else {
      setMessage("Song deleted.");
      loadSongs();
    }
  }

  async function togglePublish(song: Song) {
    const { error } = await supabase.from("songs").update({ published: !song.published }).eq("id", song.id);
    if (error) setMessage(error.message);
    else loadSongs();
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <nav className="nav">
          <Link href="/" className="brand">ANKUSH<span>MUSIC3</span></Link>
        </nav>
        <section className="login-card">
          <p className="eyebrow">PRIVATE AREA</p>
          <h1>Admin Login</h1>
          <p>Sign in to manage your official lyrics.</p>
          <form onSubmit={login}>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
            <button className="btn primary" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
          </form>
          {message && <div className="notice">{message}</div>}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <nav className="nav">
        <Link href="/" className="brand">ANKUSH<span>MUSIC3</span></Link>
        <button className="admin-link plain" onClick={logout}>Logout</button>
      </nav>

      <section className="admin-content">
        <div className="section-head">
          <div>
            <p className="eyebrow">CONTROL ROOM</p>
            <h1>Manage your lyrics.</h1>
          </div>
          <button className="btn" onClick={resetForm}>+ New Song</button>
        </div>

        <form className="song-form" onSubmit={saveSong}>
          <h2>{editingId ? "Edit song" : "Add new song"}</h2>
          <div className="form-grid">
            <label>Song title<input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required /></label>
            <label>Slug<input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-")})} required /></label>
            <label>Artist<input value={form.artist} onChange={(e) => setForm({...form, artist: e.target.value})} /></label>
            <label>Release date<input type="date" value={form.release_date} onChange={(e) => setForm({...form, release_date: e.target.value})} /></label>
          </div>
          <label>Lyrics<textarea value={form.lyrics} onChange={(e) => setForm({...form, lyrics: e.target.value})} required rows={14} /></label>
          <div className="form-grid">
            <label>YouTube URL<input value={form.youtube_url} onChange={(e) => setForm({...form, youtube_url: e.target.value})} placeholder="https://youtube.com/..." /></label>
            <label>Spotify URL<input value={form.spotify_url} onChange={(e) => setForm({...form, spotify_url: e.target.value})} placeholder="https://open.spotify.com/..." /></label>
            <label>
              Cover image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
              <span className="field-hint">Upload JPG, PNG, WEBP or another image (max 5 MB).</span>
            </label>
            <label>
              Cover image URL
              <input value={form.cover_url} onChange={(e) => setForm({...form, cover_url: e.target.value})} placeholder="Optional — upload above or paste a URL" />
            </label>
          </div>
          <label className="check"><input type="checkbox" checked={form.published} onChange={(e) => setForm({...form, published: e.target.checked})} /> Publish on website</label>
          <div className="button-row">
            <button className="btn primary" disabled={busy}>{busy ? "Saving..." : editingId ? "Update Song" : "Add Song"}</button>
            {editingId && <button type="button" className="btn" onClick={resetForm}>Cancel</button>}
          </div>
          {message && <div className="notice">{message}</div>}
        </form>

        <div className="admin-list">
          <div className="section-head"><h2>All songs</h2><span className="count">{songs.length}</span></div>
          {songs.map((song) => (
            <div className="admin-song" key={song.id}>
              <div>
                <p className="eyebrow">{song.artist}</p>
                <h3>{song.title}</h3>
                <span className={song.published ? "status live" : "status"}>{song.published ? "Published" : "Draft"}</span>
              </div>
              <div className="button-row">
                <button className="btn" onClick={() => togglePublish(song)}>{song.published ? "Unpublish" : "Publish"}</button>
                <button className="btn" onClick={() => startEdit(song)}>Edit</button>
                <button className="btn danger" onClick={() => removeSong(song.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}