export function slugify(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .toLowerCase()
    .replace(/ /g, "-") // spaces → hyphens
    .replace(/[^\w-]+/g, ""); // remove special characters
}
