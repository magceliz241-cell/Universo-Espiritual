/**
 * Símbolos de sonho da KB (knowledge/dreams/symbols/*) e termos em português que os indicam.
 * A extração é determinística (dicionário); a IA não "descobre" símbolos novos.
 */
export interface DreamSymbol {
  slug: string; // arquivo da KB
  label: string; // PT-BR
  terms: string[]; // termos já normalizados (minúsculas, sem acento); prefixos terminam com "*"
}

export const DREAM_SYMBOLS: readonly DreamSymbol[] = [
  { slug: "water", label: "Água", terms: ["agua*", "rio*", "lago*", "cachoeira*", "piscina*", "enchente*", "inundac*", "molhad*"] },
  { slug: "ocean", label: "Mar", terms: ["mar", "mares", "oceano*", "praia*", "onda", "ondas", "maremoto*", "tsunami*"] },
  { slug: "rain", label: "Chuva", terms: ["chuva*", "chove*", "chovia", "choveu", "tempestade*", "garoa*"] },
  { slug: "fire", label: "Fogo", terms: ["fogo*", "incendio*", "chama", "chamas", "queimand*", "queimou", "queimad*", "fogueira*"] },
  { slug: "snake", label: "Cobra", terms: ["cobra*", "serpente*", "vibora*", "jiboia*", "sucuri*"] },
  { slug: "animal", label: "Animal", terms: ["animal", "animais", "bicho*", "cachorro*", "cao", "caes", "gato*", "cavalo*", "lobo*", "leao", "leoa", "tigre*", "passaro*", "aranha*", "rato*", "urso*"] },
  { slug: "teeth", label: "Dentes", terms: ["dente", "dentes", "dentadura*", "banguela*"] },
  { slug: "falling", label: "Queda", terms: ["cair", "caindo", "cai", "caiu", "queda*", "despenc*", "tropec*"] },
  { slug: "flying", label: "Voar", terms: ["voar", "voando", "voei", "voava", "flutuand*", "flutuava", "levitand*"] },
  { slug: "being-chased", label: "Perseguição", terms: ["perseguid*", "perseguin*", "perseguia", "correndo atras", "correr atras", "fugind*", "fugia", "fugir"] },
  { slug: "death", label: "Morte", terms: ["morte*", "morrer", "morrendo", "morreu", "morria", "morto", "morta", "mortos", "funeral*", "velorio*", "enterro*", "caixao*"] },
  { slug: "house", label: "Casa", terms: ["casa", "casas", "apartamento*", "quarto", "quartos", "sala", "porao", "sotao", "cozinha*"] },
  { slug: "door", label: "Porta", terms: ["porta", "portas", "portao*", "fechadura*", "chave", "chaves"] },
  { slug: "school", label: "Escola", terms: ["escola*", "prova", "provas", "aula", "aulas", "faculdade*", "professor*", "vestibular*"] },
  { slug: "mountain", label: "Montanha", terms: ["montanha*", "morro*", "serra*", "escaland*", "escalava", "pico*"] },
  { slug: "journey", label: "Viagem", terms: ["viagem", "viagens", "viajand*", "viajei", "viajava", "estrada*", "aeroporto*", "aviao", "mala", "malas", "trem"] },
  { slug: "money", label: "Dinheiro", terms: ["dinheiro*", "moeda*", "nota", "notas", "pagamento*", "divida*", "carteira*", "pix"] },
  { slug: "baby", label: "Bebê", terms: ["bebe", "bebes", "nene*", "gravida*", "gravidez", "recem-nascido*", "recem nascido*", "parto"] },
  { slug: "mirror", label: "Espelho", terms: ["espelho*", "reflexo*"] },
  { slug: "lost", label: "Perder-se", terms: ["perdid*", "me perdi", "perdia", "sem saber onde", "labirinto*", "nao achava o caminho", "nao encontrava o caminho"] },
];
