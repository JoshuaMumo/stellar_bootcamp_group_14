const tagColorVariants = [
  "bg-green-100",
  "bg-yellow-100",
  "bg-red-100",
  "bg-blue-100",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-teal-100 text-teal-700",
  "bg-cyan-100 text-cyan-700",
  "bg-lime-100 text-lime-700",
  "bg-orange-100 text-orange-700",
] as const;

export function getTagColorClasses(title: string) {
  const hash = Array.from(title).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );

  return tagColorVariants[hash % tagColorVariants.length];
}
