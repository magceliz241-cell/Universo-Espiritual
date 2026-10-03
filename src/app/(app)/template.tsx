/** Remonta a cada navegação entre telas do app: dá a entrada suave (.page-enter, respeita prefers-reduced-motion). */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
