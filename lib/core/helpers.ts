export function parseURI(uri: string): {
  query: string;
  filters: { [key: string]: string };
} {
  const { pathname: query, searchParams } = new URL(uri);
  const filters = Object.fromEntries(searchParams);
  return { query, filters };
}

export function match(query: string, template: string): boolean {
  const queryEntries = query.split("/").filter(Boolean);
  const templateEntries = template.split("/").filter(Boolean);
  if (queryEntries.length !== templateEntries.length) return false;
  const filteredQueryEntries = queryEntries.filter((entry) =>
    isNaN(Number(entry))
  );
  const filteredTemplateEntries = templateEntries.filter(
    (entry) => !entry.startsWith(":")
  );
  return filteredQueryEntries.join("/") === filteredTemplateEntries.join("/");
}

export function parseParams(
  query: string,
  template: string
): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  const queryEntries = query.split("/");
  const templateEntries = template.split("/");
  for (const [index, entry] of templateEntries.entries()) {
    if (!entry.startsWith(":")) continue;
    const key = entry.substring(1);
    const value = queryEntries[index];
    result[key] = value;
  }
  return result;
}
