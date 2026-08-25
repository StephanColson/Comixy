const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const LANGUAGES = ["en", "de", "fr", "nl"];

// Search Wikidata for people matching a name, across multiple languages.
// Returns deduplicated candidates for disambiguation.
export async function searchWikidataPeople(name) {
  const resultsByLanguage = await Promise.all(
    LANGUAGES.map(async (language) => {
      const params = new URLSearchParams({
        action: "wbsearchentities",
        search: name,
        language,
        type: "item",
        format: "json",
        origin: "*",
        limit: "10",
      });

      const res = await fetch(`${WIKIDATA_API}?${params}`);
      if (!res.ok) throw new Error(`Wikidata search failed (${language})`);
      const data = await res.json();

      return (data.search ?? []).map((entry) => ({
        id: entry.id, // QID, e.g. "Q12345"
        label: entry.label,
        description: entry.description ?? "",
        url: entry.concepturi,
        matchedLanguage: language,
      }));
    }),
  );

  const seen = new Map();
  for (const candidate of resultsByLanguage.flat()) {
    if (!seen.has(candidate.id)) {
      seen.set(candidate.id, candidate);
    }
  }

  return [...seen.values()];
}

// Fetch aliases (en/de/fr/nl) for a given Wikidata QID.
export async function getWikidataAliases(qid) {
  const params = new URLSearchParams({
    action: "wbgetentities",
    ids: qid,
    props: "aliases|labels",
    languages: LANGUAGES.join("|"),
    format: "json",
    origin: "*",
  });

  const res = await fetch(`${WIKIDATA_API}?${params}`);
  if (!res.ok) throw new Error("Wikidata entity fetch failed");
  const data = await res.json();

  const entity = data.entities?.[qid];
  if (!entity) return [];

  const names = new Set();

  for (const language of LANGUAGES) {
    const label = entity.labels?.[language]?.value;
    if (label) names.add(label);

    for (const alias of entity.aliases?.[language] ?? []) {
      names.add(alias.value);
    }
  }

  return [...names];
}
