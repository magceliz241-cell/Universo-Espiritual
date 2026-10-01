/** Estado de carregamento contextual (design system §27). O texto é só UX. */
export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3 text-ink-2" role="status">
      <span className="size-2 animate-pulse rounded-full bg-lilac" aria-hidden />
      Observando seu céu…
    </div>
  );
}
