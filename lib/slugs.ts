export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function findBySlug<T extends string>(items: T[], slug: string): T | undefined {
  return items.find((item) => toSlug(item) === slug);
}
