import type { ReactNode } from "react";
import { getTagColorClasses } from "./tagStyles";

type CardProps = {
  title: string;
  description: string;
  href?: string;
  tags?: string[];
  children?: ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  href,
  tags,
  children,
  className,
}: CardProps) {
  return (
    <article
      className={`rounded-3xl border border-zinc-200/80 bg-white/95 p-6 shadow-lg shadow-zinc-900/5 transition duration-200 hover:-translate-y-1 hover:shadow-zinc-900/10 ${
        className ?? ""
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-600">{title}</h2>
          <p className="text-xl leading-6 text-zinc-950">{description}</p>
        </div>
        {href ? (
          <a
            href={href}
            className="inline-flex items-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200"
          >
            View
          </a>
        ) : null}
      </div>

      {children ? (
        <div className="mt-5 text-sm text-zinc-700">{children}</div>
      ) : null}

      {tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getTagColorClasses(
                title,
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
