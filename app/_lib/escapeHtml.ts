/**
 * Text that goes into an HTML STRING (Leaflet popups, tooltips and divIcons are set with
 * innerHTML) must pass through escapeHtml exactly once, at the point it is interpolated.
 * Names, place names and beacon names are typed by users on their phones — unescaped, a name
 * like `<img src=x onerror=…>` runs script in whoever opens the map (admins included).
 * React text (`{name}`) is already safe: never escape that, or "Tom & Jerry" shows "&amp;".
 */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

/**
 * A user-supplied image URL, only when it is https: (else null → show the initials).
 * Returned unescaped: escape it when it goes into an HTML attribute.
 */
export function httpsUrlOrNull(u: string | null | undefined): string | null {
  if (!u) return null;
  try {
    const url = new URL(u);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
