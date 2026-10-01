"use client";

import { useEffect, useId, useRef, useState } from "react";
import { inputClass } from "@/components/ui/field";
import { cityLabel, type City } from "@/lib/cities/types";
import { cn } from "@/lib/cn";

/** Combobox acessível de cidades (base própria GeoNames). */
export function CitySearch({
  name,
  defaultCity,
  invalid,
}: {
  name: string;
  defaultCity?: { id: number; label: string } | null;
  invalid?: boolean;
}) {
  const listId = useId();
  const [query, setQuery] = useState(defaultCity?.label ?? "");
  const [selected, setSelected] = useState<{ id: number; label: string } | null>(defaultCity ?? null);
  const [results, setResults] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selected && query === selected.label) return;
    if (timer.current) clearTimeout(timer.current);
    if (query.trim().length < 2) return;
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/cities?q=${encodeURIComponent(query)}`);
        const data = (await r.json()) as { cities?: City[] };
        setResults(data.cities ?? []);
        setActive(0);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
  }, [query, selected]);

  // Com menos de 2 letras não há sugestões (derivado, sem apagar o estado).
  const visible = query.trim().length >= 2 ? results : [];

  const choose = (c: City) => {
    const label = cityLabel(c);
    setSelected({ id: c.id, label });
    setQuery(label);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selected?.id ?? ""} />
      <input
        id={name}
        role="combobox"
        aria-expanded={open && visible.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        aria-activedescendant={open && visible[active] ? `${listId}-${visible[active].id}` : undefined}
        autoComplete="off"
        placeholder="Digite a cidade"
        className={inputClass}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
        onFocus={() => visible.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (!open || visible.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, visible.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            choose(visible[active]);
          } else if (e.key === "Escape") setOpen(false);
        }}
      />
      {loading ? <span className="absolute right-3 top-3.5 size-2 animate-pulse rounded-full bg-lilac" aria-hidden /> : null}
      {open && visible.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-72 w-full overflow-auto rounded-[var(--radius-md)] border border-line-strong bg-surface-2 py-1 shadow-2xl"
        >
          {visible.map((c, i) => (
            <li
              key={c.id}
              id={`${listId}-${c.id}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(c);
              }}
              className={cn("cursor-pointer px-3.5 py-2.5 text-sm", i === active ? "bg-surface-3 text-ink" : "text-ink-2")}
            >
              <span className="text-ink">{c.name}</span>
              <span className="text-ink-3">{[c.admin1_name, c.country_code].filter(Boolean).join(", ") ? `, ${[c.admin1_name, c.country_code].filter(Boolean).join(", ")}` : ""}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {open && !loading && query.trim().length >= 2 && visible.length === 0 && !selected ? (
        <p className="mt-1.5 text-xs text-ink-3">Nenhuma cidade encontrada. Tente sem abreviações.</p>
      ) : null}
    </div>
  );
}
