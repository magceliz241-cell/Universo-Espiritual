// Groq SIMULADA para os testes ponta a ponta: devolve uma interpretação válida no
// formato pedido, montada a partir dos dados recebidos (sem inventar cálculos).
import http from "node:http";

const PORT = Number(process.env.FAKE_GROQ_PORT ?? 54399);

function reply(task, data) {
  if (task === "guide_chat") {
    return {
      answer: `Uma leitura possível: sua pergunta "${data?.question ?? ""}" toca temas que o seu mapa ajuda a observar com calma.`,
      reflection_questions: ["O que essa pergunta desperta em você hoje?"],
      suggested_questions: ["O que minha Lua representa?"],
    };
  }
  return {
    title: "Uma leitura possível",
    summary: `Leitura simbólica (${task}) gerada a partir dos dados calculados pelo sistema.`,
    sections: task === "natal_summary"
      ? [
          { heading: "Sol em Leão", body: "Na tradição astrológica, o Sol em Leão fala de expressão, calor e vontade de criar." },
          { heading: "Seus pontos fortes", body: "Generosidade · Criatividade · Coragem · Presença. O seu mapa mostra uma energia que gosta de iluminar o que toca." },
          { heading: "Seus desafios", body: "Orgulho · Impaciência · Autocobrança. Pontos para observar com carinho, não defeitos." },
          { heading: "No amor", body: "Uma leitura possível: você ama com entrega e precisa de reconhecimento e admiração." },
        ]
      : [
          { heading: "Primeiro olhar", body: "Na tradição simbólica, estes elementos convidam à observação, não a certezas." },
          { heading: "Para integrar", body: "Uma leitura possível é olhar para isso como um convite, e não como destino." },
        ],
    reflection_questions: ["O que desta leitura faz sentido para você agora?"],
    practice: "Anote em poucas linhas o que chamou sua atenção.",
  };
}

http
  .createServer(async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    let body = {};
    try {
      body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    } catch {}
    if (req.headers.authorization !== "Bearer gsk_e2e_fake") {
      res.writeHead(401).end("{}");
      return;
    }
    const user = JSON.parse(body.messages?.find((m) => m.role === "user")?.content ?? "{}");
    const content = JSON.stringify(reply(user.task, user.data));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ model: body.model, choices: [{ message: { content } }], usage: { prompt_tokens: 900, completion_tokens: 250 } }));
  })
  .listen(PORT, "127.0.0.1", () => console.log(`fake groq em ${PORT}`));
