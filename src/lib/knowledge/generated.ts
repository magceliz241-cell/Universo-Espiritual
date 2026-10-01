// ARQUIVO GERADO por scripts/build-knowledge.ts a partir de knowledge/. Não edite à mão.
// Rode: npm run build:knowledge
import type { KnowledgeDoc } from "./types";

export const KNOWLEDGE_VERSION = "2.0+d875080a1953";

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
  "title": "00 — The Fool",
  "content": "# 00 — The Fool\n\n## Palavras-chave\nnovos começos, abertura, espontaneidade\n\n## Expressão reversa / bloqueada\nimprudência, falta de planejamento\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/01-the-magician": {
  "id": "tarot/major-arcana/01-the-magician",
  "domain": "tarot",
  "title": "01 — The Magician",
  "content": "# 01 — The Magician\n\n## Palavras-chave\niniciativa, habilidade, recursos, manifestação prática\n\n## Expressão reversa / bloqueada\nmanipulação, dispersão, potencial não utilizado\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/02-the-high-priestess": {
  "id": "tarot/major-arcana/02-the-high-priestess",
  "domain": "tarot",
  "title": "02 — The High Priestess",
  "content": "# 02 — The High Priestess\n\n## Palavras-chave\nintuição, silêncio, mistério, conhecimento interno\n\n## Expressão reversa / bloqueada\npassividade, segredos, desconexão da intuição\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/03-the-empress": {
  "id": "tarot/major-arcana/03-the-empress",
  "domain": "tarot",
  "title": "03 — The Empress",
  "content": "# 03 — The Empress\n\n## Palavras-chave\nfertilidade simbólica, criação, cuidado, abundância\n\n## Expressão reversa / bloqueada\nexcesso, dependência, estagnação\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/04-the-emperor": {
  "id": "tarot/major-arcana/04-the-emperor",
  "domain": "tarot",
  "title": "04 — The Emperor",
  "content": "# 04 — The Emperor\n\n## Palavras-chave\nestrutura, autoridade, limites, liderança\n\n## Expressão reversa / bloqueada\nrigidez, controle, autoritarismo\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/05-the-hierophant": {
  "id": "tarot/major-arcana/05-the-hierophant",
  "domain": "tarot",
  "title": "05 — The Hierophant",
  "content": "# 05 — The Hierophant\n\n## Palavras-chave\ntradição, ensino, valores, instituição\n\n## Expressão reversa / bloqueada\ndogmatismo, conformidade, resistência\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/06-the-lovers": {
  "id": "tarot/major-arcana/06-the-lovers",
  "domain": "tarot",
  "title": "06 — The Lovers",
  "content": "# 06 — The Lovers\n\n## Palavras-chave\nescolha, vínculo, valores, união\n\n## Expressão reversa / bloqueada\nindecisão, conflito de valores, idealização\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/07-the-chariot": {
  "id": "tarot/major-arcana/07-the-chariot",
  "domain": "tarot",
  "title": "07 — The Chariot",
  "content": "# 07 — The Chariot\n\n## Palavras-chave\ndireção, determinação, movimento, autocontrole\n\n## Expressão reversa / bloqueada\npressa, conflito interno, perda de direção\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/08-strength": {
  "id": "tarot/major-arcana/08-strength",
  "domain": "tarot",
  "title": "08 — Strength",
  "content": "# 08 — Strength\n\n## Palavras-chave\ncoragem, compaixão, domínio interior, serenidade\n\n## Expressão reversa / bloqueada\nforça bruta, insegurança, repressão\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/09-the-hermit": {
  "id": "tarot/major-arcana/09-the-hermit",
  "domain": "tarot",
  "title": "09 — The Hermit",
  "content": "# 09 — The Hermit\n\n## Palavras-chave\nintrospecção, busca, sabedoria, recolhimento\n\n## Expressão reversa / bloqueada\nisolamento, fechamento, excesso de introspecção\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/10-wheel-of-fortune": {
  "id": "tarot/major-arcana/10-wheel-of-fortune",
  "domain": "tarot",
  "title": "10 — Wheel of Fortune",
  "content": "# 10 — Wheel of Fortune\n\n## Palavras-chave\nciclos, mudança, oportunidade, movimento\n\n## Expressão reversa / bloqueada\ninstabilidade, resistência ao ciclo, sensação de falta de controle\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/11-justice": {
  "id": "tarot/major-arcana/11-justice",
  "domain": "tarot",
  "title": "11 — Justice",
  "content": "# 11 — Justice\n\n## Palavras-chave\nequilíbrio, consequência, clareza, responsabilidade\n\n## Expressão reversa / bloqueada\nrigidez, julgamento, falta de imparcialidade\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/12-the-hanged-man": {
  "id": "tarot/major-arcana/12-the-hanged-man",
  "domain": "tarot",
  "title": "12 — The Hanged Man",
  "content": "# 12 — The Hanged Man\n\n## Palavras-chave\npausa, nova perspectiva, entrega, suspensão\n\n## Expressão reversa / bloqueada\nestagnação, vitimização, adiamento\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/13-death": {
  "id": "tarot/major-arcana/13-death",
  "domain": "tarot",
  "title": "13 — Death",
  "content": "# 13 — Death\n\n## Palavras-chave\nfim de ciclo, transformação, desapego, transição\n\n## Expressão reversa / bloqueada\nresistência à mudança, apego ao passado\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/14-temperance": {
  "id": "tarot/major-arcana/14-temperance",
  "domain": "tarot",
  "title": "14 — Temperance",
  "content": "# 14 — Temperance\n\n## Palavras-chave\nintegração, moderação, mistura, equilíbrio\n\n## Expressão reversa / bloqueada\nexcesso, falta de ritmo, extremos\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/15-the-devil": {
  "id": "tarot/major-arcana/15-the-devil",
  "domain": "tarot",
  "title": "15 — The Devil",
  "content": "# 15 — The Devil\n\n## Palavras-chave\napego, desejo, compulsão, sombra, materialidade\n\n## Expressão reversa / bloqueada\nnegação, dependência, aprisionamento\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/16-the-tower": {
  "id": "tarot/major-arcana/16-the-tower",
  "domain": "tarot",
  "title": "16 — The Tower",
  "content": "# 16 — The Tower\n\n## Palavras-chave\nruptura, revelação, colapso de estrutura, mudança abrupta\n\n## Expressão reversa / bloqueada\nresistência, medo da ruptura, prolongamento do inevitável\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/17-the-star": {
  "id": "tarot/major-arcana/17-the-star",
  "domain": "tarot",
  "title": "17 — The Star",
  "content": "# 17 — The Star\n\n## Palavras-chave\nesperança, inspiração, renovação, orientação\n\n## Expressão reversa / bloqueada\ndesânimo, expectativa idealizada, falta de aterramento\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/18-the-moon": {
  "id": "tarot/major-arcana/18-the-moon",
  "domain": "tarot",
  "title": "18 — The Moon",
  "content": "# 18 — The Moon\n\n## Palavras-chave\nincerteza, imaginação, sonhos, ambiguidade\n\n## Expressão reversa / bloqueada\nconfusão, medo projetado, interpretação precipitada\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/19-the-sun": {
  "id": "tarot/major-arcana/19-the-sun",
  "domain": "tarot",
  "title": "19 — The Sun",
  "content": "# 19 — The Sun\n\n## Palavras-chave\nclareza, vitalidade, alegria, visibilidade\n\n## Expressão reversa / bloqueada\nexcesso de exposição, otimismo sem medida\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/20-judgement": {
  "id": "tarot/major-arcana/20-judgement",
  "domain": "tarot",
  "title": "20 — Judgement",
  "content": "# 20 — Judgement\n\n## Palavras-chave\nreavaliação, chamado, despertar, decisão\n\n## Expressão reversa / bloqueada\nculpa, autocondenação, resistência ao chamado\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm",
   "https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/tarot-meaning-cheat-sheets-infographics-plus-free-printable-resource"
  ]
 },
 "tarot/major-arcana/21-the-world": {
  "id": "tarot/major-arcana/21-the-world",
  "domain": "tarot",
  "title": "21 — The World",
  "content": "# 21 — The World\n\n## Palavras-chave\nconclusão, integração, realização, fechamento\n\n## Expressão reversa / bloqueada\ninacabamento, dificuldade de reconhecer conclusão\n\n## Leitura geral\nUse os temas da carta para construir uma narrativa contextual. Não tratar a carta como previsão objetiva.\n\n## Amor\nPerguntar: o que este símbolo sugere sobre vínculo, escolha, comunicação, limites ou disponibilidade emocional?\n\n## Autoconhecimento\nPerguntar: que comportamento, valor, medo ou possibilidade o símbolo pode ajudar o usuário a observar?\n\n## Ação/reflexão\nTransformar a leitura em uma pergunta ou pequeno exercício concreto.",
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
  "content": "# Ás de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ninício, potencial, semente\n\n## Leitura combinada\nCombine o tema de “início, potencial, semente” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/eight-cups": {
  "id": "tarot/minor-arcana/cups/eight-cups",
  "domain": "tarot",
  "title": "8 de Copas",
  "content": "# 8 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nprocesso, repetição, desenvolvimento, movimento\n\n## Leitura combinada\nCombine o tema de “processo, repetição, desenvolvimento, movimento” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/five-cups": {
  "id": "tarot/minor-arcana/cups/five-cups",
  "domain": "tarot",
  "title": "5 de Copas",
  "content": "# 5 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ntensão, mudança, desafio\n\n## Leitura combinada\nCombine o tema de “tensão, mudança, desafio” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/four-cups": {
  "id": "tarot/minor-arcana/cups/four-cups",
  "domain": "tarot",
  "title": "4 de Copas",
  "content": "# 4 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nestabilidade, pausa, estrutura\n\n## Leitura combinada\nCombine o tema de “estabilidade, pausa, estrutura” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/king-cups": {
  "id": "tarot/minor-arcana/cups/king-cups",
  "domain": "tarot",
  "title": "Rei de Copas",
  "content": "# Rei de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nmaturidade, direção, domínio consciente do naipe\n\n## Leitura combinada\nCombine o tema de “maturidade, direção, domínio consciente do naipe” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/knight-cups": {
  "id": "tarot/minor-arcana/cups/knight-cups",
  "domain": "tarot",
  "title": "Cavaleiro de Copas",
  "content": "# Cavaleiro de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nmovimento, busca, impulso, ação\n\n## Leitura combinada\nCombine o tema de “movimento, busca, impulso, ação” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/nine-cups": {
  "id": "tarot/minor-arcana/cups/nine-cups",
  "domain": "tarot",
  "title": "9 de Copas",
  "content": "# 9 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nmaturação, autonomia, resultado próximo\n\n## Leitura combinada\nCombine o tema de “maturação, autonomia, resultado próximo” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/page-cups": {
  "id": "tarot/minor-arcana/cups/page-cups",
  "domain": "tarot",
  "title": "Pajem de Copas",
  "content": "# Pajem de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\naprendizado, mensagem, curiosidade, início de expressão\n\n## Leitura combinada\nCombine o tema de “aprendizado, mensagem, curiosidade, início de expressão” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/queen-cups": {
  "id": "tarot/minor-arcana/cups/queen-cups",
  "domain": "tarot",
  "title": "Rainha de Copas",
  "content": "# Rainha de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nmaturidade interna, domínio receptivo/expressivo do naipe\n\n## Leitura combinada\nCombine o tema de “maturidade interna, domínio receptivo/expressivo do naipe” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/seven-cups": {
  "id": "tarot/minor-arcana/cups/seven-cups",
  "domain": "tarot",
  "title": "7 de Copas",
  "content": "# 7 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\navaliação, estratégia, teste\n\n## Leitura combinada\nCombine o tema de “avaliação, estratégia, teste” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/six-cups": {
  "id": "tarot/minor-arcana/cups/six-cups",
  "domain": "tarot",
  "title": "6 de Copas",
  "content": "# 6 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nmovimento, ajuste, troca, transição\n\n## Leitura combinada\nCombine o tema de “movimento, ajuste, troca, transição” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/ten-cups": {
  "id": "tarot/minor-arcana/cups/ten-cups",
  "domain": "tarot",
  "title": "10 de Copas",
  "content": "# 10 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\nculminação, carga, conclusão de ciclo\n\n## Leitura combinada\nCombine o tema de “culminação, carga, conclusão de ciclo” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/three-cups": {
  "id": "tarot/minor-arcana/cups/three-cups",
  "domain": "tarot",
  "title": "3 de Copas",
  "content": "# 3 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ndesenvolvimento, colaboração, expansão\n\n## Leitura combinada\nCombine o tema de “desenvolvimento, colaboração, expansão” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/cups/two-cups": {
  "id": "tarot/minor-arcana/cups/two-cups",
  "domain": "tarot",
  "title": "2 de Copas",
  "content": "# 2 de Copas\n\n## Naipe\nCopas — emoção, vínculos, intimidade, imaginação, receptividade\n\n## Número / corte\ndualidade, escolha, equilíbrio, parceria\n\n## Leitura combinada\nCombine o tema de “dualidade, escolha, equilíbrio, parceria” com o domínio de cups. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
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
  "content": "# Ás de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ninício, potencial, semente\n\n## Leitura combinada\nCombine o tema de “início, potencial, semente” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/eight-pentacles": {
  "id": "tarot/minor-arcana/pentacles/eight-pentacles",
  "domain": "tarot",
  "title": "8 de Ouros",
  "content": "# 8 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nprocesso, repetição, desenvolvimento, movimento\n\n## Leitura combinada\nCombine o tema de “processo, repetição, desenvolvimento, movimento” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/five-pentacles": {
  "id": "tarot/minor-arcana/pentacles/five-pentacles",
  "domain": "tarot",
  "title": "5 de Ouros",
  "content": "# 5 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ntensão, mudança, desafio\n\n## Leitura combinada\nCombine o tema de “tensão, mudança, desafio” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/four-pentacles": {
  "id": "tarot/minor-arcana/pentacles/four-pentacles",
  "domain": "tarot",
  "title": "4 de Ouros",
  "content": "# 4 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nestabilidade, pausa, estrutura\n\n## Leitura combinada\nCombine o tema de “estabilidade, pausa, estrutura” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/king-pentacles": {
  "id": "tarot/minor-arcana/pentacles/king-pentacles",
  "domain": "tarot",
  "title": "Rei de Ouros",
  "content": "# Rei de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nmaturidade, direção, domínio consciente do naipe\n\n## Leitura combinada\nCombine o tema de “maturidade, direção, domínio consciente do naipe” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/knight-pentacles": {
  "id": "tarot/minor-arcana/pentacles/knight-pentacles",
  "domain": "tarot",
  "title": "Cavaleiro de Ouros",
  "content": "# Cavaleiro de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nmovimento, busca, impulso, ação\n\n## Leitura combinada\nCombine o tema de “movimento, busca, impulso, ação” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/nine-pentacles": {
  "id": "tarot/minor-arcana/pentacles/nine-pentacles",
  "domain": "tarot",
  "title": "9 de Ouros",
  "content": "# 9 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nmaturação, autonomia, resultado próximo\n\n## Leitura combinada\nCombine o tema de “maturação, autonomia, resultado próximo” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/page-pentacles": {
  "id": "tarot/minor-arcana/pentacles/page-pentacles",
  "domain": "tarot",
  "title": "Pajem de Ouros",
  "content": "# Pajem de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\naprendizado, mensagem, curiosidade, início de expressão\n\n## Leitura combinada\nCombine o tema de “aprendizado, mensagem, curiosidade, início de expressão” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/queen-pentacles": {
  "id": "tarot/minor-arcana/pentacles/queen-pentacles",
  "domain": "tarot",
  "title": "Rainha de Ouros",
  "content": "# Rainha de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nmaturidade interna, domínio receptivo/expressivo do naipe\n\n## Leitura combinada\nCombine o tema de “maturidade interna, domínio receptivo/expressivo do naipe” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/seven-pentacles": {
  "id": "tarot/minor-arcana/pentacles/seven-pentacles",
  "domain": "tarot",
  "title": "7 de Ouros",
  "content": "# 7 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\navaliação, estratégia, teste\n\n## Leitura combinada\nCombine o tema de “avaliação, estratégia, teste” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/six-pentacles": {
  "id": "tarot/minor-arcana/pentacles/six-pentacles",
  "domain": "tarot",
  "title": "6 de Ouros",
  "content": "# 6 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nmovimento, ajuste, troca, transição\n\n## Leitura combinada\nCombine o tema de “movimento, ajuste, troca, transição” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/ten-pentacles": {
  "id": "tarot/minor-arcana/pentacles/ten-pentacles",
  "domain": "tarot",
  "title": "10 de Ouros",
  "content": "# 10 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\nculminação, carga, conclusão de ciclo\n\n## Leitura combinada\nCombine o tema de “culminação, carga, conclusão de ciclo” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/three-pentacles": {
  "id": "tarot/minor-arcana/pentacles/three-pentacles",
  "domain": "tarot",
  "title": "3 de Ouros",
  "content": "# 3 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ndesenvolvimento, colaboração, expansão\n\n## Leitura combinada\nCombine o tema de “desenvolvimento, colaboração, expansão” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/pentacles/two-pentacles": {
  "id": "tarot/minor-arcana/pentacles/two-pentacles",
  "domain": "tarot",
  "title": "2 de Ouros",
  "content": "# 2 de Ouros\n\n## Naipe\nOuros — corpo, recursos, trabalho, estabilidade, materialização\n\n## Número / corte\ndualidade, escolha, equilíbrio, parceria\n\n## Leitura combinada\nCombine o tema de “dualidade, escolha, equilíbrio, parceria” com o domínio de pentacles. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
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
  "content": "# Ás de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ninício, potencial, semente\n\n## Leitura combinada\nCombine o tema de “início, potencial, semente” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/eight-swords": {
  "id": "tarot/minor-arcana/swords/eight-swords",
  "domain": "tarot",
  "title": "8 de Espadas",
  "content": "# 8 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nprocesso, repetição, desenvolvimento, movimento\n\n## Leitura combinada\nCombine o tema de “processo, repetição, desenvolvimento, movimento” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/five-swords": {
  "id": "tarot/minor-arcana/swords/five-swords",
  "domain": "tarot",
  "title": "5 de Espadas",
  "content": "# 5 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ntensão, mudança, desafio\n\n## Leitura combinada\nCombine o tema de “tensão, mudança, desafio” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/four-swords": {
  "id": "tarot/minor-arcana/swords/four-swords",
  "domain": "tarot",
  "title": "4 de Espadas",
  "content": "# 4 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nestabilidade, pausa, estrutura\n\n## Leitura combinada\nCombine o tema de “estabilidade, pausa, estrutura” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/king-swords": {
  "id": "tarot/minor-arcana/swords/king-swords",
  "domain": "tarot",
  "title": "Rei de Espadas",
  "content": "# Rei de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nmaturidade, direção, domínio consciente do naipe\n\n## Leitura combinada\nCombine o tema de “maturidade, direção, domínio consciente do naipe” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/knight-swords": {
  "id": "tarot/minor-arcana/swords/knight-swords",
  "domain": "tarot",
  "title": "Cavaleiro de Espadas",
  "content": "# Cavaleiro de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nmovimento, busca, impulso, ação\n\n## Leitura combinada\nCombine o tema de “movimento, busca, impulso, ação” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/nine-swords": {
  "id": "tarot/minor-arcana/swords/nine-swords",
  "domain": "tarot",
  "title": "9 de Espadas",
  "content": "# 9 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nmaturação, autonomia, resultado próximo\n\n## Leitura combinada\nCombine o tema de “maturação, autonomia, resultado próximo” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/page-swords": {
  "id": "tarot/minor-arcana/swords/page-swords",
  "domain": "tarot",
  "title": "Pajem de Espadas",
  "content": "# Pajem de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\naprendizado, mensagem, curiosidade, início de expressão\n\n## Leitura combinada\nCombine o tema de “aprendizado, mensagem, curiosidade, início de expressão” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/queen-swords": {
  "id": "tarot/minor-arcana/swords/queen-swords",
  "domain": "tarot",
  "title": "Rainha de Espadas",
  "content": "# Rainha de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nmaturidade interna, domínio receptivo/expressivo do naipe\n\n## Leitura combinada\nCombine o tema de “maturidade interna, domínio receptivo/expressivo do naipe” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/seven-swords": {
  "id": "tarot/minor-arcana/swords/seven-swords",
  "domain": "tarot",
  "title": "7 de Espadas",
  "content": "# 7 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\navaliação, estratégia, teste\n\n## Leitura combinada\nCombine o tema de “avaliação, estratégia, teste” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/six-swords": {
  "id": "tarot/minor-arcana/swords/six-swords",
  "domain": "tarot",
  "title": "6 de Espadas",
  "content": "# 6 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nmovimento, ajuste, troca, transição\n\n## Leitura combinada\nCombine o tema de “movimento, ajuste, troca, transição” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/ten-swords": {
  "id": "tarot/minor-arcana/swords/ten-swords",
  "domain": "tarot",
  "title": "10 de Espadas",
  "content": "# 10 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\nculminação, carga, conclusão de ciclo\n\n## Leitura combinada\nCombine o tema de “culminação, carga, conclusão de ciclo” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/three-swords": {
  "id": "tarot/minor-arcana/swords/three-swords",
  "domain": "tarot",
  "title": "3 de Espadas",
  "content": "# 3 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ndesenvolvimento, colaboração, expansão\n\n## Leitura combinada\nCombine o tema de “desenvolvimento, colaboração, expansão” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/swords/two-swords": {
  "id": "tarot/minor-arcana/swords/two-swords",
  "domain": "tarot",
  "title": "2 de Espadas",
  "content": "# 2 de Espadas\n\n## Naipe\nEspadas — pensamento, comunicação, conflito, decisão, discernimento\n\n## Número / corte\ndualidade, escolha, equilíbrio, parceria\n\n## Leitura combinada\nCombine o tema de “dualidade, escolha, equilíbrio, parceria” com o domínio de swords. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
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
  "content": "# Ás de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ninício, potencial, semente\n\n## Leitura combinada\nCombine o tema de “início, potencial, semente” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/eight-wands": {
  "id": "tarot/minor-arcana/wands/eight-wands",
  "domain": "tarot",
  "title": "8 de Paus",
  "content": "# 8 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nprocesso, repetição, desenvolvimento, movimento\n\n## Leitura combinada\nCombine o tema de “processo, repetição, desenvolvimento, movimento” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/five-wands": {
  "id": "tarot/minor-arcana/wands/five-wands",
  "domain": "tarot",
  "title": "5 de Paus",
  "content": "# 5 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ntensão, mudança, desafio\n\n## Leitura combinada\nCombine o tema de “tensão, mudança, desafio” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/four-wands": {
  "id": "tarot/minor-arcana/wands/four-wands",
  "domain": "tarot",
  "title": "4 de Paus",
  "content": "# 4 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nestabilidade, pausa, estrutura\n\n## Leitura combinada\nCombine o tema de “estabilidade, pausa, estrutura” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/king-wands": {
  "id": "tarot/minor-arcana/wands/king-wands",
  "domain": "tarot",
  "title": "Rei de Paus",
  "content": "# Rei de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nmaturidade, direção, domínio consciente do naipe\n\n## Leitura combinada\nCombine o tema de “maturidade, direção, domínio consciente do naipe” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/knight-wands": {
  "id": "tarot/minor-arcana/wands/knight-wands",
  "domain": "tarot",
  "title": "Cavaleiro de Paus",
  "content": "# Cavaleiro de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nmovimento, busca, impulso, ação\n\n## Leitura combinada\nCombine o tema de “movimento, busca, impulso, ação” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/nine-wands": {
  "id": "tarot/minor-arcana/wands/nine-wands",
  "domain": "tarot",
  "title": "9 de Paus",
  "content": "# 9 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nmaturação, autonomia, resultado próximo\n\n## Leitura combinada\nCombine o tema de “maturação, autonomia, resultado próximo” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/page-wands": {
  "id": "tarot/minor-arcana/wands/page-wands",
  "domain": "tarot",
  "title": "Pajem de Paus",
  "content": "# Pajem de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\naprendizado, mensagem, curiosidade, início de expressão\n\n## Leitura combinada\nCombine o tema de “aprendizado, mensagem, curiosidade, início de expressão” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/queen-wands": {
  "id": "tarot/minor-arcana/wands/queen-wands",
  "domain": "tarot",
  "title": "Rainha de Paus",
  "content": "# Rainha de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nmaturidade interna, domínio receptivo/expressivo do naipe\n\n## Leitura combinada\nCombine o tema de “maturidade interna, domínio receptivo/expressivo do naipe” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/seven-wands": {
  "id": "tarot/minor-arcana/wands/seven-wands",
  "domain": "tarot",
  "title": "7 de Paus",
  "content": "# 7 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\navaliação, estratégia, teste\n\n## Leitura combinada\nCombine o tema de “avaliação, estratégia, teste” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/six-wands": {
  "id": "tarot/minor-arcana/wands/six-wands",
  "domain": "tarot",
  "title": "6 de Paus",
  "content": "# 6 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nmovimento, ajuste, troca, transição\n\n## Leitura combinada\nCombine o tema de “movimento, ajuste, troca, transição” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/ten-wands": {
  "id": "tarot/minor-arcana/wands/ten-wands",
  "domain": "tarot",
  "title": "10 de Paus",
  "content": "# 10 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\nculminação, carga, conclusão de ciclo\n\n## Leitura combinada\nCombine o tema de “culminação, carga, conclusão de ciclo” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/three-wands": {
  "id": "tarot/minor-arcana/wands/three-wands",
  "domain": "tarot",
  "title": "3 de Paus",
  "content": "# 3 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ndesenvolvimento, colaboração, expansão\n\n## Leitura combinada\nCombine o tema de “desenvolvimento, colaboração, expansão” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
  "sources": [
   "https://sacred-texts.com/tarot/pkt/index.htm"
  ]
 },
 "tarot/minor-arcana/wands/two-wands": {
  "id": "tarot/minor-arcana/wands/two-wands",
  "domain": "tarot",
  "title": "2 de Paus",
  "content": "# 2 de Paus\n\n## Naipe\nPaus — ação, criatividade, iniciativa, energia, projetos\n\n## Número / corte\ndualidade, escolha, equilíbrio, parceria\n\n## Leitura combinada\nCombine o tema de “dualidade, escolha, equilíbrio, parceria” com o domínio de wands. A interpretação final depende da posição na tiragem e da pergunta.\n\n## Amor\nUse como lente para observar dinâmica afetiva, disponibilidade, comunicação, desejo, limites ou reciprocidade.\n\n## Trabalho/recursos\nUse o naipe como contexto, sem transformar a carta em previsão financeira.\n\n## Reversa\nPode indicar bloqueio, excesso, internalização, atraso ou expressão desequilibrada do tema. Escolher a interpretação pelo contexto, não por regra mecânica.",
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
