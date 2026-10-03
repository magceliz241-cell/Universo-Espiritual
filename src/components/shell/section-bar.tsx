"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { SECTION_LABEL } from "./nav";

/** Dica de uso de cada aba (botão "?"). */
const TIPS: Record<string, { title: string; items: string[] }> = {
  "/": {
    title: "Como usar o Início",
    items: [
      "Aqui fica o resumo do seu dia: a fase da Lua e o seu Sol, Lua e Ascendente.",
      "Toque num atalho para abrir Mapa, Tarot, Numerologia, Lua, Sonhos ou Amor.",
      "O botão dourado ✦ Guia, embaixo, abre a conversa com o Seu Guia.",
    ],
  },
  "/mapa": {
    title: "Como usar o Mapa",
    items: [
      "A roda mostra onde cada planeta estava no instante do seu nascimento.",
      "Use as abas Planetas, Aspectos e Casas para ver os detalhes em lista.",
      "Toque em “Ver minha leitura” para o Seu Guia traduzir o mapa em linguagem simples.",
      "O sistema de casas pode ser trocado no fim da página (Placidus é o padrão).",
    ],
  },
  "/guia": {
    title: "Como usar o Seu Guia",
    items: [
      "Escreva uma pergunta sobre você: amor, trabalho, fases, escolhas.",
      "As respostas partem do seu mapa calculado, não de um texto genérico de signo.",
      "Perguntas abertas (“o que posso observar…”) rendem respostas melhores que “sim ou não”.",
    ],
  },
  "/tarot": {
    title: "Como usar o Tarot",
    items: [
      "Escolha uma tiragem, escreva a pergunta (opcional) e toque em “Embaralhar e tirar”.",
      "As cartas são reveladas uma a uma. Cartas invertidas aparecem de cabeça para baixo de propósito: na tradição, mudam o tom da leitura.",
      "Depois, toque em “Ler as cartas” para a leitura do Seu Guia.",
    ],
  },
  "/amor": {
    title: "Como usar o Amor",
    items: [
      "Vênus, Marte, Lua e Sol mostram como você ama e o que precisa numa relação.",
      "Em “Mapa do casal”, adicione os dados da outra pessoa para ver as conexões entre os dois mapas.",
      "O Tarot do amor tem uma tiragem de 3 cartas só para relacionamentos.",
    ],
  },
  "/lua": {
    title: "Como usar a Lua",
    items: [
      "Veja a fase de hoje, quanto da Lua está iluminado e em que signo ela está.",
      "Escreva uma intenção para acompanhar a fase.",
      "Embaixo, as datas das próximas fases principais no seu fuso.",
    ],
  },
  "/numerologia": {
    title: "Como usar a Numerologia",
    items: [
      "O número grande é o seu Caminho de Vida, calculado pela data de nascimento.",
      "Expressão, Alma e Personalidade vêm das letras do nome de nascimento.",
      "Se faltar o nome completo, preencha em Perfil → Dados de nascimento.",
    ],
  },
  "/sonhos": {
    title: "Como usar os Sonhos",
    items: [
      "Escreva o sonho do jeito que lembrar e marque como você se sentiu.",
      "O sistema identifica os símbolos e o Seu Guia traduz leituras possíveis.",
      "Seus sonhos ficam salvos só na sua conta, no diário abaixo.",
    ],
  },
  "/perfil": {
    title: "Como usar o Perfil",
    items: [
      "Edite seus dados de nascimento e os da pessoa do mapa do casal.",
      "Em “Sobre” estão as fontes dos cálculos e como as leituras são feitas.",
    ],
  },
};

/** Seção atual ("/amor/sinastria" → "/amor") e destino do botão de voltar. */
export function sectionOf(pathname: string): { section: string; back: string | null } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { section: "/", back: null };
  const section = `/${parts[0]}`;
  return { section, back: parts.length > 1 ? section : "/" };
}

/** Barra do topo de cada aba: voltar (para o Início ou para a seção) e "?" com a dica de uso. */
export function SectionBar() {
  const pathname = usePathname();
  const { section, back } = sectionOf(pathname);
  const tip = TIPS[section];
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const panelId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (!back && !tip) return null;
  return (
    <div className="relative mx-auto mb-4 flex max-w-6xl items-center justify-between md:mb-6" ref={boxRef}>
      {back ? (
        <Link
          href={back}
          data-testid="section-back"
          className="-ml-1 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-ink-2 transition-colors hover:text-gold"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          {SECTION_LABEL[back] ?? "Voltar"}
        </Link>
      ) : (
        <span />
      )}
      {tip ? (
        <>
          <button
            type="button"
            aria-label={`Ajuda: ${tip.title}`}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            data-testid="section-help"
            className={cn(
              "grid size-7 place-items-center rounded-full border text-[13px] font-medium transition-colors",
              open ? "border-gold/70 text-gold" : "border-line-strong text-ink-3 hover:border-gold/50 hover:text-gold",
            )}
          >
            ?
          </button>
          {open ? (
            <div
              id={panelId}
              role="dialog"
              aria-label={tip.title}
              className="surface-glass page-enter absolute right-0 top-9 z-30 w-[min(320px,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-line-strong p-4 shadow-[0_18px_40px_-12px_rgb(0_0_0_/_0.6)]"
            >
              <p className="text-display text-[1.2rem] text-gold">{tip.title}</p>
              <ul className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-ink-2">
                {tip.items.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span aria-hidden className="text-gold">·</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
