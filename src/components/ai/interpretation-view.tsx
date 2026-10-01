import type { Interpretation } from "@/lib/ai/response-parser";

/** Interpretação em resumo, seções e perguntas (design system §15, §26). */
export function InterpretationView({ data }: { data: Interpretation }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-display text-[1.7rem]">{data.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{data.summary}</p>
      </div>
      <div className="flex flex-col gap-5">
        {data.sections.map((s, i) => (
          <section key={i}>
            <h4 className="text-sm font-medium text-gold">{s.heading}</h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
          </section>
        ))}
      </div>
      {data.reflection_questions.length ? (
        <div className="rounded-[var(--radius-md)] border border-line bg-surface-2 px-4 py-3.5">
          <p className="eyebrow mb-2">Para refletir</p>
          <ul className="flex flex-col gap-1.5">
            {data.reflection_questions.map((q, i) => (
              <li key={i} className="text-display text-[1.15rem] leading-snug text-ink">
                {q}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {data.practice ? (
        <p className="text-sm leading-relaxed text-ink-2">
          <span className="text-ink">Prática opcional · </span>
          {data.practice}
        </p>
      ) : null}
    </div>
  );
}
