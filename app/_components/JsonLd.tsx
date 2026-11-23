/**
 * Structured data (schema.org JSON-LD) for search engines and AI assistants.
 *
 * Pass one node or several; several are wrapped in one `@graph` so nodes can point at each other by
 * `@id` (the organisation, the app). `<` is escaped so no string can ever close the script tag.
 */
export function JsonLd({ nodes }: { nodes: object[] }) {
  const data = { '@context': 'https://schema.org', '@graph': nodes };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
