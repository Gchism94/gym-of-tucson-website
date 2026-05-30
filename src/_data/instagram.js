// Behold.so Instagram feed — fetched at build time from BEHOLD_FEED_URL env var.
// Returns up to 5 posts normalized to { thumb, permalink, alt }.
// If the env var is missing or the fetch fails, returns [] and the template
// falls back to the static tiles in index.njk.
// No local image caching — Behold hop.behold.pictures CDN URLs are stable.

const MAX_POSTS = 5;

function captionToAlt(caption) {
  if (!caption) return "Instagram post from @thegymoftucson";
  let text = String(caption)
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 100) return text;
  const cut = text.slice(0, 100);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut) + "…";
}

function pickThumb(post) {
  // Use medium size (560px wide) — good for square grid cells
  if (post.sizes && post.sizes.medium && post.sizes.medium.mediaUrl) {
    return post.sizes.medium.mediaUrl;
  }
  if (post.sizes && post.sizes.small && post.sizes.small.mediaUrl) {
    return post.sizes.small.mediaUrl;
  }
  // Videos: use thumbnailUrl (stable Behold-hosted image, not Instagram CDN)
  if (post.mediaType === "VIDEO" && post.thumbnailUrl) {
    return post.thumbnailUrl;
  }
  return post.mediaUrl;
}

module.exports = async function () {
  const FEED_URL = process.env.BEHOLD_FEED_URL;

  if (!FEED_URL) {
    console.warn("[instagram] BEHOLD_FEED_URL not set — falling back to static tiles.");
    return [];
  }

  try {
    const res = await fetch(FEED_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.warn(`[instagram] Behold fetch failed (${res.status}) — falling back to static tiles.`);
      return [];
    }

    const data = await res.json();
    const posts = Array.isArray(data.posts) ? data.posts : (Array.isArray(data) ? data : []);

    if (posts.length === 0) {
      console.warn("[instagram] No posts in Behold response — falling back to static tiles.");
      return [];
    }

    const normalized = posts.slice(0, MAX_POSTS).map((p) => ({
      id: p.id,
      thumb: pickThumb(p),
      permalink: p.permalink || "https://www.instagram.com/thegymoftucson/",
      alt: captionToAlt(p.caption),
    }));

    console.log(`[instagram] Loaded ${normalized.length} posts from Behold feed.`);
    return normalized;

  } catch (err) {
    console.warn("[instagram] Fetch error — falling back to static tiles:", err && err.message);
    return [];
  }
};
