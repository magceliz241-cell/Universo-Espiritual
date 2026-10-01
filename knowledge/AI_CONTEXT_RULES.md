# Regras de contexto para a IA

## Nunca enviar
- toda a KB
- todos os sonhos
- todo histórico de conversa
- segredos ou chaves
- dados pessoais irrelevantes.

## Enviar
Somente:
1. tarefa
2. pergunta
3. dados calculados relevantes
4. trechos relevantes da KB
5. contexto explícito do usuário
6. formato de saída.

## Exemplo — Perfil Amoroso

```json
{
  "task":"love_profile",
  "chart":{
    "sun":{"sign":"Leo","degree":18},
    "moon":{"sign":"Pisces","degree":3},
    "venus":{"sign":"Cancer","degree":12},
    "mars":{"sign":"Libra","degree":7}
  },
  "knowledge":[
    "conteúdo de Leo",
    "conteúdo de Pisces",
    "conteúdo de Cancer",
    "conteúdo de Libra",
    "conteúdo de Venus",
    "conteúdo de Mars"
  ]
}
```

## Exemplo — Tarot

Enviar somente as cartas sorteadas, posições, orientação e conhecimento dessas cartas.

## Regra
A IA interpreta dados. Ela não calcula posições nem sorteia cartas.
