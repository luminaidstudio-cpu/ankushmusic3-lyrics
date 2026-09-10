import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const siteUrl = "https://ankushmusic3-lyrics.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) return urls;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase
    .from("songs")
    .select("slug, updated_at, release_date")
    .eq("published", true);

  for (const song of data ?? []) {
    urls.push({
      url: `${siteUrl}/lyrics/${song.slug}`,
      lastModified: song.updated_at || song.release_date || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return urls;
}
