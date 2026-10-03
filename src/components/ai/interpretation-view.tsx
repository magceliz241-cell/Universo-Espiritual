import type { ReactNode } from "react";
import type { Interpretation } from "@/lib/ai/response-parser";

/** Ícone dourado de cada bloco, pelo título (estética dos criativos: revela, pontos fortes, desafios, amor). */
function SectionIcon({ heading }: { heading: string }) {
  const h = heading.toLowerCase();
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let d: ReactNode = <path d="M12 3.5l1.6 6.9 6.9 1.6-6.9 1.6L12 20.5l-1.6-6.9L3.5 12l6.9-1.6z" />;
  if (h.includes("forte")) d = <path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6l-5.3 2.9 1.1-5.9L3.4 9.5l6-.8z" />;
  else if (h.includes("desafio")) d = <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" />;
  else if (h.includes("amor")) d = <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />;
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden className="shrink-0 text-gold">
      <g {...c}>{d}</g>
    </svg>
  );
}

/** Corpo em lista quando a IA traz qualidades separadas por " · " (pontos fortes, desafios). */
function Body({ text }: { text: string }) {
  const [head, ...rest] = text.split(/(?<=[^.!?]{2,})\.\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕ])/);
  const items = head.split(" · ").map((x) => x.trim()).filter(Boolean);
  if (items.length >= 3 && items.every((x) => x.length <= 40)) {
    return (
      <>
        <ul className="mt-2 flex flex-col gap-1">
          {items.map((it) => (
            <li key={it} className="flex items-center gap-2 text-[15px] text-ink">
              <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />
              {it}
            </li>
          ))}
        </ul>
        {rest.length ? <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{rest.join(". ")}</p> : null}
      </>
    );
  }
  return <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{text}</p>;
}

/** Interpretação em resumo, blocos e perguntas (design system §15, §26; blocos no estilo dos criativos). */
export function InterpretationView({ data }: { data: Interpretation }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[var(--radius-md)] border border-line bg-surface-2/60 p-4">
        <h3 className="flex items-center gap-2 text-display text-[1.45rem] text-gold-gradient">
          <SectionIcon heading="revela" />
          {data.title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{data.summary}</p>
      </div>
      {data.sections.map((s, i) => (
        <section key={i} className="rounded-[var(--radius-md)] border border-line bg-surface-2/40 p-4">
          <h4 className="flex items-center gap-2 text-display text-[1.2rem] text-gold">
            <SectionIcon heading={s.heading} />
            {s.heading}
          </h4>
          <Body text={s.body} />
        </section>
      ))}
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
