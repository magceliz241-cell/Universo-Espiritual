# Metodologias — Seu Universo

## 1. Astrologia ocidental tropical — MVP

### Zodíaco
- Tropical.
- 12 signos.
- 30° por signo.
- Longitude normalizada em [0°, 360°).

### Motor
XALEN Ephemeris.
- Não usar Swiss Ephemeris como runtime.
- O motor deve ficar atrás de uma interface `EphemerisEngine`.
- Registrar `engine_name` e `engine_version` no resultado.
- Registrar `calculation_method` (analítico ou DE440).

### Casas
O MVP deve usar **Placidus** como padrão inicial, salvo se a auditoria do XALEN recomendar outra configuração por limitações operacionais. O campo `house_system` é obrigatório e deve ser versionado.
Para latitudes polares/condições degeneradas, o sistema deve respeitar o fallback documentado pelo XALEN; não criar fallback silencioso próprio.

### Planetas
MVP:
Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.

Pontos:
Ascendant, MC, Mean Node/True Node, Chiron e Lilith podem ser adicionados quando suportados e testados.

### Aspectos
MVP:
- conjunction 0°
- sextile 60°
- square 90°
- trine 120°
- opposition 180°

Orbs são configuração, não lógica espalhada pelo código.

### Sinastria
Calcular dois mapas separadamente e depois comparar longitudes/aspectos entre os corpos dos dois mapas. Não reduzir a compatibilidade a um único score sem uma metodologia explicitamente definida.

## 2. Numerologia

Método principal: pitagórico.

Números:
- 1–9
- 11, 22 e 33 como mestres quando a regra da métrica os preservar.

Toda métrica deve ter:
- nome;
- fórmula;
- regra de redução;
- tratamento de números mestres;
- versão.

Não misturar métodos pitagórico e caldeu.

## 3. Tarot

Rider-Waite-Smith como tradição de referência.

78 cartas:
- 22 Maiores
- 56 Menores
- Paus, Copas, Espadas, Ouros
- Ás–10 + Pajem, Cavaleiro, Rainha, Rei.

O software sorteia; a KB fornece significados; a IA interpreta.

A aleatoriedade deve ser feita pelo runtime criptograficamente seguro quando o objetivo for sorteio real. Nunca pedir à IA para "sortear".

## 4. Lua

Astronomia:
- fases calculadas pelo software/motor astronômico.
- ciclo sinódico médio ~29,5 dias.

Simbolismo:
- conteúdo de reflexão/ritual, nunca promessa causal.

## 5. Sonhos

Não existe tabela universal validada que atribua significado único a símbolos.
Cada entrada deve conter:
- associações possíveis;
- contexto emocional;
- perguntas reflexivas;
- interpretações alternativas.

Nunca diagnosticar doença, trauma ou estado mental a partir de sonho.

## 6. Personalização

A interpretação deve combinar:
`resultado calculado + contexto da pessoa + Knowledge Base relevante + tarefa`.

Não deve combinar arbitrariamente todas as tradições em uma única leitura.
