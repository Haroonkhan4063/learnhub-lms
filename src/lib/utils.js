export const plain = (x) => JSON.parse(JSON.stringify(x));
export const money = (n) => (n > 0 ? `$${Number(n).toFixed(n % 1 ? 2 : 0)}` : "Free");
export const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function youtubeId(url = "") {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}
