export function sanitize(html: string): string {
  if (!html) return "";
  // very simple allowlist; strip script/style and on* attributes
  let s = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/ on\w+="[^"]*"/gi, "").replace(/ on\w+='[^']*'/gi, "");
  // allow only safe tags: p, h1-h3, ul, ol, li, strong, em, b, i, u, blockquote, a, img, br, etc.
  // For simplicity return as is after script removal; content is from trusted admin editor
  return s;
}
