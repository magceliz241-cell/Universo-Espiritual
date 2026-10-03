// ARQUIVO GERADO por scripts/build-knowledge.ts a partir de knowledge/. Não edite à mão.
// Rode: npm run build:knowledge
import type { KnowledgeDoc } from "./types";

export const KNOWLEDGE_VERSION = "2.0+f7c1d71bad22";

export const DOCS: Record<string, KnowledgeDoc> = {
 "AI_CONTEXT_RULES": {
  "id": "AI_CONTEXT_RULES",
  "domain": "rules",
  "title": "Regras de contexto para a IA",
  "content": "# Regras de contexto para a IA\n\n## Nunca enviar\n- toda a KB\n- todos os sonhos\n- todo histórico de conversa\n- segredos ou chaves\n- dados pessoais irrelevantes.\n\n## Enviar\nSomente:\n1. tarefa\n2. pergunta\n3. dados calculados relevantes\n4. trechos relevantes da KB\n5. contexto explícito do usuário\n6. formato de saída.\n\n## Exemplo — Perfil Amoroso\n\n```json\n{\n  \"task\":\"love_profile\",\n  \"chart\":{\n    \"sun\":{\"sign\":\"Leo\",\"degree\":18},\n    \"moon\":{\"sign\":\"Pisces\",\"degree\":3},\n    \"venus\":{\"sign\":\"Cancer\",\"degree\":12},\n    \"mars\":{\"sign\":\"Libra\",\"degree\":7}\n  },\n  \"knowledge\":[\n    \"conteúdo de Leo\",\n    \"conteúdo de Pisces\",\n    \"conteúdo de Cancer\",\n    \"conteúdo de Libra\",\n    \"conteúdo de Venus\",\n    \"conteúdo de Mars\"\n  ]\n}\n```\n\n## Exemplo — Tarot\n\nEnviar somente as cartas sorteadas, posições, orientação e conhecimento dessas cartas.\n\n## Regra\nA IA interpreta dados. Ela não calcula posições nem sorteia cartas.",
  "sources": []
 },
 "LEGAL_AND_EDITORIAL_NOTES": {
  "id": "LEGAL_AND_EDITORIAL_NOTES",
  "domain": "rules",
  "title": "Legal, licença e editorial",
  "content": "# Legal, licença e editorial\n\n## XALEN\n\nO repositório do XALEN declara Apache License 2.0 para o projeto.\n\nAntes de um lançamento comercial:\n- fixar versão/commit;\n- preservar LICENSE e NOTICE quando exigido;\n- auditar dependências;\n- auditar dados/catálogos externos;\n- não afirmar que todo conteúdo do repositório possui a mesma licença sem verificar o NOTICE.\n\nO NOTICE atual identifica fontes externas, incluindo NASA/JPL, IAU, ESA/Hipparcos e outros componentes.\n\n## Swiss Ephemeris\n\nNão utilizar Swiss Ephemeris como dependência/runtime do Astarot.\n\n## Conteúdo\n\nFontes são referências de estudo e validação. Não copiar grandes trechos.\n\nNão baixar/republicar imagens de Tarot de terceiros sem licença adequada.\n\n## Editorial\n\nAstrologia, Tarot e numerologia são apresentados como sistemas simbólicos/esotéricos.\n\nSonhos são usados para reflexão, não diagnóstico.\n\nNão prometer:\n- cura;\n- previsão garantida;\n- enriquecimento;\n- reconciliação garantida;\n- resultado amoroso garantido;\n- resultado médico;\n- resultado jurídico.\n\n## IA\n\nA IA deve evitar linguagem que apresente interpretações simbólicas como fatos objetivos.\n\nPreferir:\n\"na tradição astrológica...\"\n\"uma leitura possível...\"\n\"simbolicamente...\"\n\nem vez de afirmações causais ou garantias.",
  "sources": []
 },
 "METHODOLOGIES": {
  "id": "METHODOLOGIES",
  "domain": "rules",
  "title": "Metodologias — Astarot",
  "content": "# Metodologias — Astarot\n\n## 1. Astrologia ocidental tropical — MVP\n\n### Zodíaco\n- Tropical.\n- 12 signos.\n- 30° por signo.\n- Longitude normalizada em [0°, 360°).\n\n### Motor\nXALEN Ephemeris.\n- Não usar Swiss Ephemeris como runtime.\n- O motor deve ficar atrás de uma interface `EphemerisEngine`.\n- Registrar `engine_name` e `engine_version` no resultado.\n- Registrar `calculation_method` (analítico ou DE440).\n\n### Casas\nO MVP deve usar **Placidus** como padrão inicial, salvo se a auditoria do XALEN recomendar outra configuração por limitações operacionais. O campo `house_system` é obrigatório e deve ser versionado.\nPara latitudes polares/condições degeneradas, o sistema deve respeitar o fallback documentado pelo XALEN; não criar fallback silencioso próprio.\n\n### Planetas\nMVP:\nSun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.\n\nPontos:\nAscendant, MC, Mean Node/True Node, Chiron e Lilith podem ser adicionados quando suportados e testados.\n\n### Aspectos\nMVP:\n- conjunction 0°\n- sextile 60°\n- square 90°\n- trine 120°\n- opposition 180°\n\nOrbs são configuração, não lógica espalhada pelo código.\n\n### Sinastria\nCalcular dois mapas separadamente e depois comparar longitudes/aspectos entre os corpos dos dois mapas. Não reduzir a compatibilidade a um único score sem uma metodologia explicitamente definida.\n\n## 2. Numerologia\n\nMétodo principal: pitagórico.\n\nNúmeros:\n- 1–9\n- 11, 22 e 33 como mestres quando a regra da métrica os preservar.\n\nToda métrica deve ter:\n- nome;\n- fórmula;\n- regra de redução;\n- tratamento de números mestres;\n- versão.\n\nNão misturar métodos pitagórico e caldeu.\n\n## 3. Tarot\n\nRider-Waite-Smith como tradição de referência.\n\n78 cartas:\n- 22 Maiores\n- 56 Menores\n- Paus, Copas, Espadas, Ouros\n- Ás–10 + Pajem, Cavaleiro, Rainha, Rei.\n\nO software sorteia; a KB fornece significados; a IA interpreta.\n\nA aleatoriedade deve ser feita pelo runtime criptograficamente seguro quando o objetivo for sorteio real. Nunca pedir à IA para \"sortear\".\n\n## 4. Lua\n\nAstronomia:\n- fases calculadas pelo software/motor astronômico.\n- ciclo sinódico médio ~29,5 dias.\n\nSimbolismo:\n- conteúdo de reflexão/ritual, nunca promessa causal.\n\n## 5. Sonhos\n\nNão existe tabela universal validada que atribua significado único a símbolos.\nCada entrada deve conter:\n- associações possíveis;\n- contexto emocional;\n- perguntas reflexivas;\n- interpretações alternativas.\n\nNunca diagnosticar doença, trauma ou estado mental a partir de sonho.\n\n## 6. Personalização\n\nA interpretação deve combinar:\n`resultado calculado + contexto da pessoa + Knowledge Base relevante + tarefa`.\n\nNão deve combinar arbitrariamente todas as tradições em uma única leitura.",
  "sources": []
 },
 "astrology/aspects/README": {
  "id": "astrology/aspects/README",
  "domain": "astrology",
  "title": "Aspectos",
  "content": "# Aspectos\n\nAspecto é a distância angular entre dois pontos do mapa. A interpretação depende de:\n- planetas envolvidos\n- signos\n- casas\n- orbe\n- aplicante/separativo quando a metodologia usar\n- dignidades/contexto\n\nNo MVP, usar os cinco aspectos maiores.\nOrbes devem ser configuráveis e versionados; não “inventar” um orbe único para todos os casos.",
  "sources": []
 },
 "astrology/aspects/conjunction": {
  "id": "astrology/aspects/conjunction",
  "domain": "astrology",
  "title": "Conjunção",
  "content": "# Conjunção\n\nÂngulo: 0°\n\n## Ideia central\nfusão/combinação das funções; pode intensificar ambas\n\n## Interpretação\nCombine os significados dos dois planetas e observe em quais signos/casas eles estão.\n\n## Regra\nUm aspecto não é automaticamente “bom” ou “ruim”. O contexto do mapa determina a leitura.",
  "sources": [
   "https://www.skyscript.co.uk/begin10.html",
   "https://www.skyscript.co.uk/aspects2.html"
  ]
 },
 "astrology/aspects/opposition": {
  "id": "astrology/aspects/opposition",
  "domain": "astrology",
  "title": "Oposição",
  "content": "# Oposição\n\nÂngulo: 180°\n\n## Ideia central\npolaridade, tensão entre dois polos e necessidade de equilíbrio\n\n## Interpretação\nCombine os significados dos dois planetas e observe em quais signos/casas eles estão.\n\n## Regra\nUm aspecto não é automaticamente “bom” ou “ruim”. O contexto do mapa determina a leitura.",
  "sources": [
   "https://www.skyscript.co.uk/begin10.html",
   "https://www.skyscript.co.uk/aspects2.html"
  ]
 },
 "astrology/aspects/sextile": {
  "id": "astrology/aspects/sextile",
  "domain": "astrology",
  "title": "Sextil",
  "content": "# Sextil\n\nÂngulo: 60°\n\n## Ideia central\nfacilitação, oportunidade, cooperação que pode ser desenvolvida\n\n## Interpretação\nCombine os significados dos dois planetas e observe em quais signos/casas eles estão.\n\n## Regra\nUm aspecto não é automaticamente “bom” ou “ruim”. O contexto do mapa determina a leitura.",
  "sources": [
   "https://www.skyscript.co.uk/begin10.html",
   "https://www.skyscript.co.uk/aspects2.html"
  ]
 },
 "astrology/aspects/square": {
  "id": "astrology/aspects/square",
  "domain": "astrology",
  "title": "Quadratura",
  "content": "# Quadratura\n\nÂngulo: 90°\n\n## Ideia central\nfricção, desafio, necessidade de ajuste e integração\n\n## Interpretação\nCombine os significados dos dois planetas e observe em quais signos/casas eles estão.\n\n## Regra\nUm aspecto não é automaticamente “bom” ou “ruim”. O contexto do mapa determina a leitura.",
  "sources": [
   "https://www.skyscript.co.uk/begin10.html",
   "https://www.skyscript.co.uk/aspects2.html"
  ]
 },
 "astrology/aspects/trine": {
  "id": "astrology/aspects/trine",
  "domain": "astrology",
  "title": "Trígono",
  "content": "# Trígono\n\nÂngulo: 120°\n\n## Ideia central\nfluidez, facilidade, recursos que podem ser naturais\n\n## Interpretação\nCombine os significados dos dois planetas e observe em quais signos/casas eles estão.\n\n## Regra\nUm aspecto não é automaticamente “bom” ou “ruim”. O contexto do mapa determina a leitura.",
  "sources": [
   "https://www.skyscript.co.uk/begin10.html",
   "https://www.skyscript.co.uk/aspects2.html"
  ]
 },
 "astrology/houses/README": {
  "id": "astrology/houses/README",
  "domain": "astrology",
  "title": "Casas astrológicas",
  "content": "# Casas astrológicas\n\nAs casas são 12 campos de experiência. Signos e casas não são a mesma coisa.\nO signo descreve “como”; a casa descreve “onde”.\n\nO cálculo da cúspide depende de hora, local e sistema de casas. A hora de nascimento é crítica para ASC, MC e casas.",
  "sources": []
 },
 "astrology/houses/house-1": {
  "id": "astrology/houses/house-1",
  "domain": "astrology",
  "title": "Casa 1",
  "content": "# Casa 1\n\n## Temas principais\nidentidade, aparência, presença, iniciativa, maneira de entrar no mundo\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 1 é “naturalmente” idêntica ao signo 1. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-10": {
  "id": "astrology/houses/house-10",
  "domain": "astrology",
  "title": "Casa 10",
  "content": "# Casa 10\n\n## Temas principais\ncarreira, reputação, autoridade, direção pública, realizações\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 10 é “naturalmente” idêntica ao signo 10. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-11": {
  "id": "astrology/houses/house-11",
  "domain": "astrology",
  "title": "Casa 11",
  "content": "# Casa 11\n\n## Temas principais\namizades, grupos, redes, projetos coletivos, futuro e aspirações\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 11 é “naturalmente” idêntica ao signo 11. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-12": {
  "id": "astrology/houses/house-12",
  "domain": "astrology",
  "title": "Casa 12",
  "content": "# Casa 12\n\n## Temas principais\nrecolhimento, interioridade, encerramentos, imaginação, espiritualidade simbólica\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 12 é “naturalmente” idêntica ao signo 12. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-2": {
  "id": "astrology/houses/house-2",
  "domain": "astrology",
  "title": "Casa 2",
  "content": "# Casa 2\n\n## Temas principais\nrecursos, valores, dinheiro, posses, autoestima e prioridades materiais\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 2 é “naturalmente” idêntica ao signo 2. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-3": {
  "id": "astrology/houses/house-3",
  "domain": "astrology",
  "title": "Casa 3",
  "content": "# Casa 3\n\n## Temas principais\ncomunicação, aprendizagem básica, irmãos, deslocamentos próximos, ambiente cotidiano\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 3 é “naturalmente” idêntica ao signo 3. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-4": {
  "id": "astrology/houses/house-4",
  "domain": "astrology",
  "title": "Casa 4",
  "content": "# Casa 4\n\n## Temas principais\nraízes, lar, família, base emocional, passado, intimidade privada\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 4 é “naturalmente” idêntica ao signo 4. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-5": {
  "id": "astrology/houses/house-5",
  "domain": "astrology",
  "title": "Casa 5",
  "content": "# Casa 5\n\n## Temas principais\ncriatividade, romance, prazer, lazer, expressão pessoal, filhos\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 5 é “naturalmente” idêntica ao signo 5. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-6": {
  "id": "astrology/houses/house-6",
  "domain": "astrology",
  "title": "Casa 6",
  "content": "# Casa 6\n\n## Temas principais\nrotina, trabalho cotidiano, hábitos, serviço, organização, cuidados\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 6 é “naturalmente” idêntica ao signo 6. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-7": {
  "id": "astrology/houses/house-7",
  "domain": "astrology",
  "title": "Casa 7",
  "content": "# Casa 7\n\n## Temas principais\nparcerias, relacionamento, contratos, oposição/complementaridade, casamento\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 7 é “naturalmente” idêntica ao signo 7. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-8": {
  "id": "astrology/houses/house-8",
  "domain": "astrology",
  "title": "Casa 8",
  "content": "# Casa 8\n\n## Temas principais\nintimidade profunda, recursos compartilhados, crises, transformação, temas tabus\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 8 é “naturalmente” idêntica ao signo 8. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/houses/house-9": {
  "id": "astrology/houses/house-9",
  "domain": "astrology",
  "title": "Casa 9",
  "content": "# Casa 9\n\n## Temas principais\nviagens longas, estudos superiores, crenças, filosofia, visão de mundo\n\n## Como interpretar\n1. Identifique o signo na cúspide.\n2. Identifique o regente desse signo.\n3. Veja planetas dentro da casa.\n4. Observe aspectos desses planetas.\n5. Relacione com o restante do mapa.\n\n## Não fazer\nNão assumir que a Casa 9 é “naturalmente” idêntica ao signo 9. Casas e signos são sistemas distintos.",
  "sources": [
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/methodology": {
  "id": "astrology/methodology",
  "domain": "astrology",
  "title": "Astrologia — metodologia editorial",
  "content": "# Astrologia — metodologia editorial\n\n## Princípio de interpretação\n\nUma leitura natal é construída combinando:\n**planeta = o que/qual função**\n+\n**signo = como**\n+\n**casa = onde/área**\n+\n**aspecto = como essa função se relaciona com outras**.\n\nUm único placement nunca deve ser tratado como explicação completa da personalidade.\n\n## Elementos\n\n- Fogo: Áries, Leão, Sagitário — ação, vitalidade, iniciativa.\n- Terra: Touro, Virgem, Capricórnio — recursos, concretização, estrutura.\n- Ar: Gêmeos, Libra, Aquário — ideias, linguagem, relações sociais.\n- Água: Câncer, Escorpião, Peixes — emoção, intimidade, imaginação.\n\n## Modalidades\n\n- Cardinal: inicia.\n- Fixo: sustenta/consolida.\n- Mutável: adapta/transiciona.\n\n## Polaridades\n\n- Masculina/yang: Fogo e Ar.\n- Feminina/yin: Terra e Água.\n\nEstas categorias são linguagem tradicional/simbólica, não características biológicas.\n\n## Regentes\n\nRegência moderna:\n- Áries — Marte\n- Touro — Vênus\n- Gêmeos — Mercúrio\n- Câncer — Lua\n- Leão — Sol\n- Virgem — Mercúrio\n- Libra — Vênus\n- Escorpião — Plutão (com Marte na tradição)\n- Sagitário — Júpiter\n- Capricórnio — Saturno\n- Aquário — Urano (com Saturno na tradição)\n- Peixes — Netuno (com Júpiter na tradição)\n\nQuando tradição moderna e tradicional divergirem, mostrar a distinção.\n\n## Regra de qualidade\n\nNunca produzir frases do tipo “você é assim porque é de X”.\nPreferir “na linguagem astrológica, esse posicionamento costuma ser associado a...”.",
  "sources": []
 },
 "astrology/planets/README": {
  "id": "astrology/planets/README",
  "domain": "astrology",
  "title": "Planetas e pontos",
  "content": "# Planetas e pontos\n\nNa leitura:\n- planeta = função/arquétipo\n- signo = modo de expressão\n- casa = área da vida\n- aspecto = relação com outra função\n\nSol e Lua são luminares. ASC/MC são ângulos. Nodos, Lilith, Quíron e Parte da Fortuna são pontos, não planetas.\n\nOs regentes de casas dependem do signo na cúspide; não confundir “Casa 1 = Áries” como regra de cálculo.",
  "sources": []
 },
 "astrology/planets/jupiter": {
  "id": "astrology/planets/jupiter",
  "domain": "astrology",
  "title": "Júpiter",
  "content": "# Júpiter\n\n## Função simbólica\nexpansão, sentido, crença, estudo, generosidade\n\n## Regência associada\nSagitário\n\n## Associação tradicional de casa\nCasa 9\n\n## Interpretação em signo\nPerguntar: como a função de Júpiter se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Júpiter é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/mars": {
  "id": "astrology/planets/mars",
  "domain": "astrology",
  "title": "Marte",
  "content": "# Marte\n\n## Função simbólica\nação, desejo, iniciativa, assertividade, conflito\n\n## Regência associada\nÁries\n\n## Associação tradicional de casa\nCasa 1\n\n## Interpretação em signo\nPerguntar: como a função de Marte se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Marte é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/mercury": {
  "id": "astrology/planets/mercury",
  "domain": "astrology",
  "title": "Mercúrio",
  "content": "# Mercúrio\n\n## Função simbólica\npensamento, linguagem, aprendizagem, processamento de informação\n\n## Regência associada\nGêmeos/Virgem\n\n## Associação tradicional de casa\nCasa 3/6\n\n## Interpretação em signo\nPerguntar: como a função de Mercúrio se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Mercúrio é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/moon": {
  "id": "astrology/planets/moon",
  "domain": "astrology",
  "title": "Lua",
  "content": "# Lua\n\n## Função simbólica\nemoções, hábitos, necessidades de segurança, memória, receptividade\n\n## Regência associada\nCâncer\n\n## Associação tradicional de casa\nCasa 4\n\n## Interpretação em signo\nPerguntar: como a função de Lua se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Lua é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/neptune": {
  "id": "astrology/planets/neptune",
  "domain": "astrology",
  "title": "Netuno",
  "content": "# Netuno\n\n## Função simbólica\nimaginação, idealização, espiritualidade, dissolução de limites\n\n## Regência associada\nPeixes\n\n## Associação tradicional de casa\nCasa 12\n\n## Interpretação em signo\nPerguntar: como a função de Netuno se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Netuno é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/pluto": {
  "id": "astrology/planets/pluto",
  "domain": "astrology",
  "title": "Plutão",
  "content": "# Plutão\n\n## Função simbólica\ntransformação, poder, intensidade, regeneração\n\n## Regência associada\nEscorpião\n\n## Associação tradicional de casa\nCasa 8\n\n## Interpretação em signo\nPerguntar: como a função de Plutão se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Plutão é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/saturn": {
  "id": "astrology/planets/saturn",
  "domain": "astrology",
  "title": "Saturno",
  "content": "# Saturno\n\n## Função simbólica\nlimites, estrutura, responsabilidade, tempo, maturação\n\n## Regência associada\nCapricórnio\n\n## Associação tradicional de casa\nCasa 10\n\n## Interpretação em signo\nPerguntar: como a função de Saturno se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Saturno é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/sun": {
  "id": "astrology/planets/sun",
  "domain": "astrology",
  "title": "Sol",
  "content": "# Sol\n\n## Função simbólica\nidentidade, vitalidade, expressão central, vontade consciente\n\n## Regência associada\nLeão\n\n## Associação tradicional de casa\nCasa 5\n\n## Interpretação em signo\nPerguntar: como a função de Sol se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Sol é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/uranus": {
  "id": "astrology/planets/uranus",
  "domain": "astrology",
  "title": "Urano",
  "content": "# Urano\n\n## Função simbólica\nmudança, ruptura, inovação, independência\n\n## Regência associada\nAquário\n\n## Associação tradicional de casa\nCasa 11\n\n## Interpretação em signo\nPerguntar: como a função de Urano se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Urano é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/planets/venus": {
  "id": "astrology/planets/venus",
  "domain": "astrology",
  "title": "Vênus",
  "content": "# Vênus\n\n## Função simbólica\nafeto, atração, valores, prazer, reciprocidade, estética\n\n## Regência associada\nTouro/Libra\n\n## Associação tradicional de casa\nCasa 2/7\n\n## Interpretação em signo\nPerguntar: como a função de Vênus se manifesta através das qualidades do signo?\n\n## Interpretação em casa\nPerguntar: em que área de experiência essa função aparece?\n\n## Aspectos\nAspectos com outros planetas modificam a leitura. Não interpretar isoladamente.\n\n## Em relacionamentos\nVênus, Marte e Lua ganham destaque, mas o mapa completo deve ser considerado.\nPara sinastria, comparar contatos entre planetas e ângulos dos dois mapas.\n\n## Linguagem segura\n“Na tradição astrológica, Vênus é associado a...”\nNão transformar a associação em afirmação científica sobre personalidade.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm"
  ]
 },
 "astrology/signs/aquarius": {
  "id": "astrology/signs/aquarius",
  "domain": "astrology",
  "title": "Aquário",
  "content": "# Aquário\n\n## Classificação\n- Elemento: Ar\n- Modalidade: Fixo\n- Regente: Saturno/Urano\n\n## Temas simbólicos\nindependência, inovação, coletividade, ideias\n\n## Potenciais construtivos\nexperimentação, comunidade, originalidade, sistemas\n\n## Pontos de atenção\ndistanciamento, contrarianismo, rigidez intelectual, desapego excessivo\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/aries": {
  "id": "astrology/signs/aries",
  "domain": "astrology",
  "title": "Áries",
  "content": "# Áries\n\n## Classificação\n- Elemento: Fogo\n- Modalidade: Cardinal\n- Regente: Marte\n\n## Temas simbólicos\niniciativa, impulso, coragem, autonomia\n\n## Potenciais construtivos\nação, competição, começo, franqueza\n\n## Pontos de atenção\nimpulsividade, pressa, irritação, dificuldade com espera\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/cancer": {
  "id": "astrology/signs/cancer",
  "domain": "astrology",
  "title": "Câncer",
  "content": "# Câncer\n\n## Classificação\n- Elemento: Água\n- Modalidade: Cardinal\n- Regente: Lua\n\n## Temas simbólicos\nproteção, pertencimento, memória, cuidado\n\n## Potenciais construtivos\nfamília, intimidade, acolhimento, raízes\n\n## Pontos de atenção\ndefensividade, apego, oscilação emocional, fechamento\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/capricorn": {
  "id": "astrology/signs/capricorn",
  "domain": "astrology",
  "title": "Capricórnio",
  "content": "# Capricórnio\n\n## Classificação\n- Elemento: Terra\n- Modalidade: Cardinal\n- Regente: Saturno\n\n## Temas simbólicos\nestrutura, responsabilidade, ambição, maturidade\n\n## Potenciais construtivos\nplanejamento, carreira, disciplina, legado\n\n## Pontos de atenção\nrigidez, pessimismo, excesso de trabalho, autocobrança\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/gemini": {
  "id": "astrology/signs/gemini",
  "domain": "astrology",
  "title": "Gêmeos",
  "content": "# Gêmeos\n\n## Classificação\n- Elemento: Ar\n- Modalidade: Mutável\n- Regente: Mercúrio\n\n## Temas simbólicos\ncuriosidade, comunicação, variedade, conexão\n\n## Potenciais construtivos\naprendizado, conversa, mobilidade, adaptação\n\n## Pontos de atenção\ndispersão, superficialidade, excesso mental, indecisão\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/leo": {
  "id": "astrology/signs/leo",
  "domain": "astrology",
  "title": "Leão",
  "content": "# Leão\n\n## Classificação\n- Elemento: Fogo\n- Modalidade: Fixo\n- Regente: Sol\n\n## Temas simbólicos\nexpressão, criatividade, identidade, generosidade\n\n## Potenciais construtivos\nvisibilidade, liderança, criação, calor\n\n## Pontos de atenção\norgulho, necessidade de validação, dramatização, rigidez\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/libra": {
  "id": "astrology/signs/libra",
  "domain": "astrology",
  "title": "Libra",
  "content": "# Libra\n\n## Classificação\n- Elemento: Ar\n- Modalidade: Cardinal\n- Regente: Vênus\n\n## Temas simbólicos\nequilíbrio, relação, estética, negociação\n\n## Potenciais construtivos\nparceria, diplomacia, beleza, reciprocidade\n\n## Pontos de atenção\nindecisão, agradar demais, evitar conflitos, dependência de validação\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/pisces": {
  "id": "astrology/signs/pisces",
  "domain": "astrology",
  "title": "Peixes",
  "content": "# Peixes\n\n## Classificação\n- Elemento: Água\n- Modalidade: Mutável\n- Regente: Júpiter/Netuno\n\n## Temas simbólicos\nimaginação, empatia, transcendência, sensibilidade\n\n## Potenciais construtivos\narte, compaixão, espiritualidade, simbolismo\n\n## Pontos de atenção\nidealização, fuga, limites frágeis, confusão\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/sagittarius": {
  "id": "astrology/signs/sagittarius",
  "domain": "astrology",
  "title": "Sagitário",
  "content": "# Sagitário\n\n## Classificação\n- Elemento: Fogo\n- Modalidade: Mutável\n- Regente: Júpiter\n\n## Temas simbólicos\nexpansão, sentido, liberdade, exploração\n\n## Potenciais construtivos\nestudo, viagem, visão, aventura\n\n## Pontos de atenção\nexagero, imprudência, dogmatismo, prometer mais do que entrega\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/scorpio": {
  "id": "astrology/signs/scorpio",
  "domain": "astrology",
  "title": "Escorpião",
  "content": "# Escorpião\n\n## Classificação\n- Elemento: Água\n- Modalidade: Fixo\n- Regente: Marte/Plutão\n\n## Temas simbólicos\nintensidade, profundidade, transformação, confiança\n\n## Potenciais construtivos\ninvestigação, intimidade, regeneração, compromisso\n\n## Pontos de atenção\ncontrole, suspeita, obsessão, dificuldade de desapego\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/taurus": {
  "id": "astrology/signs/taurus",
  "domain": "astrology",
  "title": "Touro",
  "content": "# Touro\n\n## Classificação\n- Elemento: Terra\n- Modalidade: Fixo\n- Regente: Vênus\n\n## Temas simbólicos\nestabilidade, sensorialidade, valores, persistência\n\n## Potenciais construtivos\nrecursos, prazer, constância, construção\n\n## Pontos de atenção\nteimosia, apego, resistência a mudanças, materialismo\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/signs/virgo": {
  "id": "astrology/signs/virgo",
  "domain": "astrology",
  "title": "Virgem",
  "content": "# Virgem\n\n## Classificação\n- Elemento: Terra\n- Modalidade: Mutável\n- Regente: Mercúrio\n\n## Temas simbólicos\nanálise, aperfeiçoamento, utilidade, discernimento\n\n## Potenciais construtivos\norganização, serviço, técnica, melhoria\n\n## Pontos de atenção\nperfeccionismo, crítica excessiva, ansiedade por controle, hiper-análise\n\n## Amor\nEm leituras de relacionamento, observar como o signo se relaciona com Vênus, Lua, Marte,\nCasa 5, Casa 7 e aspectos. O signo solar sozinho não descreve compatibilidade.\n\n## Comunicação\nO signo descreve estilo simbólico; Mercúrio e seus aspectos devem ser consultados para\numa interpretação mais específica.\n\n## Manifestação/intenções\nUse o elemento e a modalidade como linguagem de reflexão, não como garantia de resultado.\n\n## Combinações\nInterpretar o signo junto de planeta + casa + aspecto. Evitar generalizações.",
  "sources": [
   "https://www.astro.com/astrology/in_intro_e.htm",
   "https://www.skyscript.co.uk/begin5.html"
  ]
 },
 "astrology/synastry": {
  "id": "astrology/synastry",
  "domain": "astrology",
  "title": "Sinastria / mapa do casal",
  "content": "# Sinastria / mapa do casal\n\n## Objetivo\nComparar dois mapas para identificar contatos simbólicos entre planetas e ângulos.\n\n## Dados\nPara cada pessoa:\n- data\n- hora\n- local\n- posições planetárias\n- casas\n- ASC/MC se a hora for conhecida.\n\n## Contatos relevantes\n- Sol–Lua\n- Sol–Vênus\n- Sol–Marte\n- Lua–Vênus\n- Lua–Marte\n- Mercúrio–Mercúrio\n- Mercúrio–Vênus\n- Mercúrio–Marte\n- Vênus–Marte\n- Saturno com luminares/Vênus/Marte\n- Júpiter com planetas pessoais\n- contatos com ASC/Desc/MC/IC\n- sobreposição de planetas nas casas do outro.\n\n## Regra de interpretação\nNão gerar “compatibilidade 92%” como se fosse medida científica. Produzir dimensões:\n- afinidades\n- facilidades\n- diferenças\n- pontos de tensão\n- comunicação\n- afeto\n- desejo\n- limites\n- crescimento\n- perguntas para reflexão.\n\nA IA recebe os aspectos já calculados.",
  "sources": []
 },
 "dreams/methodology": {
  "id": "dreams/methodology",
  "domain": "dreams",
  "title": "Sonhos — metodologia",
  "content": "# Sonhos — metodologia\n\n## Objetivo\nA ferramenta transforma relatos de sonhos em uma experiência de reflexão simbólica.\n\n## Não fazer\n- diagnóstico\n- previsão\n- afirmação de que um símbolo tem um único significado universal\n- afirmar que o sonho revela objetivamente um trauma ou doença.\n\n## Pipeline\n1. usuário escreve o sonho;\n2. usuário escolhe emoções;\n3. sistema extrai possíveis símbolos;\n4. busca associações da KB;\n5. IA sintetiza interpretações possíveis;\n6. IA termina com perguntas de reflexão.\n\n## Contexto é obrigatório\nO mesmo símbolo pode significar coisas diferentes para pessoas diferentes.\nPriorizar:\n- emoções do usuário\n- acontecimentos recentes relatados\n- contexto do sonho\n- relações entre símbolos.",
  "sources": [
   "https://dictionary.apa.org/dream-analysis"
  ]
 },
 "dreams/symbols/animal": {
  "id": "dreams/symbols/animal",
  "domain": "dreams",
  "title": "Animal",
  "content": "# Animal\n\n## Associações possíveis\ninstinto, associação pessoal, comportamento observado no animal; evitar dicionário universal\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/baby": {
  "id": "dreams/symbols/baby",
  "domain": "dreams",
  "title": "Baby",
  "content": "# Baby\n\n## Associações possíveis\nnovo projeto, vulnerabilidade, cuidado ou início simbólico\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/being-chased": {
  "id": "dreams/symbols/being-chased",
  "domain": "dreams",
  "title": "Being Chased",
  "content": "# Being Chased\n\n## Associações possíveis\nevitação, pressão, conflito ou sensação de ameaça; perguntar o que o usuário sente estar evitando\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/death": {
  "id": "dreams/symbols/death",
  "domain": "dreams",
  "title": "Death",
  "content": "# Death\n\n## Associações possíveis\nencerramento simbólico, mudança, medo ou perda; nunca interpretar automaticamente como morte literal\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/door": {
  "id": "dreams/symbols/door",
  "domain": "dreams",
  "title": "Door",
  "content": "# Door\n\n## Associações possíveis\nlimiar, escolha, oportunidade, separação entre espaços ou mudança\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/falling": {
  "id": "dreams/symbols/falling",
  "domain": "dreams",
  "title": "Falling",
  "content": "# Falling\n\n## Associações possíveis\nperda de controle percebida, transição, insegurança ou sensação corporal; não tratar como previsão\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/fire": {
  "id": "dreams/symbols/fire",
  "domain": "dreams",
  "title": "Fire",
  "content": "# Fire\n\n## Associações possíveis\nenergia, destruição, transformação, paixão ou risco; contexto determina leitura\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/flying": {
  "id": "dreams/symbols/flying",
  "domain": "dreams",
  "title": "Flying",
  "content": "# Flying\n\n## Associações possíveis\nliberdade, perspectiva, expansão ou perda de contato com o chão; explorar emoção associada\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/house": {
  "id": "dreams/symbols/house",
  "domain": "dreams",
  "title": "House",
  "content": "# House\n\n## Associações possíveis\nself, vida privada, estrutura interna ou contexto familiar; detalhes do cômodo importam\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/journey": {
  "id": "dreams/symbols/journey",
  "domain": "dreams",
  "title": "Journey",
  "content": "# Journey\n\n## Associações possíveis\ntransição, busca, desenvolvimento, direção; observar destino e obstáculos\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/lost": {
  "id": "dreams/symbols/lost",
  "domain": "dreams",
  "title": "Lost",
  "content": "# Lost\n\n## Associações possíveis\nincerteza, falta de direção, transição ou sobrecarga\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/mirror": {
  "id": "dreams/symbols/mirror",
  "domain": "dreams",
  "title": "Mirror",
  "content": "# Mirror\n\n## Associações possíveis\nautoimagem, percepção, identidade ou confronto com aspecto próprio\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/money": {
  "id": "dreams/symbols/money",
  "domain": "dreams",
  "title": "Money",
  "content": "# Money\n\n## Associações possíveis\nvalor, segurança, troca, autoestima ou preocupação material\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/mountain": {
  "id": "dreams/symbols/mountain",
  "domain": "dreams",
  "title": "Mountain",
  "content": "# Mountain\n\n## Associações possíveis\nobstáculo, objetivo, perspectiva, esforço ou estabilidade\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/ocean": {
  "id": "dreams/symbols/ocean",
  "domain": "dreams",
  "title": "Ocean",
  "content": "# Ocean\n\n## Associações possíveis\nvastidão emocional, desconhecido, profundidade e possibilidade\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/rain": {
  "id": "dreams/symbols/rain",
  "domain": "dreams",
  "title": "Rain",
  "content": "# Rain\n\n## Associações possíveis\nliberação, tristeza, renovação ou atmosfera emocional\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/school": {
  "id": "dreams/symbols/school",
  "domain": "dreams",
  "title": "School",
  "content": "# School\n\n## Associações possíveis\naprendizado, avaliação, memória, comparação ou desempenho\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/snake": {
  "id": "dreams/symbols/snake",
  "domain": "dreams",
  "title": "Snake",
  "content": "# Snake\n\n## Associações possíveis\ntransformação, ameaça percebida, instinto, cura simbólica em algumas tradições; perguntar qual associação pessoal o usuário tem com cobras\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/teeth": {
  "id": "dreams/symbols/teeth",
  "domain": "dreams",
  "title": "Teeth",
  "content": "# Teeth\n\n## Associações possíveis\nvulnerabilidade, imagem, comunicação ou ansiedade; investigar contexto em vez de impor significado\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "dreams/symbols/water": {
  "id": "dreams/symbols/water",
  "domain": "dreams",
  "title": "Water",
  "content": "# Water\n\n## Associações possíveis\nemoção, profundidade, fluidez, contexto emocional; observar se a água estava calma, agitada, limpa ou ameaçadora\n\n## Perguntas\n- Que emoção apareceu quando esse símbolo surgiu?\n- O que esse símbolo significa pessoalmente para você?\n- Existe algo recente que tenha uma sensação parecida?\n- O símbolo mudou durante o sonho?\n\n## Regra\nEsta é uma associação reflexiva, não uma definição universal ou diagnóstico.",
  "sources": []
 },
 "moon/methodology": {
  "id": "moon/methodology",
  "domain": "moon",
  "title": "Lua — metodologia",
  "content": "# Lua — metodologia\n\n## Astronomia\nNASA descreve oito fases principais:\n1. Lua Nova\n2. Crescente\n3. Quarto Crescente\n4. Gibosa Crescente\n5. Lua Cheia\n6. Gibosa Minguante\n7. Quarto Minguante\n8. Minguante\n\nUm ciclo de uma Lua Nova à próxima dura aproximadamente 29,5 dias.\nA órbita sideral é aproximadamente 27,3 dias; não confundir os dois períodos.\n\n## Produto\nDados astronômicos devem ser calculados/consultados pelo sistema.\n\n## Astrologia lunar\nLua em signo pode ser usada como interpretação simbólica, seguindo a metodologia astrológica principal do produto.\n\n## Ritual/jornada\nQualquer recomendação de “ritual” deve ser apresentada como prática opcional de reflexão, journaling ou intenção.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "moon/phases/first-quarter": {
  "id": "moon/phases/first-quarter",
  "domain": "moon",
  "title": "Quarto Crescente",
  "content": "# Quarto Crescente\n\n## Astronomia\nEsta é uma fase do ciclo lunar observável.\n\n## Uso simbólico no produto\ndecisão, ação, ajuste, superar resistência\n\n## Prática\nSugerir journaling, revisão de objetivos, gratidão ou planejamento conforme o tema.\n\n## Nota\nA interpretação simbólica não é uma propriedade física da Lua e não deve ser apresentada como causalidade científica.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "moon/phases/full-moon": {
  "id": "moon/phases/full-moon",
  "domain": "moon",
  "title": "Lua Cheia",
  "content": "# Lua Cheia\n\n## Astronomia\nEsta é uma fase do ciclo lunar observável.\n\n## Uso simbólico no produto\nvisibilidade simbólica, culminação, observação, gratidão\n\n## Prática\nSugerir journaling, revisão de objetivos, gratidão ou planejamento conforme o tema.\n\n## Nota\nA interpretação simbólica não é uma propriedade física da Lua e não deve ser apresentada como causalidade científica.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "moon/phases/last-quarter": {
  "id": "moon/phases/last-quarter",
  "domain": "moon",
  "title": "Quarto Minguante",
  "content": "# Quarto Minguante\n\n## Astronomia\nEsta é uma fase do ciclo lunar observável.\n\n## Uso simbólico no produto\nrevisão, desapego, reorganização\n\n## Prática\nSugerir journaling, revisão de objetivos, gratidão ou planejamento conforme o tema.\n\n## Nota\nA interpretação simbólica não é uma propriedade física da Lua e não deve ser apresentada como causalidade científica.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "moon/phases/new-moon": {
  "id": "moon/phases/new-moon",
  "domain": "moon",
  "title": "Lua Nova",
  "content": "# Lua Nova\n\n## Astronomia\nEsta é uma fase do ciclo lunar observável.\n\n## Uso simbólico no produto\ninício simbólico, intenção, pausa, definição de direção\n\n## Prática\nSugerir journaling, revisão de objetivos, gratidão ou planejamento conforme o tema.\n\n## Nota\nA interpretação simbólica não é uma propriedade física da Lua e não deve ser apresentada como causalidade científica.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "moon/phases/waning-crescent": {
  "id": "moon/phases/waning-crescent",
  "domain": "moon",
  "title": "Minguante",
  "content": "# Minguante\n\n## Astronomia\nEsta é uma fase do ciclo lunar observável.\n\n## Uso simbólico no produto\ndescanso, encerramento, silêncio, preparação para novo ciclo\n\n## Prática\nSugerir journaling, revisão de objetivos, gratidão ou planejamento conforme o tema.\n\n## Nota\nA interpretação simbólica não é uma propriedade física da Lua e não deve ser apresentada como causalidade científica.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "moon/phases/waning-gibbous": {
  "id": "moon/phases/waning-gibbous",
  "domain": "moon",
  "title": "Gibosa Minguante",
  "content": "# Gibosa Minguante\n\n## Astronomia\nEsta é uma fase do ciclo lunar observável.\n\n## Uso simbólico no produto\nintegração, avaliação, compartilhamento, aprendizado\n\n## Prática\nSugerir journaling, revisão de objetivos, gratidão ou planejamento conforme o tema.\n\n## Nota\nA interpretação simbólica não é uma propriedade física da Lua e não deve ser apresentada como causalidade científica.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "moon/phases/waxing-crescent": {
  "id": "moon/phases/waxing-crescent",
  "domain": "moon",
  "title": "Crescente",
  "content": "# Crescente\n\n## Astronomia\nEsta é uma fase do ciclo lunar observável.\n\n## Uso simbólico no produto\ndesenvolvimento, pequenos passos, experimentação\n\n## Prática\nSugerir journaling, revisão de objetivos, gratidão ou planejamento conforme o tema.\n\n## Nota\nA interpretação simbólica não é uma propriedade física da Lua e não deve ser apresentada como causalidade científica.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "moon/phases/waxing-gibbous": {
  "id": "moon/phases/waxing-gibbous",
  "domain": "moon",
  "title": "Gibosa Crescente",
  "content": "# Gibosa Crescente\n\n## Astronomia\nEsta é uma fase do ciclo lunar observável.\n\n## Uso simbólico no produto\nrefinamento, preparação, aperfeiçoamento\n\n## Prática\nSugerir journaling, revisão de objetivos, gratidão ou planejamento conforme o tema.\n\n## Nota\nA interpretação simbólica não é uma propriedade física da Lua e não deve ser apresentada como causalidade científica.",
  "sources": [
   "https://science.nasa.gov/moon/moon-phases/"
  ]
 },
 "numerology/calculations/expression": {
  "id": "numerology/calculations/expression",
  "domain": "numerology",
  "title": "Número de Expressão",
  "content": "# Número de Expressão\n\n## Definição\ncalculado a partir do nome completo segundo a tabela pitagórica; associado à maneira de expressar capacidades\n\n## Implementação\nA função de cálculo deve ser determinística, testável e versionada.\n\n## Saída mínima\n- value\n- raw_components\n- reduced_components\n- methodology\n- methodology_version\n\n## Interpretação\nConsultar a KB do número correspondente e sintetizar com o contexto do usuário.\n\n## Limite\nNão transformar o resultado em previsão garantida.",
  "sources": []
 },
 "numerology/calculations/life-path": {
  "id": "numerology/calculations/life-path",
  "domain": "numerology",
  "title": "Caminho de Vida / Número de Destino",
  "content": "# Caminho de Vida / Número de Destino\n\n## Definição\ncalculado a partir da data de nascimento; representa um eixo simbólico de temas de vida\n\n## Implementação\nA função de cálculo deve ser determinística, testável e versionada.\n\n## Saída mínima\n- value\n- raw_components\n- reduced_components\n- methodology\n- methodology_version\n\n## Interpretação\nConsultar a KB do número correspondente e sintetizar com o contexto do usuário.\n\n## Limite\nNão transformar o resultado em previsão garantida.",
  "sources": []
 },
 "numerology/calculations/personal-year": {
  "id": "numerology/calculations/personal-year",
  "domain": "numerology",
  "title": "Ano Pessoal",
  "content": "# Ano Pessoal\n\n## Definição\nciclo anual simbólico calculado a partir de dia/mês de nascimento + ano universal conforme método escolhido\n\n## Implementação\nA função de cálculo deve ser determinística, testável e versionada.\n\n## Saída mínima\n- value\n- raw_components\n- reduced_components\n- methodology\n- methodology_version\n\n## Interpretação\nConsultar a KB do número correspondente e sintetizar com o contexto do usuário.\n\n## Limite\nNão transformar o resultado em previsão garantida.",
  "sources": []
 },
 "numerology/calculations/personality": {
  "id": "numerology/calculations/personality",
  "domain": "numerology",
  "title": "Número da Personalidade",
  "content": "# Número da Personalidade\n\n## Definição\ncalculado tradicionalmente a partir das consoantes; associado à impressão/expressão externa\n\n## Implementação\nA função de cálculo deve ser determinística, testável e versionada.\n\n## Saída mínima\n- value\n- raw_components\n- reduced_components\n- methodology\n- methodology_version\n\n## Interpretação\nConsultar a KB do número correspondente e sintetizar com o contexto do usuário.\n\n## Limite\nNão transformar o resultado em previsão garantida.",
  "sources": []
 },
 "numerology/calculations/soul-urge": {
  "id": "numerology/calculations/soul-urge",
  "domain": "numerology",
  "title": "Número da Alma",
  "content": "# Número da Alma\n\n## Definição\ncalculado tradicionalmente a partir das vogais; associado a desejos e motivações internas\n\n## Implementação\nA função de cálculo deve ser determinística, testável e versionada.\n\n## Saída mínima\n- value\n- raw_components\n- reduced_components\n- methodology\n- methodology_version\n\n## Interpretação\nConsultar a KB do número correspondente e sintetizar com o contexto do usuário.\n\n## Limite\nNão transformar o resultado em previsão garantida.",
  "sources": []
 },
 "numerology/methodology": {
  "id": "numerology/methodology",
  "domain": "numerology",
  "title": "Numerologia — metodologia v1",
  "content": "# Numerologia — metodologia v1\n\n## Sistema\nNumerologia ocidental de matriz pitagórica.\n\n## Regra de produto\nNão chamar uma metodologia específica de “a verdadeira numerologia”. Há escolas diferentes.\n\n## Redução\nUma função de redução deve ser parametrizada:\n- reduzir números compostos\n- preservar 11, 22, 33 quando a regra do cálculo exigir\n- registrar a metodologia usada.\n\n## Caminho de vida / número de destino\nPara o método de 3 ciclos:\n1. reduzir mês conforme regra;\n2. reduzir dia conforme regra, preservando mestre quando aplicável;\n3. reduzir ano;\n4. somar os resultados;\n5. reduzir o resultado final conforme regra, preservando mestre.\n\n## Nome\nPara cálculos baseados em nome, criar tabela explícita de letras → números e normalização de acentos.\nNão apagar acentos de forma inconsistente.\n\n## Dados\nCada resultado deve guardar:\n- method\n- method_version\n- input_hash\n- calculated_at\n\n## Linguagem\nUsar “na numerologia, este número é associado a...”.\nNão apresentar como diagnóstico científico.",
  "sources": [
   "https://numology.io/methodology"
  ]
 },
 "numerology/numbers/1": {
  "id": "numerology/numbers/1",
  "domain": "numerology",
  "title": "Número 1",
  "content": "# Número 1\n\n## Temas\niniciativa, autonomia, liderança, individualidade\n\n## Expressão construtiva\npode se expressar como iniciativa e vontade de começar\n\n## Pontos de atenção\nego, impaciência, isolamento, excesso de controle\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/11": {
  "id": "numerology/numbers/11",
  "domain": "numerology",
  "title": "Número 11",
  "content": "# Número 11\n\n## Temas\nintuição, inspiração, percepção simbólica, visão\n\n## Expressão construtiva\nsensibilidade e ideias inspiradoras\n\n## Pontos de atenção\nsobrecarga, ansiedade, idealização\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/2": {
  "id": "numerology/numbers/2",
  "domain": "numerology",
  "title": "Número 2",
  "content": "# Número 2\n\n## Temas\ncooperação, sensibilidade, parceria, receptividade\n\n## Expressão construtiva\natenção a relações, diplomacia e equilíbrio\n\n## Pontos de atenção\ndependência, indecisão, hipersensibilidade\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/22": {
  "id": "numerology/numbers/22",
  "domain": "numerology",
  "title": "Número 22",
  "content": "# Número 22\n\n## Temas\nconstrução em grande escala, visão prática, organização\n\n## Expressão construtiva\ntransformar visão em estrutura\n\n## Pontos de atenção\npeso de responsabilidade, perfeccionismo\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/3": {
  "id": "numerology/numbers/3",
  "domain": "numerology",
  "title": "Número 3",
  "content": "# Número 3\n\n## Temas\nexpressão, criatividade, sociabilidade, comunicação\n\n## Expressão construtiva\nlinguagem, arte, humor e criatividade\n\n## Pontos de atenção\ndispersão, superficialidade, busca de aprovação\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/33": {
  "id": "numerology/numbers/33",
  "domain": "numerology",
  "title": "Número 33",
  "content": "# Número 33\n\n## Temas\ncuidado, ensino, compaixão, serviço\n\n## Expressão construtiva\nexpressão de cuidado e orientação\n\n## Pontos de atenção\nsacrifício excessivo, salvacionismo\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/4": {
  "id": "numerology/numbers/4",
  "domain": "numerology",
  "title": "Número 4",
  "content": "# Número 4\n\n## Temas\nestrutura, disciplina, método, construção\n\n## Expressão construtiva\norganização e consistência\n\n## Pontos de atenção\nrigidez, excesso de controle, resistência\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/5": {
  "id": "numerology/numbers/5",
  "domain": "numerology",
  "title": "Número 5",
  "content": "# Número 5\n\n## Temas\nliberdade, mudança, experiência, movimento\n\n## Expressão construtiva\ncuriosidade, flexibilidade, exploração\n\n## Pontos de atenção\ninquietação, impulsividade, dificuldade com compromisso\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/6": {
  "id": "numerology/numbers/6",
  "domain": "numerology",
  "title": "Número 6",
  "content": "# Número 6\n\n## Temas\ncuidado, responsabilidade, vínculo, harmonia\n\n## Expressão construtiva\nfamília, proteção, serviço e estética\n\n## Pontos de atenção\ncobrança, controle afetivo, excesso de responsabilidade\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/7": {
  "id": "numerology/numbers/7",
  "domain": "numerology",
  "title": "Número 7",
  "content": "# Número 7\n\n## Temas\ninvestigação, introspecção, conhecimento, espiritualidade\n\n## Expressão construtiva\nestudo, profundidade e busca de sentido\n\n## Pontos de atenção\nisolamento, ceticismo excessivo, ruminação\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/8": {
  "id": "numerology/numbers/8",
  "domain": "numerology",
  "title": "Número 8",
  "content": "# Número 8\n\n## Temas\ngestão, poder, realização, recursos, estratégia\n\n## Expressão construtiva\nliderança material e administração\n\n## Pontos de atenção\ncontrole, obsessão por status, dureza\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "numerology/numbers/9": {
  "id": "numerology/numbers/9",
  "domain": "numerology",
  "title": "Número 9",
  "content": "# Número 9\n\n## Temas\ncompaixão, conclusão, visão ampla, serviço\n\n## Expressão construtiva\nhumanitarismo, encerramento de ciclos, generosidade\n\n## Pontos de atenção\nmartírio, dificuldade de desapego, idealização\n\n## Amor\nUse como linguagem de reflexão sobre necessidades e padrões; nunca como sentença de compatibilidade.\n\n## Trabalho/propósito\nUse para gerar perguntas sobre talentos percebidos e preferências, não para prever carreira.\n\n## Pergunta de journaling\n“Como os temas associados a este número aparecem — ou não aparecem — na minha experiência atual?”\n\n## Nota metodológica\nNúmeros mestres 11, 22 e 33 devem ser preservados apenas nos cálculos em que a metodologia adotada determinar.",
  "sources": []
 },
 "tarot/major-arcana/00-the-fool": {
  "id": "tarot/major-arcana/00-the-fool",
  "domain": "tarot",
  "title": "00 — The Fool (O Louco)",
  "content": "# 00 — The Fool (O Louco)\n\n## Palavras-chave\nnovos começos, abertura, espontaneidade, confiança no caminho\n\n## Expressão reversa / bloqueada\nimprudência, salto sem olhar, medo de começar, adiamento por excesso de cautela\n\n## Leitura geral\nO Louco é o primeiro passo antes de qualquer certeza. A figura caminha leve, perto da borda, com pouca bagagem: fala de curiosidade, de disposição para o novo e de aprender fazendo. Na tradição, é a carta do início da jornada, quando ainda não se sabe tudo e isso não impede o movimento.\n\n## Amor\nAbertura para conhecer alguém ou para olhar uma relação com olhos de novidade. Pode sugerir leveza, vontade de experimentar e menos roteiro pronto. Vale observar se a liberdade desejada cabe no vínculo ou se está servindo para evitar compromisso.\n\n## Trabalho/propósito\nMomento de testar uma ideia, mudar de área ou começar um projeto sem ter o mapa completo. A carta favorece o primeiro passo pequeno e reversível, mais do que a aposta total.\n\n## Autoconhecimento\nConvida a reconhecer onde você se permite começar sem garantias e onde o medo de errar trava tudo. Também mostra a diferença entre confiar e ignorar sinais.\n\n## Reversa\nInvertida, a energia do começo pode virar pressa sem direção ou, ao contrário, paralisia. Pergunte se o salto está sem preparo mínimo ou se a cautela já virou desculpa para não sair do lugar.\n\n## Ação/reflexão\nEscolha uma coisa nova e pequena para experimentar nesta semana, com prazo curto. No fim, anote o que aprendeu, não só o resultado.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/01-the-magician": {
  "id": "tarot/major-arcana/01-the-magician",
  "domain": "tarot",
  "title": "01 — The Magician (O Mago)",
  "content": "# 01 — The Magician (O Mago)\n\n## Palavras-chave\niniciativa, habilidade, foco, transformar ideia em ação\n\n## Expressão reversa / bloqueada\ndispersão, talento parado, manipulação, promessa sem entrega\n\n## Leitura geral\nO Mago tem sobre a mesa os quatro elementos do baralho: tudo de que precisa já está ao alcance. A carta fala de concentrar intenção e recursos para fazer algo acontecer. Na tradição, é o canal entre o que se imagina e o que se concretiza.\n\n## Amor\nComunicação clara e iniciativa: dizer o que se quer, propor, dar o primeiro passo. Pede atenção à coerência entre palavra e gesto, para que o charme não substitua a presença real.\n\n## Trabalho/propósito\nBoa carta para apresentar um projeto, vender uma ideia ou começar algo com as ferramentas que já existem. O ponto é escolher um foco e usar o que está disponível, em vez de esperar o cenário ideal.\n\n## Autoconhecimento\nAjuda a reconhecer habilidades que você subestima e a perceber onde a energia se espalha em muitas frentes.\n\n## Reversa\nInvertida, pode indicar energia dispersa, talento que não chega a sair do papel ou uso da habilidade para convencer mais do que para construir. Vale conferir se há intenção clara por trás do esforço.\n\n## Ação/reflexão\nListe quatro recursos que você já tem (um conhecimento, uma pessoa, um objeto, um tempo livre) e use dois deles numa ação concreta hoje.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/02-the-high-priestess": {
  "id": "tarot/major-arcana/02-the-high-priestess",
  "domain": "tarot",
  "title": "02 — The High Priestess (A Sacerdotisa)",
  "content": "# 02 — The High Priestess (A Sacerdotisa)\n\n## Palavras-chave\nintuição, silêncio, conhecimento interior, mistério\n\n## Expressão reversa / bloqueada\ndesconexão da intuição, segredos, excesso de recolhimento, ignorar o que se sente\n\n## Leitura geral\nA Sacerdotisa guarda o véu entre o que se vê e o que se pressente. É a carta da escuta interna, da paciência e do saber que não vem por argumento. Na tradição, aponta que nem tudo precisa ser resolvido agora: algumas respostas amadurecem no silêncio.\n\n## Amor\nSugere observar mais do que agir: perceber o que não está sendo dito, respeitar o próprio ritmo e o do outro. Pode indicar uma conexão profunda, porém reservada.\n\n## Trabalho/propósito\nMomento de estudar, pesquisar e ouvir antes de decidir. A carta favorece trabalhos de análise, escuta e cuidado com informações sensíveis.\n\n## Autoconhecimento\nConvida a confiar na percepção sutil e a distinguir intuição de ansiedade. A pergunta é: o que você já sabe e ainda não admitiu?\n\n## Reversa\nInvertida, pode mostrar desconexão do que se sente, segredos que pesam ou um recolhimento que virou isolamento. Também pode pedir que algo guardado seja finalmente nomeado.\n\n## Ação/reflexão\nReserve dez minutos em silêncio, sem tela, e escreva a primeira resposta que vier para a sua pergunta. Releia no dia seguinte.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/03-the-empress": {
  "id": "tarot/major-arcana/03-the-empress",
  "domain": "tarot",
  "title": "03 — The Empress (A Imperatriz)",
  "content": "# 03 — The Empress (A Imperatriz)\n\n## Palavras-chave\nfertilidade criativa, cuidado, abundância, prazer dos sentidos\n\n## Expressão reversa / bloqueada\ndescuido de si, dependência, excesso de doação, bloqueio criativo\n\n## Leitura geral\nA Imperatriz está cercada de natureza que cresce: é a carta do que floresce com tempo, cuidado e prazer. Fala de nutrir, criar e receber. Na tradição, representa a força generativa, aquilo que transforma semente em colheita.\n\n## Amor\nAfeto que se expressa em cuidado, toque, presença e conforto. Pode falar de uma fase mais calorosa, ou do convite para cuidar de si com a mesma dedicação oferecida ao outro.\n\n## Trabalho/propósito\nBoa carta para projetos criativos e para tudo que precisa de cultivo contínuo. Indica crescimento orgânico, não forçado.\n\n## Autoconhecimento\nConvida a perceber como você se nutre: corpo, descanso, beleza, prazer. Também pergunta onde o cuidado com os outros apagou o cuidado consigo.\n\n## Reversa\nInvertida, pode indicar criatividade travada, autocuidado esquecido ou cuidado que virou controle. Observe se você está dando mais do que tem.\n\n## Ação/reflexão\nFaça hoje algo só pelo prazer dos sentidos (uma refeição feita com calma, um banho demorado, uma caminhada ao ar livre) e repare no efeito no seu humor.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/04-the-emperor": {
  "id": "tarot/major-arcana/04-the-emperor",
  "domain": "tarot",
  "title": "04 — The Emperor (O Imperador)",
  "content": "# 04 — The Emperor (O Imperador)\n\n## Palavras-chave\nestrutura, liderança, limites, responsabilidade\n\n## Expressão reversa / bloqueada\nrigidez, autoritarismo, falta de limites, dificuldade com regras\n\n## Leitura geral\nO Imperador está firme no trono de pedra: é a carta da ordem, do planejamento e da autoridade que protege. Fala de criar estrutura para que algo dure. Na tradição, representa o princípio que organiza o mundo.\n\n## Amor\nPede clareza de compromisso, limites saudáveis e estabilidade. Vale observar se a relação tem segurança ou se o controle ocupou o lugar do cuidado.\n\n## Trabalho/propósito\nFavorece organização, liderança, contratos e planejamento de longo prazo. É hora de assumir o comando do que é seu.\n\n## Autoconhecimento\nAjuda a olhar sua relação com regras e autoridade: as que você cria, as que respeita e as que talvez precise rever.\n\n## Reversa\nInvertida, a estrutura pode endurecer em rigidez ou faltar por completo. Pergunte se há controle demais ou responsabilidade de menos.\n\n## Ação/reflexão\nDefina uma regra simples para a sua semana (um horário, um limite, uma rotina) e cumpra por sete dias.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/05-the-hierophant": {
  "id": "tarot/major-arcana/05-the-hierophant",
  "domain": "tarot",
  "title": "05 — The Hierophant (O Hierofante)",
  "content": "# 05 — The Hierophant (O Hierofante)\n\n## Palavras-chave\ntradição, ensino, valores, pertencimento\n\n## Expressão reversa / bloqueada\ndogmatismo, conformismo, rebeldia sem rumo, questionamento das regras\n\n## Leitura geral\nO Hierofante ensina diante de dois discípulos: é a carta da transmissão de saberes, dos rituais e das instituições. Fala de aprender com quem veio antes e de encontrar sentido em valores compartilhados.\n\n## Amor\nRelações com valores em comum, compromissos formais e a influência da família ou da cultura. Pode pedir conversa sobre o que cada pessoa considera essencial.\n\n## Trabalho/propósito\nBom momento para estudar com alguém experiente, buscar formação ou seguir um método testado. Também pode indicar trabalho em instituições.\n\n## Autoconhecimento\nConvida a separar as crenças que você escolheu das que apenas herdou.\n\n## Reversa\nInvertida, pode indicar necessidade de questionar regras que já não servem, ou conformismo que impede caminho próprio. Também pode mostrar rebeldia que só reage, sem propor.\n\n## Ação/reflexão\nEscreva três valores que guiam suas decisões. Ao lado de cada um, anote de onde ele veio e se ainda faz sentido.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/06-the-lovers": {
  "id": "tarot/major-arcana/06-the-lovers",
  "domain": "tarot",
  "title": "06 — The Lovers (Os Enamorados)",
  "content": "# 06 — The Lovers (Os Enamorados)\n\n## Palavras-chave\nescolha, união, alinhamento de valores, afinidade\n\n## Expressão reversa / bloqueada\ndesalinhamento, indecisão, escolha evitada, relação desequilibrada\n\n## Leitura geral\nOs Enamorados mostram duas figuras sob uma presença que as abençoa: é a carta do encontro e, sobretudo, da escolha. Fala de decidir de acordo com o que se valoriza de verdade. Na tradição, une amor e consciência.\n\n## Amor\nAfinidade, atração e o convite a uma escolha consciente. Pede honestidade sobre o que cada pessoa quer, e não só sobre o que sente.\n\n## Trabalho/propósito\nPode indicar parcerias, sociedades ou a decisão entre dois caminhos. A carta pergunta qual opção está mais alinhada com seus valores.\n\n## Autoconhecimento\nAjuda a perceber se suas escolhas refletem o que você acredita ou o que esperam de você.\n\n## Reversa\nInvertida, pode apontar desalinhamento entre o que se diz e o que se faz, indecisão prolongada ou uma relação em que só uma parte escolhe.\n\n## Ação/reflexão\nDiante de uma decisão, escreva os dois caminhos e, para cada um, o valor pessoal que ele honra. Escolha pelo valor, não pelo medo.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/07-the-chariot": {
  "id": "tarot/major-arcana/07-the-chariot",
  "domain": "tarot",
  "title": "07 — The Chariot (O Carro)",
  "content": "# 07 — The Chariot (O Carro)\n\n## Palavras-chave\ndeterminação, direção, avanço, autocontrole\n\n## Expressão reversa / bloqueada\nfalta de direção, forças em conflito, pressa, perda de controle\n\n## Leitura geral\nO Carro avança puxado por duas esfinges de cores opostas: é a carta de conduzir forças diferentes na mesma direção. Fala de vontade, foco e movimento. Na tradição, representa a vitória que vem do domínio de si.\n\n## Amor\nIniciativa e decisão para fazer a relação andar. Pede alinhamento: as duas pessoas querem ir para o mesmo lugar?\n\n## Trabalho/propósito\nFase de avanço, metas claras e esforço concentrado. Bom para mudanças, viagens e projetos que exigem disciplina.\n\n## Autoconhecimento\nMostra como você lida com impulsos opostos dentro de si e se consegue manter o rumo sem atropelar ninguém.\n\n## Reversa\nInvertida, pode indicar energia sem direção, metas em conflito ou pressa que tira o controle. Vale desacelerar para recuperar o rumo.\n\n## Ação/reflexão\nEscolha uma meta para os próximos sete dias e escreva o único passo diário que leva até ela.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/08-strength": {
  "id": "tarot/major-arcana/08-strength",
  "domain": "tarot",
  "title": "08 — Strength (A Força)",
  "content": "# 08 — Strength (A Força)\n\n## Palavras-chave\ncoragem gentil, paciência, autodomínio, compaixão\n\n## Expressão reversa / bloqueada\ninsegurança, impulsividade, força bruta, autocrítica\n\n## Leitura geral\nA Força mostra uma figura que acalma um leão com as mãos, sem luta. É a carta da coragem que não precisa de violência: firmeza, paciência e compaixão. Na tradição, fala de lidar com instintos sem negá-los.\n\n## Amor\nPaciência e ternura para atravessar fases difíceis. A carta valoriza a firmeza calma, que acolhe sem se anular.\n\n## Trabalho/propósito\nIndica persistência e capacidade de lidar com pressão sem perder a cabeça. Liderar pelo exemplo, não pelo grito.\n\n## Autoconhecimento\nConvida a perceber como você trata seus próprios impulsos e medos: com dureza ou com firmeza gentil.\n\n## Reversa\nInvertida, pode indicar insegurança, explosões ou uma autocrítica dura demais. A força está fora de equilíbrio, para mais ou para menos.\n\n## Ação/reflexão\nNa próxima situação que te irritar, respire três vezes antes de responder e observe o que muda.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/09-the-hermit": {
  "id": "tarot/major-arcana/09-the-hermit",
  "domain": "tarot",
  "title": "09 — The Hermit (O Eremita)",
  "content": "# 09 — The Hermit (O Eremita)\n\n## Palavras-chave\nrecolhimento, busca interior, sabedoria, orientação\n\n## Expressão reversa / bloqueada\nisolamento, solidão excessiva, fuga, recusa de ajuda\n\n## Leitura geral\nO Eremita caminha sozinho com uma lanterna: é a carta da pausa para enxergar melhor. Fala de introspecção, estudo e da sabedoria que vem da experiência. Na tradição, a luz que ele carrega também orienta outras pessoas.\n\n## Amor\nTempo para entender o que se quer antes de se envolver, ou um momento mais reservado dentro da relação. Solidão escolhida não é falta de amor.\n\n## Trabalho/propósito\nFavorece estudo, especialização, planejamento e trabalho solitário e profundo. Pode indicar a busca de um mentor ou o papel de orientar alguém.\n\n## Autoconhecimento\nConvida a ouvir a própria voz longe do ruído e a reconhecer o que você já aprendeu.\n\n## Reversa\nInvertida, o recolhimento pode virar isolamento ou fuga. Também pode indicar resistência a pedir orientação.\n\n## Ação/reflexão\nSepare um período curto do dia, sem redes sociais, para caminhar ou escrever sobre uma única pergunta.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/10-wheel-of-fortune": {
  "id": "tarot/major-arcana/10-wheel-of-fortune",
  "domain": "tarot",
  "title": "10 — Wheel of Fortune (A Roda da Fortuna)",
  "content": "# 10 — Wheel of Fortune (A Roda da Fortuna)\n\n## Palavras-chave\nciclos, mudança, virada, movimento da vida\n\n## Expressão reversa / bloqueada\nresistência à mudança, sensação de repetição, fase difícil do ciclo\n\n## Leitura geral\nA Roda gira com figuras que sobem e descem: é a carta dos ciclos e das viradas. Lembra que nenhuma fase é permanente. Na tradição, fala do que muda além do nosso controle e de como responder a isso.\n\n## Amor\nUma fase nova pode estar começando, ou um padrão antigo voltando para ser visto. Pergunta o que se repete nas suas relações.\n\n## Trabalho/propósito\nMudanças de cenário, oportunidades e ajustes de rota. A carta pede adaptabilidade, não aposta cega.\n\n## Autoconhecimento\nAjuda a reconhecer seus ciclos e o que você pode fazer diferente quando eles voltam.\n\n## Reversa\nInvertida, pode indicar resistência a uma mudança inevitável ou a sensação de girar sempre no mesmo ciclo. Pergunte o que depende de você nesta volta.\n\n## Ação/reflexão\nLembre de uma fase difícil que passou. Anote o que te ajudou a atravessá-la e guarde a lista.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/11-justice": {
  "id": "tarot/major-arcana/11-justice",
  "domain": "tarot",
  "title": "11 — Justice (A Justiça)",
  "content": "# 11 — Justice (A Justiça)\n\n## Palavras-chave\nequilíbrio, verdade, responsabilidade, consequência\n\n## Expressão reversa / bloqueada\nparcialidade, desonestidade, evitar responsabilidade, desequilíbrio\n\n## Leitura geral\nA Justiça segura a balança e a espada: é a carta da clareza, da verdade e das consequências. Fala de decisões tomadas com honestidade. Na tradição, representa o equilíbrio entre causa e efeito.\n\n## Amor\nReciprocidade e honestidade. A carta pergunta se as trocas na relação são justas e se as conversas difíceis estão sendo feitas.\n\n## Trabalho/propósito\nContratos, acordos, decisões objetivas e responsabilidade pelas próprias escolhas. Favorece agir com transparência.\n\n## Autoconhecimento\nConvida a assumir a sua parte em uma situação, sem se culpar por tudo nem culpar só os outros.\n\n## Reversa\nInvertida, pode indicar desequilíbrio nas trocas, decisões parciais ou fuga de uma conversa necessária.\n\n## Ação/reflexão\nEscreva uma situação pendente em duas colunas: o que é responsabilidade sua e o que não é. Aja sobre a primeira coluna.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/12-the-hanged-man": {
  "id": "tarot/major-arcana/12-the-hanged-man",
  "domain": "tarot",
  "title": "12 — The Hanged Man (O Enforcado)",
  "content": "# 12 — The Hanged Man (O Enforcado)\n\n## Palavras-chave\npausa, nova perspectiva, entrega, espera consciente\n\n## Expressão reversa / bloqueada\nestagnação, sacrifício inútil, resistência, indecisão\n\n## Leitura geral\nO Enforcado está de cabeça para baixo, com expressão serena: é a carta de ver o mundo por outro ângulo. Fala de pausa, entrega e de esperar sem desistir. Na tradição, representa a sabedoria de suspender a ação para compreender.\n\n## Amor\nMomento de espera ou de olhar a relação sob outro ponto de vista. Pergunta se algum sacrifício está sendo feito sem sentido.\n\n## Trabalho/propósito\nProjeto em compasso de espera ou necessidade de mudar a estratégia. Pausar pode revelar o que a pressa escondia.\n\n## Autoconhecimento\nConvida a soltar o controle por um momento e perceber o que muda quando você inverte a pergunta.\n\n## Reversa\nInvertida, pode indicar estagnação, sacrifícios que já não fazem sentido ou resistência a mudar de perspectiva.\n\n## Ação/reflexão\nPegue um problema atual e descreva-o do ponto de vista de outra pessoa envolvida. Veja o que aparece.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/13-death": {
  "id": "tarot/major-arcana/13-death",
  "domain": "tarot",
  "title": "13 — Death (A Morte)",
  "content": "# 13 — Death (A Morte)\n\n## Palavras-chave\nencerramento, transformação, fim de ciclo, renovação\n\n## Expressão reversa / bloqueada\napego, medo de mudar, fim adiado, transição arrastada\n\n## Leitura geral\nA Morte, no Tarot, fala de transformação, não de morte física. É a carta do encerramento necessário para que algo novo possa nascer. Na tradição, o sol que nasce ao fundo da imagem lembra que todo fim abre espaço.\n\n## Amor\nFim de uma fase da relação ou de um padrão afetivo. Pode ser a transformação de um vínculo, não necessariamente o seu término.\n\n## Trabalho/propósito\nEncerramento de um projeto, mudança de função ou de área. Abre espaço para o que vem a seguir.\n\n## Autoconhecimento\nConvida a reconhecer o que já terminou em você e ainda está sendo carregado por hábito.\n\n## Reversa\nInvertida, pode indicar apego ao que já acabou ou uma transição arrastada pelo medo do novo.\n\n## Ação/reflexão\nEscolha algo pequeno para encerrar esta semana: um objeto, uma tarefa pendente, um compromisso que já não faz sentido.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/14-temperance": {
  "id": "tarot/major-arcana/14-temperance",
  "domain": "tarot",
  "title": "14 — Temperance (A Temperança)",
  "content": "# 14 — Temperance (A Temperança)\n\n## Palavras-chave\nequilíbrio, moderação, integração, paciência\n\n## Expressão reversa / bloqueada\nexcesso, desequilíbrio, pressa, extremos\n\n## Leitura geral\nA Temperança mistura líquidos entre duas taças com calma: é a carta da medida certa e da integração entre opostos. Fala de paciência e cura gradual. Na tradição, mostra que a harmonia é construída aos poucos.\n\n## Amor\nRelação que pede equilíbrio, conversa e meio-termo. Favorece reconciliações cuidadosas e a construção paciente da confiança.\n\n## Trabalho/propósito\nTrabalho em equipe, gestão de recursos e ritmo sustentável. Combinar habilidades diferentes dá bons resultados.\n\n## Autoconhecimento\nAjuda a perceber onde você vai aos extremos e o que seria a sua medida justa.\n\n## Reversa\nInvertida, pode indicar excessos, pressa ou falta de equilíbrio entre áreas da vida.\n\n## Ação/reflexão\nIdentifique um hábito em excesso e outro em falta. Ajuste um pouco cada um durante a semana.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/15-the-devil": {
  "id": "tarot/major-arcana/15-the-devil",
  "domain": "tarot",
  "title": "15 — The Devil (O Diabo)",
  "content": "# 15 — The Devil (O Diabo)\n\n## Palavras-chave\napego, desejo, padrões, sombra\n\n## Expressão reversa / bloqueada\nlibertação, consciência do padrão, quebra de correntes, ou aprofundamento do vício\n\n## Leitura geral\nO Diabo mostra figuras presas por correntes largas, que poderiam ser retiradas: é a carta dos apegos e padrões que nos prendem. Fala de desejo, sombra e do que fazemos no automático. Na tradição, aponta que a prisão costuma ser menos rígida do que parece.\n\n## Amor\nAtração intensa, ciúme, dependência ou dinâmicas de controle. Pede olhar honesto sobre o que prende e o que nutre.\n\n## Trabalho/propósito\nPode indicar apego a dinheiro, status ou a uma situação que já não faz bem. Também fala de ambição que precisa de limites.\n\n## Autoconhecimento\nConvida a reconhecer um padrão que se repete e a função que ele cumpre para você.\n\n## Reversa\nInvertida, pode indicar o momento de perceber e soltar uma corrente, ou um padrão que se aprofunda quando é negado.\n\n## Ação/reflexão\nNomeie um hábito que você gostaria de mudar. Observe por três dias quando ele aparece e o que vem antes.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/16-the-tower": {
  "id": "tarot/major-arcana/16-the-tower",
  "domain": "tarot",
  "title": "16 — The Tower (A Torre)",
  "content": "# 16 — The Tower (A Torre)\n\n## Palavras-chave\nruptura, revelação, mudança súbita, libertação\n\n## Expressão reversa / bloqueada\nevitar o inevitável, medo de mudança, crise adiada, reconstrução interna\n\n## Leitura geral\nA Torre é atingida por um raio: é a carta das estruturas que caem porque estavam frágeis. Fala de revelação e de mudança rápida. Na tradição, a queda abre espaço para reconstruir sobre base mais verdadeira.\n\n## Amor\nUma verdade que vem à tona, uma conversa que muda tudo ou o fim de uma ilusão. Pode ser desconfortável e libertador ao mesmo tempo.\n\n## Trabalho/propósito\nMudanças inesperadas de cenário. A carta pede flexibilidade e foco no que pode ser reconstruído.\n\n## Autoconhecimento\nConvida a perceber quais crenças sobre si já não se sustentam.\n\n## Reversa\nInvertida, pode indicar uma crise adiada, resistência a uma mudança necessária ou uma transformação vivida mais por dentro.\n\n## Ação/reflexão\nEscreva uma crença que caiu recentemente e o que você ganhou de espaço com essa queda.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/17-the-star": {
  "id": "tarot/major-arcana/17-the-star",
  "domain": "tarot",
  "title": "17 — The Star (A Estrela)",
  "content": "# 17 — The Star (A Estrela)\n\n## Palavras-chave\nesperança, cura, inspiração, serenidade\n\n## Expressão reversa / bloqueada\ndesânimo, descrença, desconexão, falta de fé em si\n\n## Leitura geral\nA Estrela mostra uma figura que derrama água sob um céu estrelado: é a carta da esperança renovada depois da tempestade. Fala de cura, inspiração e confiança no futuro. Na tradição, sucede a Torre como um respiro.\n\n## Amor\nFase de reconexão, ternura e abertura gradual. Favorece relações em que se pode ser quem se é.\n\n## Trabalho/propósito\nInspiração, visão de longo prazo e trabalhos criativos. Bom momento para retomar um sonho com passos realistas.\n\n## Autoconhecimento\nConvida a reencontrar o que te dá sentido e a cuidar da própria esperança.\n\n## Reversa\nInvertida, pode indicar desânimo, perda de confiança ou dificuldade de enxergar saídas. Pede cuidado com a própria fé em si.\n\n## Ação/reflexão\nEscreva um desejo para os próximos seis meses e um pequeno gesto que você pode fazer por ele hoje.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/18-the-moon": {
  "id": "tarot/major-arcana/18-the-moon",
  "domain": "tarot",
  "title": "18 — The Moon (A Lua)",
  "content": "# 18 — The Moon (A Lua)\n\n## Palavras-chave\nintuição, incerteza, imaginação, sonhos\n\n## Expressão reversa / bloqueada\nconfusão que se dissipa, medo que perde força, ou ilusão que se aprofunda\n\n## Leitura geral\nA Lua ilumina um caminho entre duas torres, com cães e um lagostim que sai da água: é a carta do que ainda não está claro. Fala de intuição, sonhos e medos. Na tradição, nem tudo é o que parece sob a luz da Lua.\n\n## Amor\nInseguranças, projeções ou falta de clareza. Pede conversas francas antes de tirar conclusões.\n\n## Trabalho/propósito\nCenário incerto, informações incompletas. Vale checar dados antes de decidir e confiar no tempo.\n\n## Autoconhecimento\nConvida a separar o que você teme do que realmente está acontecendo.\n\n## Reversa\nInvertida, pode indicar que a confusão começa a se dissipar, ou que a ilusão se aprofunda. Observe o que fica mais claro.\n\n## Ação/reflexão\nEscreva um medo atual e, ao lado, os fatos concretos que você conhece. Compare as duas listas.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/19-the-sun": {
  "id": "tarot/major-arcana/19-the-sun",
  "domain": "tarot",
  "title": "19 — The Sun (O Sol)",
  "content": "# 19 — The Sun (O Sol)\n\n## Palavras-chave\nalegria, vitalidade, clareza, sucesso\n\n## Expressão reversa / bloqueada\nalegria contida, otimismo excessivo, cansaço, brilho apagado\n\n## Leitura geral\nO Sol brilha sobre uma criança num cavalo branco: é a carta da clareza, da alegria e da vitalidade. Fala de reconhecimento e de se mostrar como se é. Na tradição, é das cartas mais luminosas do baralho.\n\n## Amor\nCalor, leveza e transparência. Favorece momentos de alegria compartilhada e relações em que se pode brilhar.\n\n## Trabalho/propósito\nReconhecimento, sucesso visível e energia para realizar. Bom para apresentar trabalhos e se expor.\n\n## Autoconhecimento\nConvida a reconhecer o que te traz alegria genuína e a se permitir ocupar espaço.\n\n## Reversa\nInvertida, pode indicar uma alegria contida, cansaço ou otimismo que ignora detalhes. O sol continua lá, só encoberto.\n\n## Ação/reflexão\nFaça uma lista de cinco coisas que te deram alegria neste mês e repita uma delas nesta semana.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/20-judgement": {
  "id": "tarot/major-arcana/20-judgement",
  "domain": "tarot",
  "title": "20 — Judgement (O Julgamento)",
  "content": "# 20 — Judgement (O Julgamento)\n\n## Palavras-chave\ndespertar, renovação, chamado, avaliação\n\n## Expressão reversa / bloqueada\nautocrítica, dúvida, chamado ignorado, dificuldade de seguir em frente\n\n## Leitura geral\nO Julgamento mostra figuras que se levantam ao som de uma trombeta: é a carta do despertar e da renovação. Fala de avaliar a trajetória e responder a um chamado. Na tradição, representa o momento de renascer com mais consciência.\n\n## Amor\nOlhar o passado afetivo com clareza e decidir o que se leva adiante. Pode indicar retomadas conscientes ou um encerramento maduro.\n\n## Trabalho/propósito\nChamado para uma nova etapa profissional ou avaliação do caminho até aqui.\n\n## Autoconhecimento\nConvida a ouvir o que te chama agora e a perdoar versões antigas de si.\n\n## Reversa\nInvertida, pode indicar autocrítica dura, dúvida diante do chamado ou dificuldade de soltar o passado.\n\n## Ação/reflexão\nEscreva uma carta curta para a pessoa que você era há cinco anos, dizendo o que aprendeu desde então.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/21-the-world": {
  "id": "tarot/major-arcana/21-the-world",
  "domain": "tarot",
  "title": "21 — The World (O Mundo)",
  "content": "# 21 — The World (O Mundo)\n\n## Palavras-chave\nconclusão, integração, realização, plenitude\n\n## Expressão reversa / bloqueada\nciclo inacabado, falta de fechamento, atraso, busca de completude\n\n## Leitura geral\nO Mundo mostra uma figura que dança dentro de uma guirlanda: é a carta do ciclo completo. Fala de realização, integração e de chegar a um ponto de plenitude. Na tradição, encerra a jornada dos Arcanos Maiores.\n\n## Amor\nRelação madura, sensação de completude e celebração do caminho percorrido.\n\n## Trabalho/propósito\nConclusão de projetos, reconhecimento e abertura de novos horizontes, inclusive viagens e expansão.\n\n## Autoconhecimento\nConvida a reconhecer suas conquistas e a celebrar o que se completou antes de começar outra coisa.\n\n## Reversa\nInvertida, pode indicar um ciclo inacabado, falta de fechamento ou a sensação de quase chegar.\n\n## Ação/reflexão\nAnote três ciclos que você concluiu neste ano e celebre um deles de forma concreta.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/methodology": {
  "id": "tarot/methodology",
  "domain": "tarot",
  "title": "Tarot — metodologia v1",
  "content": "# Tarot — metodologia v1\n\n## Tradição\nRider-Waite-Smith como referência principal.\n\n## Estrutura\n78 cartas:\n- 22 Arcanos Maiores\n- 56 Arcanos Menores.\n\n## Arcanos Maiores\nA sequência pode ser lida como uma narrativa simbólica conhecida como jornada do Louco, mas não existe obrigação de usar uma única interpretação.\n\n## Arcanos Menores\n4 naipes:\n- Paus\n- Copas\n- Espadas\n- Ouros\n\nCada naipe:\nÁs, 2–10, Pajem, Cavaleiro, Rainha, Rei.\n\n## Orientação\n- upright: leitura direta.\n- reversed: leitura invertida/modificada.\n\nReversa não precisa significar “oposto”; pode representar bloqueio, excesso, internalização, atraso ou expressão distorcida.\n\n## Sorteio\nO software escolhe as cartas.\nA IA nunca deve inventar a carta sorteada.\n\n## Interpretação\nA carta é um símbolo. A leitura deve considerar:\n- pergunta\n- posição da carta\n- orientação\n- cartas vizinhas\n- contexto do usuário.\n\n## Segurança editorial\nNão usar Tarot para diagnosticar doenças, determinar culpa, afirmar morte, garantir eventos futuros ou substituir orientação profissional.",
  "sources": []
 },
 "tarot/minor-arcana/cups/README": {
  "id": "tarot/minor-arcana/cups/README",
  "domain": "tarot",
  "title": "Copas",
  "content": "# Copas\n\nemoção, vínculos, intimidade, imaginação, receptividade\n\nO significado de cada carta surge da combinação entre número/corte + naipe + posição + pergunta.",
  "sources": []
 },
 "tarot/minor-arcana/cups/ace-cups": {
  "id": "tarot/minor-arcana/cups/ace-cups",
  "domain": "tarot",
  "title": "Ás de Copas",
  "content": "# Ás de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ninício, potencial, semente\n\n## Palavras-chave\namor, abertura emocional, sensibilidade, novo sentimento\n\n## Leitura geral\nUma taça transborda, sustentada por uma mão que sai da nuvem. O Ás de Copas fala de um novo sentimento, de abertura emocional e de afeto que quer fluir.\n\n## Amor\nInício de um amor, renovação de afeto ou disponibilidade para sentir.\n\n## Trabalho/recursos\nTrabalho com propósito emocional, criatividade, projetos que tocam pessoas.\n\n## Autoconhecimento\nConvida a perceber o que faz o seu coração se abrir.\n\n## Reversa\nInvertida, pode indicar emoções represadas, dificuldade de receber afeto ou carência.\n\n## Ação/reflexão\nFaça um gesto de carinho sem esperar retorno e repare em como você se sente.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/eight-cups": {
  "id": "tarot/minor-arcana/cups/eight-cups",
  "domain": "tarot",
  "title": "Oito de Copas",
  "content": "# Oito de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nmovimento, esforço, mudança de ritmo\n\n## Palavras-chave\npartida, busca de sentido, desapego, deixar para trás\n\n## Leitura geral\nUma figura se afasta de oito taças empilhadas, sob a Lua. O Oito de Copas fala de deixar o que já não satisfaz em busca de algo mais profundo.\n\n## Amor\nDistanciamento, fim de um ciclo afetivo ou busca de algo mais verdadeiro.\n\n## Trabalho/recursos\nAbandonar um caminho que já não faz sentido, mesmo que pareça estável.\n\n## Autoconhecimento\nPergunta o que você precisa deixar para encontrar sentido.\n\n## Reversa\nInvertida, pode indicar medo de partir, indecisão ou retorno ao que já não serve.\n\n## Ação/reflexão\nEscreva o que te prende a algo que já não te satisfaz.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/five-cups": {
  "id": "tarot/minor-arcana/cups/five-cups",
  "domain": "tarot",
  "title": "Cinco de Copas",
  "content": "# Cinco de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nconflito, perda, desafio que move\n\n## Palavras-chave\nperda, luto, decepção, foco no que se foi\n\n## Leitura geral\nUma figura de capa olha três taças derramadas, sem notar as duas de pé atrás de si. O Cinco de Copas fala de decepção e do tempo do luto.\n\n## Amor\nMágoa, arrependimento, fim que ainda dói. Pede acolher a tristeza sem esquecer o que ficou.\n\n## Trabalho/recursos\nFrustração com resultados, perda de oportunidade. Há algo a recuperar.\n\n## Autoconhecimento\nConvida a sentir a perda e depois virar o rosto para o que permanece.\n\n## Reversa\nInvertida, pode indicar o início da aceitação e da recuperação.\n\n## Ação/reflexão\nEscreva o que você perdeu e, ao lado, o que ainda está de pé.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/four-cups": {
  "id": "tarot/minor-arcana/cups/four-cups",
  "domain": "tarot",
  "title": "Quatro de Copas",
  "content": "# Quatro de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nestabilidade, pausa, estrutura\n\n## Palavras-chave\napatia, introspecção, oferta não vista, insatisfação\n\n## Leitura geral\nUma figura sentada sob a árvore ignora a taça que lhe é oferecida. O Quatro de Copas fala de tédio, introspecção e de não perceber o que está à frente.\n\n## Amor\nDesinteresse, rotina, oportunidades afetivas que passam despercebidas.\n\n## Trabalho/recursos\nDesmotivação, sensação de que nada atrai. Pede olhar de novo para as opções.\n\n## Autoconhecimento\nPergunta o que você está recusando sem perceber.\n\n## Reversa\nInvertida, pode indicar retomada de interesse e abertura para o novo.\n\n## Ação/reflexão\nAnote três coisas boas oferecidas a você recentemente que você deixou passar.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/king-cups": {
  "id": "tarot/minor-arcana/cups/king-cups",
  "domain": "tarot",
  "title": "Rei de Copas",
  "content": "# Rei de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ncorte — maturidade ativa, liderança, domínio externo\n\n## Palavras-chave\nequilíbrio emocional, diplomacia, maturidade, calma\n\n## Leitura geral\nO Rei de Copas flutua sobre um mar agitado, sereno. Fala de equilíbrio emocional e de conduzir sentimentos com maturidade.\n\n## Amor\nEstabilidade emocional, apoio, compreensão.\n\n## Trabalho/recursos\nLiderança calma, diplomacia, mediação.\n\n## Autoconhecimento\nPergunta como você equilibra razão e emoção.\n\n## Reversa\nInvertida, pode indicar emoções reprimidas, manipulação ou instabilidade.\n\n## Ação/reflexão\nNuma conversa tensa, nomeie a emoção antes de argumentar.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/knight-cups": {
  "id": "tarot/minor-arcana/cups/knight-cups",
  "domain": "tarot",
  "title": "Cavaleiro de Copas",
  "content": "# Cavaleiro de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ncorte — ação, busca, movimento intenso\n\n## Palavras-chave\nromantismo, convite, idealismo, proposta\n\n## Leitura geral\nO Cavaleiro de Copas avança devagar segurando uma taça. Fala de romantismo, propostas e de seguir o coração.\n\n## Amor\nConvites, declarações, romance. Pede atenção ao idealismo.\n\n## Trabalho/recursos\nPropostas criativas, trabalho com arte ou cuidado.\n\n## Autoconhecimento\nPergunta se você segue o coração ou uma ideia idealizada dele.\n\n## Reversa\nInvertida, pode indicar promessas vazias, mudanças de humor ou fuga.\n\n## Ação/reflexão\nFaça um convite que você está adiando.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/nine-cups": {
  "id": "tarot/minor-arcana/cups/nine-cups",
  "domain": "tarot",
  "title": "Nove de Copas",
  "content": "# Nove de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nquase completo, intensidade, resultado próximo\n\n## Palavras-chave\nsatisfação, desejo realizado, contentamento, prazer\n\n## Leitura geral\nUma figura satisfeita sentada diante de nove taças. O Nove de Copas é conhecido como a carta do desejo realizado.\n\n## Amor\nContentamento, prazer, satisfação emocional.\n\n## Trabalho/recursos\nResultados que agradam, conforto, reconhecimento pessoal.\n\n## Autoconhecimento\nConvida a reconhecer o que já te satisfaz e a saborear.\n\n## Reversa\nInvertida, pode indicar satisfação superficial, excesso ou desejo que não preenche.\n\n## Ação/reflexão\nAnote um desejo que se realizou e agradeça por ele.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/page-cups": {
  "id": "tarot/minor-arcana/cups/page-cups",
  "domain": "tarot",
  "title": "Pajem de Copas",
  "content": "# Pajem de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ncorte — aprendizado, curiosidade, mensagem\n\n## Palavras-chave\nsensibilidade, criatividade, mensagem afetiva, curiosidade emocional\n\n## Leitura geral\nO Pajem de Copas olha um peixe que sai da taça. Fala de surpresas emocionais, imaginação e sensibilidade.\n\n## Amor\nMensagem afetiva, flerte, sentimentos novos e tímidos.\n\n## Trabalho/recursos\nIdeias criativas, intuição no trabalho, propostas inesperadas.\n\n## Autoconhecimento\nConvida a ouvir sua sensibilidade sem vergonha.\n\n## Reversa\nInvertida, pode indicar imaturidade emocional, insegurança ou bloqueio criativo.\n\n## Ação/reflexão\nEscreva, desenhe ou cante algo sem objetivo, só para expressar o que sente.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/queen-cups": {
  "id": "tarot/minor-arcana/cups/queen-cups",
  "domain": "tarot",
  "title": "Rainha de Copas",
  "content": "# Rainha de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ncorte — maturidade receptiva, cuidado, domínio interno\n\n## Palavras-chave\nempatia, acolhimento, intuição, cuidado emocional\n\n## Leitura geral\nA Rainha de Copas contempla uma taça fechada à beira-mar. Fala de empatia, intuição e cuidado emocional maduro.\n\n## Amor\nAfeto acolhedor, escuta e compreensão.\n\n## Trabalho/recursos\nTrabalho com cuidado, escuta e criatividade. Inteligência emocional.\n\n## Autoconhecimento\nConvida a cuidar das suas emoções com a mesma ternura que oferece aos outros.\n\n## Reversa\nInvertida, pode indicar excesso de empatia, dependência emocional ou desconexão.\n\n## Ação/reflexão\nPergunte a si: o que estou sentindo agora? Escreva sem julgar.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/seven-cups": {
  "id": "tarot/minor-arcana/cups/seven-cups",
  "domain": "tarot",
  "title": "Sete de Copas",
  "content": "# Sete de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\navaliação, persistência, prova\n\n## Palavras-chave\nfantasias, opções, ilusão, escolha difícil\n\n## Leitura geral\nSete taças flutuam nas nuvens, cada uma com um conteúdo diferente. O Sete de Copas fala de muitas opções, sonhos e ilusões.\n\n## Amor\nIdealização, dúvida entre caminhos, expectativas pouco realistas.\n\n## Trabalho/recursos\nMuitas ideias, pouca definição. Pede escolher uma e testar.\n\n## Autoconhecimento\nConvida a separar desejo real de fantasia.\n\n## Reversa\nInvertida, pode indicar clareza depois da confusão e foco renovado.\n\n## Ação/reflexão\nEntre suas opções atuais, escolha uma e faça um teste prático.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/six-cups": {
  "id": "tarot/minor-arcana/cups/six-cups",
  "domain": "tarot",
  "title": "Seis de Copas",
  "content": "# Seis de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nharmonia, troca, recuperação\n\n## Palavras-chave\nnostalgia, memória, inocência, gentileza\n\n## Leitura geral\nUma criança oferece uma taça com flores a outra. O Seis de Copas fala de memórias, infância e gestos simples de carinho.\n\n## Amor\nRetorno de alguém do passado, relação com ternura, lembranças afetivas.\n\n## Trabalho/recursos\nRetomar projetos antigos, ambientes acolhedores, trabalho com crianças ou memória.\n\n## Autoconhecimento\nPergunta o que do passado ainda te nutre e o que te prende.\n\n## Reversa\nInvertida, pode indicar apego ao passado ou idealização de tempos antigos.\n\n## Ação/reflexão\nLembre de uma memória feliz da infância e repita algo dela nesta semana.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/ten-cups": {
  "id": "tarot/minor-arcana/cups/ten-cups",
  "domain": "tarot",
  "title": "Dez de Copas",
  "content": "# Dez de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nconclusão, ápice, fim de ciclo\n\n## Palavras-chave\nharmonia, família, plenitude emocional, lar\n\n## Leitura geral\nUma família celebra sob um arco-íris de dez taças. O Dez de Copas fala de harmonia, lar e plenitude afetiva.\n\n## Amor\nRelação estável e feliz, sentido de família, valores compartilhados.\n\n## Trabalho/recursos\nAmbiente de trabalho harmonioso, equilíbrio entre vida e trabalho.\n\n## Autoconhecimento\nPergunta o que significa lar e pertencimento para você.\n\n## Reversa\nInvertida, pode indicar desarmonia, expectativas idealizadas de família ou distância emocional.\n\n## Ação/reflexão\nFaça algo para fortalecer um vínculo familiar ou de amizade próxima.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/three-cups": {
  "id": "tarot/minor-arcana/cups/three-cups",
  "domain": "tarot",
  "title": "Três de Copas",
  "content": "# Três de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nexpansão, primeiros frutos, colaboração\n\n## Palavras-chave\namizade, celebração, comunidade, alegria compartilhada\n\n## Leitura geral\nTrês figuras brindam e dançam. O Três de Copas fala de amizade, celebração e da alegria de estar em grupo.\n\n## Amor\nMomentos leves, amigos, festas. Pode indicar a influência do círculo social na relação.\n\n## Trabalho/recursos\nEquipe unida, colaboração, celebração de resultados.\n\n## Autoconhecimento\nConvida a valorizar suas amizades e a rede que te sustenta.\n\n## Reversa\nInvertida, pode indicar excessos, fofocas ou distância dos amigos.\n\n## Ação/reflexão\nMarque um encontro com alguém de quem você sente falta.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/two-cups": {
  "id": "tarot/minor-arcana/cups/two-cups",
  "domain": "tarot",
  "title": "Dois de Copas",
  "content": "# Dois de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nescolha, parceria, equilíbrio entre dois polos\n\n## Palavras-chave\nconexão, parceria, reciprocidade, encontro\n\n## Leitura geral\nDuas figuras trocam taças sob um símbolo de união. O Dois de Copas fala de conexão mútua e de parceria equilibrada.\n\n## Amor\nAfinidade, reciprocidade, encontro entre iguais. Uma das cartas mais afetivas do baralho.\n\n## Trabalho/recursos\nParcerias de confiança, acordos, trabalho a dois.\n\n## Autoconhecimento\nPergunta como você se relaciona quando há troca de verdade.\n\n## Reversa\nInvertida, pode indicar desequilíbrio na troca, desencontro ou falta de comunicação.\n\n## Ação/reflexão\nDiga a alguém próximo algo que você admira nessa pessoa.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/README": {
  "id": "tarot/minor-arcana/pentacles/README",
  "domain": "tarot",
  "title": "Ouros",
  "content": "# Ouros\n\ncorpo, recursos, trabalho, estabilidade, materialização\n\nO significado de cada carta surge da combinação entre número/corte + naipe + posição + pergunta.",
  "sources": []
 },
 "tarot/minor-arcana/pentacles/ace-pentacles": {
  "id": "tarot/minor-arcana/pentacles/ace-pentacles",
  "domain": "tarot",
  "title": "Ás de Ouros",
  "content": "# Ás de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ninício, potencial, semente\n\n## Palavras-chave\noportunidade concreta, prosperidade, semente material, segurança\n\n## Leitura geral\nUma mão oferece uma moeda sobre um jardim. O Ás de Ouros fala de uma oportunidade concreta e de começos sólidos.\n\n## Amor\nRelação com base estável, gestos concretos de cuidado.\n\n## Trabalho/recursos\nNova oportunidade de trabalho, renda ou projeto.\n\n## Autoconhecimento\nConvida a cuidar do corpo e das bases da vida.\n\n## Reversa\nInvertida, pode indicar oportunidade perdida ou má gestão.\n\n## Ação/reflexão\nEscolha um pequeno investimento de tempo ou dinheiro em você.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/eight-pentacles": {
  "id": "tarot/minor-arcana/pentacles/eight-pentacles",
  "domain": "tarot",
  "title": "Oito de Ouros",
  "content": "# Oito de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nmovimento, esforço, mudança de ritmo\n\n## Palavras-chave\ndedicação, aprendizado, prática, aprimoramento\n\n## Leitura geral\nUm artesão trabalha moeda por moeda. O Oito de Ouros fala de dedicação e prática.\n\n## Amor\nInvestir na relação com atenção.\n\n## Trabalho/recursos\nAperfeiçoamento, estudo, foco.\n\n## Autoconhecimento\nPergunta em que você quer se aprimorar.\n\n## Reversa\nInvertida, pode indicar perfeccionismo ou desmotivação.\n\n## Ação/reflexão\nPratique uma habilidade por 20 minutos.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/five-pentacles": {
  "id": "tarot/minor-arcana/pentacles/five-pentacles",
  "domain": "tarot",
  "title": "Cinco de Ouros",
  "content": "# Cinco de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nconflito, perda, desafio que move\n\n## Palavras-chave\ndificuldade, escassez, exclusão, ajuda disponível\n\n## Leitura geral\nDuas figuras passam no frio diante de uma janela iluminada. O Cinco de Ouros fala de dificuldade e de não perceber a ajuda disponível.\n\n## Amor\nSensação de abandono ou de falta.\n\n## Trabalho/recursos\nDificuldades financeiras, insegurança.\n\n## Autoconhecimento\nConvida a pedir ajuda.\n\n## Reversa\nInvertida, pode indicar recuperação ou fim de dificuldade.\n\n## Ação/reflexão\nPeça ajuda a alguém para uma questão concreta.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/four-pentacles": {
  "id": "tarot/minor-arcana/pentacles/four-pentacles",
  "domain": "tarot",
  "title": "Quatro de Ouros",
  "content": "# Quatro de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nestabilidade, pausa, estrutura\n\n## Palavras-chave\nsegurança, controle, economia, apego\n\n## Leitura geral\nUma figura segura moedas junto ao corpo. O Quatro de Ouros fala de segurança e também de apego.\n\n## Amor\nPossessividade ou medo de perder.\n\n## Trabalho/recursos\nEconomia, estabilidade, cautela financeira.\n\n## Autoconhecimento\nPergunta o que você segura por medo.\n\n## Reversa\nInvertida, pode indicar generosidade ou gastos excessivos.\n\n## Ação/reflexão\nDoe algo que você não usa mais.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/king-pentacles": {
  "id": "tarot/minor-arcana/pentacles/king-pentacles",
  "domain": "tarot",
  "title": "Rei de Ouros",
  "content": "# Rei de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ncorte — maturidade ativa, liderança, domínio externo\n\n## Palavras-chave\nprosperidade, segurança, liderança prática, realização\n\n## Leitura geral\nO Rei de Ouros no trono cercado de abundância. Fala de prosperidade e liderança prática.\n\n## Amor\nSegurança e estabilidade.\n\n## Trabalho/recursos\nSucesso, gestão de recursos.\n\n## Autoconhecimento\nPergunta como você constrói segurança.\n\n## Reversa\nInvertida, pode indicar materialismo ou rigidez.\n\n## Ação/reflexão\nRevise suas finanças do mês.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/knight-pentacles": {
  "id": "tarot/minor-arcana/pentacles/knight-pentacles",
  "domain": "tarot",
  "title": "Cavaleiro de Ouros",
  "content": "# Cavaleiro de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ncorte — ação, busca, movimento intenso\n\n## Palavras-chave\nconstância, responsabilidade, trabalho, método\n\n## Leitura geral\nO Cavaleiro de Ouros segue devagar e firme. Fala de constância e responsabilidade.\n\n## Amor\nRelação estável e confiável.\n\n## Trabalho/recursos\nTrabalho constante, método.\n\n## Autoconhecimento\nPergunta onde você precisa de mais constância.\n\n## Reversa\nInvertida, pode indicar estagnação ou tédio.\n\n## Ação/reflexão\nMantenha uma rotina por sete dias.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/nine-pentacles": {
  "id": "tarot/minor-arcana/pentacles/nine-pentacles",
  "domain": "tarot",
  "title": "Nove de Ouros",
  "content": "# Nove de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nquase completo, intensidade, resultado próximo\n\n## Palavras-chave\nautonomia, conforto, conquista, independência\n\n## Leitura geral\nUma figura elegante num jardim abundante. O Nove de Ouros fala de independência e conforto conquistado.\n\n## Amor\nAutonomia na relação, amor próprio.\n\n## Trabalho/recursos\nEstabilidade financeira, conquista pessoal.\n\n## Autoconhecimento\nConvida a desfrutar do que conquistou.\n\n## Reversa\nInvertida, pode indicar dependência ou excesso.\n\n## Ação/reflexão\nDê a si um momento de prazer.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/page-pentacles": {
  "id": "tarot/minor-arcana/pentacles/page-pentacles",
  "domain": "tarot",
  "title": "Pajem de Ouros",
  "content": "# Pajem de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ncorte — aprendizado, curiosidade, mensagem\n\n## Palavras-chave\nestudo, planejamento, oportunidade, curiosidade prática\n\n## Leitura geral\nO Pajem de Ouros contempla a moeda. Fala de aprendizado prático e novas oportunidades.\n\n## Amor\nInteresse sério, construção lenta.\n\n## Trabalho/recursos\nEstudo, curso, nova oportunidade.\n\n## Autoconhecimento\nConvida a aprender algo útil.\n\n## Reversa\nInvertida, pode indicar procrastinação.\n\n## Ação/reflexão\nInscreva-se num curso curto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/queen-pentacles": {
  "id": "tarot/minor-arcana/pentacles/queen-pentacles",
  "domain": "tarot",
  "title": "Rainha de Ouros",
  "content": "# Rainha de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ncorte — maturidade receptiva, cuidado, domínio interno\n\n## Palavras-chave\ncuidado prático, abundância, acolhimento, praticidade\n\n## Leitura geral\nA Rainha de Ouros segura a moeda com cuidado. Fala de cuidado prático e abundância.\n\n## Amor\nAfeto demonstrado em cuidado.\n\n## Trabalho/recursos\nGestão prática, equilíbrio trabalho-casa.\n\n## Autoconhecimento\nConvida a cuidar do corpo e do lar.\n\n## Reversa\nInvertida, pode indicar desequilíbrio ou descuido.\n\n## Ação/reflexão\nArrume um canto da casa.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/seven-pentacles": {
  "id": "tarot/minor-arcana/pentacles/seven-pentacles",
  "domain": "tarot",
  "title": "Sete de Ouros",
  "content": "# Sete de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\navaliação, persistência, prova\n\n## Palavras-chave\npaciência, avaliação, investimento, espera\n\n## Leitura geral\nUma figura observa a planta crescer. O Sete de Ouros fala de paciência e avaliação do que foi plantado.\n\n## Amor\nAvaliar a relação, investimento de longo prazo.\n\n## Trabalho/recursos\nResultados ainda em crescimento, revisão.\n\n## Autoconhecimento\nConvida a ter paciência com seus processos.\n\n## Reversa\nInvertida, pode indicar frustração ou impaciência.\n\n## Ação/reflexão\nAvalie um projeto e decida se continua.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/six-pentacles": {
  "id": "tarot/minor-arcana/pentacles/six-pentacles",
  "domain": "tarot",
  "title": "Seis de Ouros",
  "content": "# Seis de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nharmonia, troca, recuperação\n\n## Palavras-chave\ngenerosidade, troca, equilíbrio, ajuda\n\n## Leitura geral\nUma figura distribui moedas com uma balança. O Seis de Ouros fala de generosidade e trocas justas.\n\n## Amor\nEquilíbrio entre dar e receber.\n\n## Trabalho/recursos\nApoio, parcerias, distribuição justa.\n\n## Autoconhecimento\nPergunta como você dá e recebe.\n\n## Reversa\nInvertida, pode indicar desequilíbrio ou dependência.\n\n## Ação/reflexão\nAjude alguém sem esperar nada em troca.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/ten-pentacles": {
  "id": "tarot/minor-arcana/pentacles/ten-pentacles",
  "domain": "tarot",
  "title": "Dez de Ouros",
  "content": "# Dez de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nconclusão, ápice, fim de ciclo\n\n## Palavras-chave\nlegado, estabilidade, família, riqueza duradoura\n\n## Leitura geral\nUma família e animais diante de uma casa. O Dez de Ouros fala de legado e segurança duradoura.\n\n## Amor\nCompromisso, família, estabilidade.\n\n## Trabalho/recursos\nPatrimônio, empresas familiares.\n\n## Autoconhecimento\nPergunta o que você quer construir para durar.\n\n## Reversa\nInvertida, pode indicar conflitos familiares ou instabilidade.\n\n## Ação/reflexão\nEscreva o legado que você quer deixar.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/three-pentacles": {
  "id": "tarot/minor-arcana/pentacles/three-pentacles",
  "domain": "tarot",
  "title": "Três de Ouros",
  "content": "# Três de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nexpansão, primeiros frutos, colaboração\n\n## Palavras-chave\ncolaboração, habilidade, aprendizado, trabalho em equipe\n\n## Leitura geral\nUm artesão trabalha numa catedral, consultado por outras pessoas. O Três de Ouros fala de colaboração e trabalho bem feito.\n\n## Amor\nConstruir a relação juntos, cooperação.\n\n## Trabalho/recursos\nTrabalho em equipe, reconhecimento da competência.\n\n## Autoconhecimento\nConvida a valorizar suas habilidades.\n\n## Reversa\nInvertida, pode indicar falta de cooperação ou trabalho mal feito.\n\n## Ação/reflexão\nPeça opinião a alguém sobre um trabalho seu.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/two-pentacles": {
  "id": "tarot/minor-arcana/pentacles/two-pentacles",
  "domain": "tarot",
  "title": "Dois de Ouros",
  "content": "# Dois de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nescolha, parceria, equilíbrio entre dois polos\n\n## Palavras-chave\nequilíbrio, adaptação, malabarismo, prioridades\n\n## Leitura geral\nUma figura equilibra duas moedas em movimento. O Dois de Ouros fala de adaptar-se e equilibrar demandas.\n\n## Amor\nConciliar relação e outras áreas da vida.\n\n## Trabalho/recursos\nMúltiplas tarefas, gestão do tempo.\n\n## Autoconhecimento\nPergunta como você distribui sua energia.\n\n## Reversa\nInvertida, pode indicar sobrecarga ou desorganização.\n\n## Ação/reflexão\nOrganize suas tarefas em ordem de prioridade.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/README": {
  "id": "tarot/minor-arcana/swords/README",
  "domain": "tarot",
  "title": "Espadas",
  "content": "# Espadas\n\npensamento, comunicação, conflito, decisão, discernimento\n\nO significado de cada carta surge da combinação entre número/corte + naipe + posição + pergunta.",
  "sources": []
 },
 "tarot/minor-arcana/swords/ace-swords": {
  "id": "tarot/minor-arcana/swords/ace-swords",
  "domain": "tarot",
  "title": "Ás de Espadas",
  "content": "# Ás de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ninício, potencial, semente\n\n## Palavras-chave\nclareza, verdade, ideia nova, decisão\n\n## Leitura geral\nUma espada coroada surge da nuvem. O Ás de Espadas fala de clareza mental, verdade e de uma ideia que corta a confusão.\n\n## Amor\nConversa honesta, clareza sobre o que se quer.\n\n## Trabalho/recursos\nIdeia nova, decisão firme, comunicação objetiva.\n\n## Autoconhecimento\nConvida a buscar a verdade, mesmo que desconfortável.\n\n## Reversa\nInvertida, pode indicar confusão, mal-entendidos ou palavras usadas para ferir.\n\n## Ação/reflexão\nEscreva em uma frase o que você realmente pensa sobre uma situação.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/eight-swords": {
  "id": "tarot/minor-arcana/swords/eight-swords",
  "domain": "tarot",
  "title": "Oito de Espadas",
  "content": "# Oito de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nmovimento, esforço, mudança de ritmo\n\n## Palavras-chave\nrestrição, medo, sensação de prisão, limites mentais\n\n## Leitura geral\nUma figura vendada cercada de espadas, mas com espaço para sair. O Oito de Espadas fala de prisões mentais.\n\n## Amor\nSensação de não ter saída, medo de agir.\n\n## Trabalho/recursos\nLimitações percebidas, falta de opções aparente.\n\n## Autoconhecimento\nPergunta quais limites são reais e quais são crença.\n\n## Reversa\nInvertida, pode indicar libertação e novas perspectivas.\n\n## Ação/reflexão\nListe três crenças que te limitam e uma prova contrária para cada.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/five-swords": {
  "id": "tarot/minor-arcana/swords/five-swords",
  "domain": "tarot",
  "title": "Cinco de Espadas",
  "content": "# Cinco de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nconflito, perda, desafio que move\n\n## Palavras-chave\nconflito, derrota, vitória vazia, tensão\n\n## Leitura geral\nUma figura recolhe espadas enquanto outras se afastam. O Cinco de Espadas fala de vitórias que custam caro.\n\n## Amor\nDiscussões em que ninguém ganha, orgulho, distância.\n\n## Trabalho/recursos\nCompetição desleal, conflitos internos.\n\n## Autoconhecimento\nConvida a pensar se vale a pena vencer a qualquer custo.\n\n## Reversa\nInvertida, pode indicar reconciliação ou desejo de encerrar o conflito.\n\n## Ação/reflexão\nPense numa discussão recente: o que você ganharia cedendo?",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/four-swords": {
  "id": "tarot/minor-arcana/swords/four-swords",
  "domain": "tarot",
  "title": "Quatro de Espadas",
  "content": "# Quatro de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nestabilidade, pausa, estrutura\n\n## Palavras-chave\ndescanso, recuperação, pausa, recolhimento\n\n## Leitura geral\nUma figura repousa sobre um túmulo, com três espadas na parede. O Quatro de Espadas fala de descanso e recuperação.\n\n## Amor\nPausa na relação, tempo para pensar.\n\n## Trabalho/recursos\nDescanso necessário, férias, planejamento silencioso.\n\n## Autoconhecimento\nPergunta quando você descansou de verdade pela última vez.\n\n## Reversa\nInvertida, pode indicar esgotamento ou retorno à atividade.\n\n## Ação/reflexão\nReserve um período sem tarefas nesta semana.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/king-swords": {
  "id": "tarot/minor-arcana/swords/king-swords",
  "domain": "tarot",
  "title": "Rei de Espadas",
  "content": "# Rei de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ncorte — maturidade ativa, liderança, domínio externo\n\n## Palavras-chave\nautoridade intelectual, razão, justiça, decisão\n\n## Leitura geral\nO Rei de Espadas, sentado, segura a espada erguida. Fala de autoridade intelectual e decisões racionais.\n\n## Amor\nRacionalidade, conversas objetivas.\n\n## Trabalho/recursos\nLiderança, estratégia, decisões éticas.\n\n## Autoconhecimento\nPergunta como você equilibra razão e empatia.\n\n## Reversa\nInvertida, pode indicar manipulação ou rigidez.\n\n## Ação/reflexão\nTome uma decisão pendente com base em fatos.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/knight-swords": {
  "id": "tarot/minor-arcana/swords/knight-swords",
  "domain": "tarot",
  "title": "Cavaleiro de Espadas",
  "content": "# Cavaleiro de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ncorte — ação, busca, movimento intenso\n\n## Palavras-chave\npressa, ação direta, ambição, objetividade\n\n## Leitura geral\nO Cavaleiro de Espadas avança em velocidade. Fala de ação rápida e objetiva.\n\n## Amor\nFranqueza, impulsividade nas palavras.\n\n## Trabalho/recursos\nDeterminação, pressa para resolver.\n\n## Autoconhecimento\nPergunta se a pressa ajuda ou atropela.\n\n## Reversa\nInvertida, pode indicar agressividade ou falta de direção.\n\n## Ação/reflexão\nAntes de responder a algo, conte até dez.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/nine-swords": {
  "id": "tarot/minor-arcana/swords/nine-swords",
  "domain": "tarot",
  "title": "Nove de Espadas",
  "content": "# Nove de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nquase completo, intensidade, resultado próximo\n\n## Palavras-chave\nansiedade, preocupação, insônia, medo\n\n## Leitura geral\nUma figura acorda com as mãos no rosto, nove espadas na parede. O Nove de Espadas fala de ansiedade e preocupação.\n\n## Amor\nMedos, ciúmes ou preocupações que tiram o sono.\n\n## Trabalho/recursos\nEstresse, pensamentos repetitivos.\n\n## Autoconhecimento\nConvida a separar o medo do fato e a pedir apoio.\n\n## Reversa\nInvertida, pode indicar alívio ou ansiedade guardada.\n\n## Ação/reflexão\nAntes de dormir, escreva suas preocupações em um papel e deixe-as ali.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/page-swords": {
  "id": "tarot/minor-arcana/swords/page-swords",
  "domain": "tarot",
  "title": "Pajem de Espadas",
  "content": "# Pajem de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ncorte — aprendizado, curiosidade, mensagem\n\n## Palavras-chave\ncuriosidade, vigilância, novas ideias, comunicação\n\n## Leitura geral\nO Pajem de Espadas segura a espada atento ao vento. Fala de curiosidade intelectual e vigilância.\n\n## Amor\nConversas, curiosidade, atenção aos sinais.\n\n## Trabalho/recursos\nAprendizado, pesquisa, novas ideias.\n\n## Autoconhecimento\nConvida a pensar antes de falar.\n\n## Reversa\nInvertida, pode indicar fofoca, desatenção ou pressa.\n\n## Ação/reflexão\nFaça uma pergunta que você evita fazer.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/queen-swords": {
  "id": "tarot/minor-arcana/swords/queen-swords",
  "domain": "tarot",
  "title": "Rainha de Espadas",
  "content": "# Rainha de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ncorte — maturidade receptiva, cuidado, domínio interno\n\n## Palavras-chave\nclareza, independência, franqueza, discernimento\n\n## Leitura geral\nA Rainha de Espadas ergue a espada com olhar firme. Fala de clareza, independência e franqueza.\n\n## Amor\nComunicação honesta, limites claros.\n\n## Trabalho/recursos\nAnálise lúcida, imparcialidade.\n\n## Autoconhecimento\nConvida a dizer a verdade com cuidado.\n\n## Reversa\nInvertida, pode indicar frieza ou dureza excessiva.\n\n## Ação/reflexão\nDiga a alguém algo verdadeiro com gentileza.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/seven-swords": {
  "id": "tarot/minor-arcana/swords/seven-swords",
  "domain": "tarot",
  "title": "Sete de Espadas",
  "content": "# Sete de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\navaliação, persistência, prova\n\n## Palavras-chave\nestratégia, esperteza, segredo, desonestidade\n\n## Leitura geral\nUma figura leva espadas escondida. O Sete de Espadas fala de estratégia, mas também de segredos e atalhos.\n\n## Amor\nFalta de transparência, segredos ou jogo de estratégia.\n\n## Trabalho/recursos\nAgir com estratégia; cuidado com atalhos e desonestidade.\n\n## Autoconhecimento\nConvida a perceber onde você está se enganando.\n\n## Reversa\nInvertida, pode indicar confissão, verdade que aparece ou arrependimento.\n\n## Ação/reflexão\nPergunte-se: há algo que eu esteja escondendo de mim?",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/six-swords": {
  "id": "tarot/minor-arcana/swords/six-swords",
  "domain": "tarot",
  "title": "Seis de Espadas",
  "content": "# Seis de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nharmonia, troca, recuperação\n\n## Palavras-chave\ntransição, travessia, mudança, seguir em frente\n\n## Leitura geral\nUma barca leva figuras para águas calmas. O Seis de Espadas fala de transição e de deixar a turbulência para trás.\n\n## Amor\nSeguir em frente, superar uma fase difícil.\n\n## Trabalho/recursos\nMudança de emprego, projeto ou cidade. Transição gradual.\n\n## Autoconhecimento\nPergunta o que você leva na travessia e o que deixa.\n\n## Reversa\nInvertida, pode indicar resistência à mudança ou bagagem emocional.\n\n## Ação/reflexão\nEscreva o que fica para trás nesta transição.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/ten-swords": {
  "id": "tarot/minor-arcana/swords/ten-swords",
  "domain": "tarot",
  "title": "Dez de Espadas",
  "content": "# Dez de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nconclusão, ápice, fim de ciclo\n\n## Palavras-chave\nfim, encerramento doloroso, fundo do poço, recomeço\n\n## Leitura geral\nUma figura deitada com dez espadas nas costas, o sol nascendo ao fundo. O Dez de Espadas fala de um fim definitivo e da chance de recomeçar.\n\n## Amor\nFim de um ciclo afetivo, sensação de derrota.\n\n## Trabalho/recursos\nFim de um projeto, ruptura. O pior já passou.\n\n## Autoconhecimento\nPergunta o que precisa terminar para você se reerguer.\n\n## Reversa\nInvertida, pode indicar recuperação lenta ou resistência ao fim.\n\n## Ação/reflexão\nEscreva o que você aprendeu com um fim doloroso.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/three-swords": {
  "id": "tarot/minor-arcana/swords/three-swords",
  "domain": "tarot",
  "title": "Três de Espadas",
  "content": "# Três de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nexpansão, primeiros frutos, colaboração\n\n## Palavras-chave\ndor, mágoa, tristeza, verdade dolorosa\n\n## Leitura geral\nUm coração atravessado por três espadas sob a chuva. O Três de Espadas fala de dor emocional e de verdades que machucam.\n\n## Amor\nMágoa, decepção, separação ou ciúme. Pede acolher a dor.\n\n## Trabalho/recursos\nCrítica dura, frustração, conflito na equipe.\n\n## Autoconhecimento\nConvida a reconhecer a dor sem negá-la nem se definir por ela.\n\n## Reversa\nInvertida, pode indicar recuperação, perdão ou dor guardada.\n\n## Ação/reflexão\nEscreva o que te machucou e o que você precisa para cuidar disso.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/two-swords": {
  "id": "tarot/minor-arcana/swords/two-swords",
  "domain": "tarot",
  "title": "Dois de Espadas",
  "content": "# Dois de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nescolha, parceria, equilíbrio entre dois polos\n\n## Palavras-chave\nimpasse, indecisão, bloqueio, equilíbrio frágil\n\n## Leitura geral\nUma figura vendada cruza duas espadas diante do peito. O Dois de Espadas fala de impasse e de evitar enxergar uma decisão.\n\n## Amor\nIndecisão, evitar uma conversa, sentimentos bloqueados.\n\n## Trabalho/recursos\nDecisão adiada, falta de informação, neutralidade forçada.\n\n## Autoconhecimento\nPergunta o que você não quer ver.\n\n## Reversa\nInvertida, pode indicar que a decisão se aproxima ou que a confusão aumenta.\n\n## Ação/reflexão\nListe os prós e contras de uma decisão adiada e marque uma data para decidir.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/README": {
  "id": "tarot/minor-arcana/wands/README",
  "domain": "tarot",
  "title": "Paus",
  "content": "# Paus\n\nação, criatividade, iniciativa, energia, projetos\n\nO significado de cada carta surge da combinação entre número/corte + naipe + posição + pergunta.",
  "sources": []
 },
 "tarot/minor-arcana/wands/ace-wands": {
  "id": "tarot/minor-arcana/wands/ace-wands",
  "domain": "tarot",
  "title": "Ás de Paus",
  "content": "# Ás de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ninício, potencial, semente\n\n## Palavras-chave\nfaísca, inspiração, vontade de começar, energia criativa\n\n## Leitura geral\nUma mão sai da nuvem segurando um bastão que brota: é a centelha de um começo. O Ás de Paus fala de entusiasmo, de uma ideia que pede ação e da energia disponível para criar.\n\n## Amor\nAtração, desejo renovado ou vontade de tomar iniciativa. Pode ser o início de algo novo ou um sopro de vida numa relação.\n\n## Trabalho/recursos\nIdeia nova, projeto que quer nascer, motivação para começar. Bom momento para dar o primeiro passo prático.\n\n## Autoconhecimento\nPergunta o que acende você de verdade e o que tem apagado esse fogo.\n\n## Reversa\nInvertida, a faísca pode existir sem combustível: ideias que não saem do lugar, atraso ou desânimo. Vale perguntar o que falta para começar.\n\n## Ação/reflexão\nEscreva uma ideia que te anima e faça hoje a menor ação possível em direção a ela.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/eight-wands": {
  "id": "tarot/minor-arcana/wands/eight-wands",
  "domain": "tarot",
  "title": "Oito de Paus",
  "content": "# Oito de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nmovimento, esforço, mudança de ritmo\n\n## Palavras-chave\nvelocidade, notícias, movimento, avanço rápido\n\n## Leitura geral\nOito bastões cruzam o céu em voo. O Oito de Paus fala de movimento rápido, mensagens e coisas que se aceleram.\n\n## Amor\nMensagens, encontros rápidos, sentimentos que avançam depressa.\n\n## Trabalho/recursos\nAndamento acelerado, resultados chegando, viagens e comunicação intensa.\n\n## Autoconhecimento\nConvida a perceber como você lida com a velocidade: aproveita ou se atropela?\n\n## Reversa\nInvertida, pode indicar atrasos, mensagens desencontradas ou pressa que gera erro.\n\n## Ação/reflexão\nResolva hoje três pendências rápidas que estão travando algo maior.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/five-wands": {
  "id": "tarot/minor-arcana/wands/five-wands",
  "domain": "tarot",
  "title": "Cinco de Paus",
  "content": "# Cinco de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nconflito, perda, desafio que move\n\n## Palavras-chave\ncompetição, atrito, disputa, energia caótica\n\n## Leitura geral\nCinco figuras brandem bastões umas contra as outras, sem ferir ninguém de verdade. O Cinco de Paus fala de atritos, disputas de ego e do caos de muitas vontades ao mesmo tempo.\n\n## Amor\nDiscussões, competição ou ruído na comunicação. Pede atenção para o que é briga de verdade e o que é só disputa por espaço.\n\n## Trabalho/recursos\nConcorrência, divergência em equipe, muitas opiniões. Pode ser estímulo ou desgaste.\n\n## Autoconhecimento\nPergunta como você reage quando precisa disputar espaço.\n\n## Reversa\nInvertida, pode indicar conflito evitado, acordo após disputa ou tensão que fica escondida.\n\n## Ação/reflexão\nNuma discussão desta semana, repita com suas palavras o que a outra pessoa disse antes de responder.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/four-wands": {
  "id": "tarot/minor-arcana/wands/four-wands",
  "domain": "tarot",
  "title": "Quatro de Paus",
  "content": "# Quatro de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nestabilidade, pausa, estrutura\n\n## Palavras-chave\ncelebração, lar, estabilidade, comemoração\n\n## Leitura geral\nQuatro bastões formam um portal enfeitado e pessoas celebram ao fundo. O Quatro de Paus fala de um ponto de chegada alegre, de casa e de comunidade.\n\n## Amor\nMomento de celebração, compromisso, vida a dois ou encontros com família e amigos.\n\n## Trabalho/recursos\nMarco atingido, equipe em harmonia, ambiente de trabalho acolhedor.\n\n## Autoconhecimento\nConvida a reconhecer suas conquistas e a celebrar com quem você ama.\n\n## Reversa\nInvertida, pode indicar tensão em casa, celebração adiada ou sensação de não pertencer.\n\n## Ação/reflexão\nOrganize um encontro simples para comemorar algo que deu certo, mesmo pequeno.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/king-wands": {
  "id": "tarot/minor-arcana/wands/king-wands",
  "domain": "tarot",
  "title": "Rei de Paus",
  "content": "# Rei de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ncorte — maturidade ativa, liderança, domínio externo\n\n## Palavras-chave\nvisão, liderança, ousadia, empreendedorismo\n\n## Leitura geral\nO Rei de Paus olha adiante com o bastão na mão. Fala de liderança visionária e de transformar ideias em realizações.\n\n## Amor\nRelação com projeto em comum, iniciativa e proteção.\n\n## Trabalho/recursos\nEmpreendedorismo, visão de longo prazo, liderar pelo exemplo.\n\n## Autoconhecimento\nPergunta como você usa sua capacidade de inspirar pessoas.\n\n## Reversa\nInvertida, pode indicar autoritarismo, impaciência ou expectativas altas demais.\n\n## Ação/reflexão\nEscreva sua visão para um projeto em uma frase e compartilhe com alguém.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/knight-wands": {
  "id": "tarot/minor-arcana/wands/knight-wands",
  "domain": "tarot",
  "title": "Cavaleiro de Paus",
  "content": "# Cavaleiro de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ncorte — ação, busca, movimento intenso\n\n## Palavras-chave\nimpulso, aventura, paixão, ação rápida\n\n## Leitura geral\nO Cavaleiro de Paus avança num cavalo empinado. Fala de energia intensa, aventura e impulso.\n\n## Amor\nPaixão, intensidade, atração que chega rápido. Pede atenção à constância.\n\n## Trabalho/recursos\nAção rápida, mudanças, coragem para arriscar. Cuidado com a pressa.\n\n## Autoconhecimento\nPergunta onde a sua impulsividade ajuda e onde atrapalha.\n\n## Reversa\nInvertida, pode indicar precipitação, raiva ou energia que se dispersa.\n\n## Ação/reflexão\nAntes de uma decisão impulsiva, espere um dia e veja se a vontade continua.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/nine-wands": {
  "id": "tarot/minor-arcana/wands/nine-wands",
  "domain": "tarot",
  "title": "Nove de Paus",
  "content": "# Nove de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nquase completo, intensidade, resultado próximo\n\n## Palavras-chave\nresiliência, persistência, cautela, última etapa\n\n## Leitura geral\nUma figura ferida, mas de pé, segura um bastão diante de oito outros. O Nove de Paus fala de resistência e de estar perto do fim de um desafio.\n\n## Amor\nCautela depois de experiências difíceis, defesa emocional. Pergunta se a proteção ainda é necessária.\n\n## Trabalho/recursos\nCansaço da reta final, persistência. Falta pouco.\n\n## Autoconhecimento\nConvida a reconhecer sua força e a perceber quando a guarda alta já não serve.\n\n## Reversa\nInvertida, pode indicar exaustão, desconfiança excessiva ou vontade de desistir perto do fim.\n\n## Ação/reflexão\nNomeie a última etapa de algo difícil e peça ajuda para uma parte dela.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/page-wands": {
  "id": "tarot/minor-arcana/wands/page-wands",
  "domain": "tarot",
  "title": "Pajem de Paus",
  "content": "# Pajem de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ncorte — aprendizado, curiosidade, mensagem\n\n## Palavras-chave\nentusiasmo, curiosidade, novidade, mensagem\n\n## Leitura geral\nO Pajem de Paus observa o bastão com interesse. Fala de entusiasmo de quem está começando, de curiosidade e de notícias.\n\n## Amor\nFlerte, interesse novo, energia jovem na relação.\n\n## Trabalho/recursos\nAprender algo novo, notícias sobre projetos, ideias frescas.\n\n## Autoconhecimento\nConvida a recuperar a curiosidade de iniciante.\n\n## Reversa\nInvertida, pode indicar falta de foco, ideias que não se sustentam ou impaciência.\n\n## Ação/reflexão\nSepare meia hora para aprender algo novo por pura curiosidade.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/queen-wands": {
  "id": "tarot/minor-arcana/wands/queen-wands",
  "domain": "tarot",
  "title": "Rainha de Paus",
  "content": "# Rainha de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ncorte — maturidade receptiva, cuidado, domínio interno\n\n## Palavras-chave\nconfiança, carisma, calor, determinação\n\n## Leitura geral\nA Rainha de Paus está no trono com um girassol e um gato preto. Fala de confiança, carisma e de uma presença calorosa e independente.\n\n## Amor\nAutoconfiança no amor, magnetismo, afeto generoso.\n\n## Trabalho/recursos\nLiderança calorosa, energia social, determinação.\n\n## Autoconhecimento\nConvida a ocupar espaço com confiança e calor.\n\n## Reversa\nInvertida, pode indicar insegurança, ciúme ou energia esgotada.\n\n## Ação/reflexão\nFaça hoje algo que exige confiança e observe como você se sente depois.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/seven-wands": {
  "id": "tarot/minor-arcana/wands/seven-wands",
  "domain": "tarot",
  "title": "Sete de Paus",
  "content": "# Sete de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\navaliação, persistência, prova\n\n## Palavras-chave\ndefesa, firmeza, convicção, sustentar posição\n\n## Leitura geral\nUma figura no alto defende-se de seis bastões que vêm de baixo. O Sete de Paus fala de sustentar uma posição diante de pressão.\n\n## Amor\nDefender seus limites ou a própria relação diante de opiniões externas. Pede firmeza sem se fechar.\n\n## Trabalho/recursos\nConcorrência forte, necessidade de defender ideias ou projetos. Persistência.\n\n## Autoconhecimento\nPergunta pelo que vale a pena lutar e o que é só teimosia.\n\n## Reversa\nInvertida, pode indicar cansaço de se defender, sensação de estar sem forças ou recuar por medo.\n\n## Ação/reflexão\nEscreva uma posição sua que você quer manter e o argumento mais simples para ela.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/six-wands": {
  "id": "tarot/minor-arcana/wands/six-wands",
  "domain": "tarot",
  "title": "Seis de Paus",
  "content": "# Seis de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nharmonia, troca, recuperação\n\n## Palavras-chave\nreconhecimento, vitória, confiança, progresso\n\n## Leitura geral\nUma figura cavalga coroada de louros, cercada de pessoas. O Seis de Paus fala de reconhecimento público e de colher o resultado do esforço.\n\n## Amor\nTer o próprio valor reconhecido pelo outro, orgulho do vínculo, relação que se mostra.\n\n## Trabalho/recursos\nReconhecimento, promoção, resultados visíveis. Bom momento para mostrar o trabalho.\n\n## Autoconhecimento\nConvida a aceitar elogios e a reconhecer suas vitórias sem diminuí-las.\n\n## Reversa\nInvertida, pode indicar falta de reconhecimento, insegurança ou dependência da aprovação alheia.\n\n## Ação/reflexão\nAnote uma conquista recente e conte para alguém de confiança.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/ten-wands": {
  "id": "tarot/minor-arcana/wands/ten-wands",
  "domain": "tarot",
  "title": "Dez de Paus",
  "content": "# Dez de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nconclusão, ápice, fim de ciclo\n\n## Palavras-chave\nsobrecarga, responsabilidade, peso, excesso de tarefas\n\n## Leitura geral\nUma figura carrega dez bastões com dificuldade. O Dez de Paus fala do peso de assumir tudo sem dividir com ninguém.\n\n## Amor\nRelação que pesa ou em que uma pessoa carrega quase tudo. Pede divisão de responsabilidades.\n\n## Trabalho/recursos\nExcesso de trabalho, acúmulo de funções, dificuldade de delegar.\n\n## Autoconhecimento\nPergunta o que você carrega por hábito e não por necessidade.\n\n## Reversa\nInvertida, pode indicar o momento de soltar parte do peso ou um colapso por excesso.\n\n## Ação/reflexão\nListe suas tarefas da semana e risque ou delegue duas.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/three-wands": {
  "id": "tarot/minor-arcana/wands/three-wands",
  "domain": "tarot",
  "title": "Três de Paus",
  "content": "# Três de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nexpansão, primeiros frutos, colaboração\n\n## Palavras-chave\nexpansão, horizonte, espera ativa, perspectiva\n\n## Leitura geral\nUma figura observa navios no mar, de costas, como quem espera o retorno do que lançou. O Três de Paus fala de expansão e de ver os primeiros resultados ao longe.\n\n## Amor\nRelação que amplia horizontes, distância geográfica ou planos em comum que começam a ganhar forma.\n\n## Trabalho/recursos\nCrescimento, parcerias externas, comércio, viagens. Os esforços iniciais começam a dar retorno.\n\n## Autoconhecimento\nPergunta até onde você se permite enxergar e sonhar.\n\n## Reversa\nInvertida, pode indicar atrasos, frustração com a demora ou visão curta demais para o que se quer.\n\n## Ação/reflexão\nListe três coisas que você já colocou em movimento e confira o andamento de cada uma.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/two-wands": {
  "id": "tarot/minor-arcana/wands/two-wands",
  "domain": "tarot",
  "title": "Dois de Paus",
  "content": "# Dois de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nescolha, parceria, equilíbrio entre dois polos\n\n## Palavras-chave\nplanejamento, visão, decisão de rumo\n\n## Leitura geral\nUma figura segura o mundo nas mãos e olha o horizonte do alto de um castelo: é o momento de planejar. O Dois de Paus fala de escolher direção depois do primeiro impulso.\n\n## Amor\nDecisão sobre o futuro da relação ou sobre sair da zona de conforto afetiva. Pede conversa sobre planos.\n\n## Trabalho/recursos\nPlanejamento de longo prazo, escolha entre ficar no seguro ou expandir. Bom para traçar metas.\n\n## Autoconhecimento\nConvida a perceber se você está pensando grande ou apenas esperando.\n\n## Reversa\nInvertida, pode indicar medo de sair do conhecido, planos indefinidos ou excesso de análise.\n\n## Ação/reflexão\nDesenhe dois cenários para os próximos seis meses e escolha um passo que vale para os dois.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/spreads/daily-card": {
  "id": "tarot/spreads/daily-card",
  "domain": "tarot",
  "title": "Carta do Dia",
  "content": "# Carta do Dia\n\n1 carta.\n\nPerguntas:\n- Qual tema merece minha atenção hoje?\n- O que posso observar?\n- Qual atitude consciente posso experimentar?\n\nSaída:\n- carta\n- orientação\n- reflexão\n- microação",
  "sources": []
 },
 "tarot/spreads/love-3-cards": {
  "id": "tarot/spreads/love-3-cards",
  "domain": "tarot",
  "title": "Tarot do Amor — 3 cartas",
  "content": "# Tarot do Amor — 3 cartas\n\n1. Energia atual\n2. Dinâmica/tema\n3. Reflexão ou orientação\n\nNão usar como “previsão de quem vai voltar”, “vai terminar” ou garantia de relacionamento.",
  "sources": []
 },
 "tarot/spreads/open-question": {
  "id": "tarot/spreads/open-question",
  "domain": "tarot",
  "title": "Pergunta Aberta — 3 cartas",
  "content": "# Pergunta Aberta — 3 cartas\n\n1. O que está em destaque?\n2. O que pode estar sendo ignorado?\n3. Que perspectiva/ação pode ser útil?\n\nA IA deve distinguir carta, interpretação e sugestão.",
  "sources": []
 }
};
