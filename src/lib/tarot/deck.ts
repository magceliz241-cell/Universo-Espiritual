/**
 * Baralho Rider-Waite-Smith: 78 cartas (22 Maiores + 56 Menores).
 * Cada carta aponta para o seu documento na Knowledge Base.
 */
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Rank =
  | "ace" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine" | "ten"
  | "page" | "knight" | "queen" | "king";

export interface TarotCard {
  id: string; // ex.: "major-00", "cups-queen"
  arcana: "major" | "minor";
  number: number | null; // 0–21 nos Maiores; 1–10 nos Menores numéricos
  suit: Suit | null;
  rank: Rank | null;
  name: string; // PT-BR
  nameEn: string;
  kb: string; // id do documento na KB
}

const MAJORS: [string, string, string][] = [
  ["00-the-fool", "O Louco", "The Fool"],
  ["01-the-magician", "O Mago", "The Magician"],
  ["02-the-high-priestess", "A Sacerdotisa", "The High Priestess"],
  ["03-the-empress", "A Imperatriz", "The Empress"],
  ["04-the-emperor", "O Imperador", "The Emperor"],
  ["05-the-hierophant", "O Hierofante", "The Hierophant"],
  ["06-the-lovers", "Os Enamorados", "The Lovers"],
  ["07-the-chariot", "O Carro", "The Chariot"],
  ["08-strength", "A Força", "Strength"],
  ["09-the-hermit", "O Eremita", "The Hermit"],
  ["10-wheel-of-fortune", "A Roda da Fortuna", "Wheel of Fortune"],
  ["11-justice", "A Justiça", "Justice"],
  ["12-the-hanged-man", "O Enforcado", "The Hanged Man"],
  ["13-death", "A Morte", "Death"],
  ["14-temperance", "A Temperança", "Temperance"],
  ["15-the-devil", "O Diabo", "The Devil"],
  ["16-the-tower", "A Torre", "The Tower"],
  ["17-the-star", "A Estrela", "The Star"],
  ["18-the-moon", "A Lua", "The Moon"],
  ["19-the-sun", "O Sol", "The Sun"],
  ["20-judgement", "O Julgamento", "Judgement"],
  ["21-the-world", "O Mundo", "The World"],
];

export const SUITS: Record<Suit, { name: string; nameEn: string }> = {
  wands: { name: "Paus", nameEn: "Wands" },
  cups: { name: "Copas", nameEn: "Cups" },
  swords: { name: "Espadas", nameEn: "Swords" },
  pentacles: { name: "Ouros", nameEn: "Pentacles" },
};

const RANKS: [Rank, string, string, number | null][] = [
  ["ace", "Ás", "Ace", 1],
  ["two", "Dois", "Two", 2],
  ["three", "Três", "Three", 3],
  ["four", "Quatro", "Four", 4],
  ["five", "Cinco", "Five", 5],
  ["six", "Seis", "Six", 6],
  ["seven", "Sete", "Seven", 7],
  ["eight", "Oito", "Eight", 8],
  ["nine", "Nove", "Nine", 9],
  ["ten", "Dez", "Ten", 10],
  ["page", "Pajem", "Page", null],
  ["knight", "Cavaleiro", "Knight", null],
  ["queen", "Rainha", "Queen", null],
  ["king", "Rei", "King", null],
];

export const DECK: readonly TarotCard[] = [
  ...MAJORS.map(([slug, name, nameEn], i): TarotCard => ({
    id: `major-${String(i).padStart(2, "0")}`,
    arcana: "major",
    number: i,
    suit: null,
    rank: null,
    name,
    nameEn,
    kb: `tarot/major-arcana/${slug}`,
  })),
  ...(Object.keys(SUITS) as Suit[]).flatMap((suit) =>
    RANKS.map(([rank, rankName, rankEn, number]): TarotCard => ({
      id: `${suit}-${rank}`,
      arcana: "minor",
      number,
      suit,
      rank,
      name: `${rankName} de ${SUITS[suit].name}`,
      nameEn: `${rankEn} of ${SUITS[suit].nameEn}`,
      kb: `tarot/minor-arcana/${suit}/${rank}-${suit}`,
    })),
  ),
];

export const CARD_BY_ID: ReadonlyMap<string, TarotCard> = new Map(DECK.map((c) => [c.id, c]));
