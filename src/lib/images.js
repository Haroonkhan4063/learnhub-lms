export const PLACEHOLDER = "/placeholder.jpg";

const library = ["nextjs", "javascript", "python-data", "sql", "design", "freelancing"];

const rules = [
  [/\b(next|react|node|html|css)\b|\bweb\b|full-?stack/i, "nextjs"],
  [/javascript|typescript|\bjs\b/i, "javascript"],
  [/python|data|analy|pandas|machine learning/i, "python-data"],
  [/sql|database|mongo|query/i, "sql"],
  [/design|\bui\b|\bux\b|figma|canva|graphic/i, "design"],
  [/freelanc|business|marketing|career|client/i, "freelancing"],
];

export function resolveImage(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";
  if (/^(https?:)?\/\//i.test(raw)) return raw.replace(/^http:\/\//i, "https://");
  if (/^data:image\//i.test(raw)) return raw;
  return `/${raw.replace(/^\.?\/?(public\/)?/, "")}`;
}

function libraryKey(course) {
  const sources = [course.title || "", course.category?.name || ""];
  for (const text of sources) {
    const hit = rules.find(([pattern]) => pattern.test(text));
    if (hit) return hit[1];
  }
  const hash = [...(course.title || "course")].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return library[hash % library.length];
}

export function courseImage(course) {
  const own = resolveImage(course.imageUrl) || resolveImage(course.thumbnail);
  return own || `/thumbs/${libraryKey(course)}.jpg`;
}
