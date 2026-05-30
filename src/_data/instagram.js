// Behold.so Instagram feed — fetched at BUILD TIME from a URL kept in env var
// BEHOLD_FEED_URL. Returns up to MAX_POSTS posts normalized to { thumb, full,
// permalink, alt }. If the env var is missing or the fetch fails, returns []
// and logs a warning so the build does NOT crash — the template falls back to
// the static tiles already in index.njk.
//
// Local caching: each post's thumbnail is downloaded, run through sharp to a
// square 800×800 cover-crop WebP, and written to images/instagram/ig-<id>.webp.
// post.thumb is then rewritten to the LOCAL path. Per-image resilience: if a
// single download or encode fails, that one post's thumb falls back to the
// remote Behold URL — build never crashes.
//
// Field mapping is based on Behold's public response shape. The fetch logs the
// actual top-level keys + the first post's keys + the sizes keys on every
// successful build so we can re-tune if the real payload differs from the docs.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const FEED_URL = process.env.BEHOLD_FEED_URL;
const MAX_POSTS = 5;
const CACHE_DIR = path.join(__dirname, "..", "..", "images", "instagram");
const CACHE_URL_PREFIX = "/images/instagram";
const THUMB_SIZE = 800; // square cover-crop

/** Trim a caption to ~100 chars on a word boundary, strip control chars,
 *  collapse whitespace, append "…" when truncated. Returns a fallback string
 *  when the caption is empty. */
function captionToAlt(caption) {
  if (!caption) return "Instagram post from @thegymoftucson";
  let text = String(caption)
    .replace(/[ -]/g, " ") // strip control chars (incl newlines)
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 100) return text;
  const cut = text.slice(0, 100);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut) + "…";
}

/** Pick the best thumbnail URL: medium-sized (covers 400px retina) for images,
 *  thumbnailUrl for videos, fall back to the full mediaUrl. */
function pickThumb(post) {
  if (post.sizes) {
    if (post.sizes.medium && post.sizes.medium.mediaUrl) return post.sizes.medium.mediaUrl;
    if (post.sizes.small  && post.sizes.small.mediaUrl)  return post.sizes.small.mediaUrl;
  }
  if (post.mediaType === "VIDEO" && post.thumbnailUrl) return post.thumbnailUrl;
  return post.mediaUrl;
}

/** Pick a full-size URL for lightbox/large display use. */
function pickFull(post) {
  if (post.sizes) {
    if (post.sizes.full  && post.sizes.full.mediaUrl)  return post.sizes.full.mediaUrl;
    if (post.sizes.large && post.sizes.large.mediaUrl) return post.sizes.large.mediaUrl;
  }
  if (post.mediaType === "VIDEO" && post.thumbnailUrl) return post.thumbnailUrl;
  return post.mediaUrl;
}

/** Sanitize a post id into a filesystem-safe filename stem. */
function safeId(id) {
  return String(id || "post").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}

/** Download a single remote image and write a square 800×800 cover-crop WebP
 *  to images/instagram/ig-<id>.webp. Returns the local URL on success, or
 *  the original remote URL on any failure (logged). Per-image resilience. */
async function cacheImage(remoteUrl, postId) {
  const filename = `ig-${safeId(postId)}.webp`;
  const outPath = path.join(CACHE_DIR, filename);
  try {
    const res = await fetch(remoteUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize(THUMB_SIZE, THUMB_SIZE, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toFile(outPath);
    return `${CACHE_URL_PREFIX}/${filename}`;
  } catch (err) {
    console.warn(`[instagram] cache failed for post ${postId} (${remoteUrl}): ${err && err.message} — using remote URL.`);
    return remoteUrl;
  }
}

module.exports = async function () {
  if (!FEED_URL) {
    console.warn("[instagram] BEHOLD_FEED_URL not set — falling back to static tiles.");
    return [];
  }

  // --- Fetch + normalize ---
  let posts;
  try {
    const res = await fetch(FEED_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.warn(`[instagram] Behold fetch failed (${res.status} ${res.statusText}) — falling back to static tiles.`);
      return [];
    }
    const data = await res.json();

    // One-time shape probe — print the actual keys so we can verify field mapping.
    console.log("[instagram] top-level keys:", Object.keys(data));
    posts = Array.isArray(data.posts) ? data.posts : (Array.isArray(data) ? data : []);
    if (posts.length === 0) {
      console.warn("[instagram] Behold response had no posts[] — falling back to static tiles.");
      return [];
    }
    console.log("[instagram] first post keys:", Object.keys(posts[0]));
    if (posts[0].sizes) console.log("[instagram] first post sizes keys:", Object.keys(posts[0].sizes));
  } catch (err) {
    console.warn("[instagram] Behold fetch threw — falling back to static tiles. Error:", err && err.message);
    return [];
  }

  const normalized = posts.slice(0, MAX_POSTS).map((p) => ({
    id: p.id,
    thumb: pickThumb(p),
    full: pickFull(p),
    permalink: p.permalink,
    alt: captionToAlt(p.caption),
  }));

  // --- Local image cache ---
  if (normalized.length > 0) {
    try {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    } catch (err) {
      console.warn("[instagram] could not create cache dir — skipping image cache. Error:", err && err.message);
      return normalized; // remote thumbs still work
    }

    await Promise.all(
      normalized.map(async (post) => {
        post.thumb = await cacheImage(post.thumb, post.id);
      })
    );
    console.log(`[instagram] cached ${normalized.length} thumbnails to ${CACHE_DIR}`);
  }

  console.log(`[instagram] normalized ${normalized.length} posts from Behold feed.`);
  return normalized;
};
